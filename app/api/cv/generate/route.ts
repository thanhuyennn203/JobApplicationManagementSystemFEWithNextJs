import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Request body type ────────────────────────────────────────────────────────
interface GenerateRequest {
  targetPosition: string;
  industry: string;
  seniorityLevel: string;
  experiences: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  educationLevel: string;
  skills: string;
  jobDescription: string;
  language: "english" | "vietnamese";
  tone: "professional" | "creative" | "concise";
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();

    if (!body.targetPosition?.trim()) {
      return NextResponse.json(
        { error: "Target position is required" },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(body);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.65,
      max_tokens: 4096,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const cvData = JSON.parse(raw);

    // Validate minimum shape
    if (!cvData.personal || !cvData.sections) {
      throw new Error("Invalid CV structure returned by AI");
    }

    // Enforce: AI must NOT populate personal info fields — blank them out
    // regardless of what the model returned. jobTitle is the only exception.
    cvData.personal = {
      fullName: "",
      jobTitle: cvData.personal.jobTitle ?? body.targetPosition,
      dob: "",
      gender: "",
      phone: "",
      email: "",
      website: "",
      address: "",
      avatar: null,
    };

    // Drop any education section the AI may have hallucinated —
    // education data comes from the user's own form, not AI generation.
    cvData.sections = (cvData.sections as any[]).filter(
      (s) => s.type !== "education"
    );

    return NextResponse.json(cvData);
  } catch (err: any) {
    console.error("[cv/generate] error:", err);
    return NextResponse.json(
      { error: err.message ?? "AI generation failed" },
      { status: 500 }
    );
  }
}

// ─── System Prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert CV writer and career coach with 15+ years of experience helping candidates land jobs at top companies. You write compelling, ATS-optimized CVs that highlight quantified achievements and use strong action verbs.

WHAT YOU GENERATE:
- career-goal: a polished 3-sentence professional summary
- experience: bullet-point achievements, polished from the raw descriptions provided
- skill: skills grouped into logical categories
- certificate: relevant certifications inferred from the role and experience

WHAT YOU DO NOT GENERATE (leave out entirely):
- Personal information (name, phone, email, address, DOB, gender, website) — the user fills these in themselves
- Education section — the user manages their own education data

OUTPUT RULES (CRITICAL):
- Return ONLY valid JSON matching the exact schema provided. No markdown, no explanation, no extra text.
- Every string field must be non-empty and polished — no placeholder text.
- Use strong action verbs: Led, Architected, Delivered, Increased, Reduced, Launched, Optimized, Built.
- Quantify achievements whenever possible: "Reduced load time by 40%" > "Improved performance".
- Each experience description must be 2–4 concise bullet points (use "\\n• " as separator).
- Career summary: 3 tight sentences — who the candidate is, what they bring, their goal.
- Skills: organize into 2–4 logical groups, not a flat list.
- ATS-optimize: mirror keywords from the job description when provided.`;

// ─── Dynamic Prompt Builder ───────────────────────────────────────────────────
function buildPrompt(data: GenerateRequest): string {
  const {
    targetPosition,
    industry,
    seniorityLevel,
    experiences,
    educationLevel,
    skills,
    jobDescription,
    language,
    tone,
  } = data;

  const hasExperience = experiences.some((e) => e.company || e.position);
  const hasJD = jobDescription?.trim().length > 100;

  const toneMap: Record<string, string> = {
    professional: "formal, achievement-focused, third-person implied tone",
    creative:
      "engaging, personality-driven, slightly conversational while remaining professional",
    concise:
      "punchy, minimal words, maximum impact — no fluff, every word earns its place",
  };

  const seniorityContext: Record<string, string> = {
    intern:
      "student or recent graduate with limited work experience — emphasize projects and eagerness to learn",
    junior:
      "early-career professional with 0–2 years — highlight learning speed, technical skills, and early wins",
    mid: "mid-level professional with 2–5 years — balance technical skills with ownership and impact",
    senior:
      "senior individual contributor with 5+ years — focus on leadership, system design, and measurable business impact",
    lead: "team lead or manager — emphasize team results, mentoring, cross-functional collaboration, and strategic thinking",
  };

  const experienceBlock = hasExperience
    ? experiences
        .filter((e) => e.company || e.position)
        .map(
          (e) =>
            `- Company: ${e.company || "Unknown"}
  Position: ${e.position || "Unknown"}
  Duration: ${e.duration || "Unknown"}
  Raw description: ${e.description || "No description provided"}`
        )
        .join("\n\n")
    : "No work experience provided — generate content appropriate for a fresher/entry-level candidate.";

  const jdBlock = hasJD
    ? `IMPORTANT — Job Description to optimize for:
<job_description>
${jobDescription.slice(0, 3000)}
</job_description>
Mirror the keywords, required skills, and terminology from this JD throughout the CV. Ensure the career summary directly addresses what this employer is looking for.`
    : "No specific job description provided — write for the general market in this field.";

  // educationLevel is provided as context only — so the AI can write
  // a relevant career summary, but must NOT produce an education section.
  return `Generate content for the following candidate's CV.

IMPORTANT: Do NOT include an education section in your output. The user manages education data separately. Only generate: career-goal, experience, skill, and certificate sections.

═══ CANDIDATE PROFILE ═══
Target Position: ${targetPosition}
Industry/Domain: ${industry || "General technology / business"}
Level: ${seniorityLevel} — ${seniorityContext[seniorityLevel] ?? "experienced professional"}
Education level (context only, do NOT output): ${educationLevel || "Not specified"}
Key Skills (raw input): ${skills || "Not specified — infer from experience and role"}
Writing tone: ${toneMap[tone] ?? "professional"}
Output language: ${language === "vietnamese" ? "Vietnamese (use formal Vietnamese throughout)" : "English"}

═══ WORK EXPERIENCE ═══
${experienceBlock}

═══ JOB DESCRIPTION ═══
${jdBlock}

═══ OUTPUT JSON SCHEMA ═══
Return a JSON object with EXACTLY this structure:

{
  "personal": {
    "jobTitle": "${targetPosition}"
  },
  "sections": [
    {
      "id": "career-goal",
      "type": "career-goal",
      "title": "${language === "vietnamese" ? "MỤC TIÊU NGHỀ NGHIỆP" : "CAREER SUMMARY"}",
      "visible": true,
      "content": "3-sentence professional summary targeting ${targetPosition}"
    },
    {
      "id": "experience",
      "type": "experience",
      "title": "${language === "vietnamese" ? "KINH NGHIỆM LÀM VIỆC" : "WORK EXPERIENCE"}",
      "visible": true,
      "items": [
        {
          "id": "exp-1",
          "startDate": "Mon YYYY",
          "endDate": "Mon YYYY or Present",
          "company": "Company Name",
          "position": "Job Title",
          "description": "• Achievement 1 with metric\\n• Achievement 2 with metric\\n• Achievement 3"
        }
      ]
    },
    {
      "id": "skill",
      "type": "skill",
      "title": "${language === "vietnamese" ? "KỸ NĂNG" : "SKILLS"}",
      "visible": true,
      "items": [
        { "id": "skill-1", "name": "Category", "description": "Skill 1, Skill 2, Skill 3" },
        { "id": "skill-2", "name": "Category", "description": "Skill A, Skill B" }
      ]
    },
    {
      "id": "certificate",
      "type": "certificate",
      "title": "${language === "vietnamese" ? "CHỨNG CHỈ" : "CERTIFICATIONS"}",
      "visible": true,
      "items": [
        { "id": "cert-1", "date": "YYYY", "name": "Certification Name" }
      ]
    }
  ]
}

CRITICAL REQUIREMENTS:
1. career-goal: compelling, specific to ${targetPosition}${hasJD ? ", directly referencing what the employer in the JD is seeking" : ""}.
2. experience items: polish raw descriptions into bullet-point achievements with metrics. If no experience given, create realistic placeholder content for a ${seniorityLevel}-level ${targetPosition} — label with "[Sample]" prefix.
3. skills: 2–4 categories (e.g. "Technical", "Frameworks", "Soft Skills").${hasJD ? " Prioritize skills mentioned in the job description." : ""}
4. personal block: output ONLY the jobTitle field. No other personal fields.
5. Do NOT include an education section under any circumstances.
6. All IDs must be unique strings.
7. Return ONLY the JSON object. No markdown fence, no explanation.`;
}