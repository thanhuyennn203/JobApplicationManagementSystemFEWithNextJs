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
const SYSTEM_PROMPT = `You are writing a CV in first-person perspective — as if you ARE the candidate. You are a professional CV writer with 15+ years of experience, but right now you are drafting this person's CV as though it is your own. Write authentically, in the voice of someone presenting their real background.

CORE PRINCIPLES:
- Write ONLY from information the user has provided. Do not invent companies, roles, metrics, certifications, or skills that were not mentioned.
- If information is sparse, write what can be honestly inferred — but keep it general and avoid fabricating specifics.
- If a section cannot be meaningfully filled due to lack of input, return minimal honest content rather than placeholder fiction.
- Personal information: if the user has provided their name, phone, email, etc., include them in the personal block. Only omit fields that were not provided.

WHAT YOU GENERATE:
- personal: populate any fields the user has provided (name, jobTitle, phone, email, website, address, dob, gender)
- career-goal: a polished 2–3 sentence professional summary written in first person ("I am...", "I bring...", "I seek...")
- experience: bullet-point achievements rewritten from the user's raw descriptions — do not add metrics or accomplishments that were not implied by the input
- skill: skills grouped into logical categories, based only on what the user listed
- certificate: only include if the user mentioned certifications; omit the section entirely if none were provided

OUTPUT RULES (CRITICAL):
- Return ONLY valid JSON matching the exact schema provided. No markdown, no explanation, no extra text.
- Do not fabricate: no fake company names, no invented percentages, no made-up certifications.
- Use strong action verbs when rewriting experience: Led, Built, Delivered, Improved, Managed, Designed — but only when supported by the user's description.
- ATS-optimize: mirror keywords from the job description when provided.
- Career summary: first-person, specific to the role, honest to the background provided.`;

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
  const hasSkills = skills?.trim().length > 0;

  const toneMap: Record<string, string> = {
    professional: "formal, achievement-focused, confident first-person",
    creative: "engaging, personality-driven, slightly conversational while remaining professional — still first-person",
    concise: "punchy, minimal words, maximum impact — no filler, every word earns its place",
  };

  const seniorityContext: Record<string, string> = {
    intern: "student or recent graduate with limited work experience — emphasize academic background, projects, and eagerness to learn",
    junior: "early-career professional with 0–2 years — highlight learning agility, technical foundation, and early contributions",
    mid: "mid-level professional with 2–5 years — balance technical skills with ownership and demonstrated impact",
    senior: "senior individual contributor with 5+ years — focus on technical depth, leadership, and measurable outcomes",
    lead: "team lead or manager — emphasize team results, mentoring, cross-functional collaboration, and strategic decisions",
  };

  const experienceBlock = hasExperience
    ? experiences
      .filter((e) => e.company || e.position)
      .map(
        (e) =>
          `- Company: ${e.company || "Unknown"}
  Position: ${e.position || "Unknown"}
  Duration: ${e.duration || "Unknown"}
  What I did (raw): ${e.description || "No description provided — rewrite only what can be inferred from the position title, do not invent specifics"}`
      )
      .join("\n\n")
    : `No work experience provided. I am a ${seniorityLevel}-level candidate targeting ${targetPosition}. Write a career summary that honestly reflects an entry-level profile. Do not generate fake experience items — omit the experience section or return an empty items array.`;

  const skillBlock = hasSkills
    ? `My skills (raw input): ${skills}`
    : `No skills provided — infer only broad, safe categories from the target role and seniority level. Keep it general (e.g. "Communication", "Problem Solving"). Do not list specific tools or technologies I didn't mention.`;

  const jdBlock = hasJD
    ? `Job Description to optimize for (mirror its keywords and requirements):
<job_description>
${jobDescription.slice(0, 3000)}
</job_description>`
    : "No job description provided — write for the general market in this field.";

  const personalNote = `Personal info fields: populate ONLY what the user has filled in. Leave all other fields as empty string "".`;

  return `You are writing MY CV. I am the candidate. Write everything in my voice, as if I am presenting myself.

Do NOT invent information. Only use what I have provided below. If something is missing, write honestly around the absence rather than fabricating details.

═══ MY PROFILE ═══
Target Position: ${targetPosition}
Industry/Domain: ${industry || "Not specified"}
Seniority Level: ${seniorityLevel} — ${seniorityContext[seniorityLevel] ?? "experienced professional"}
Education (context only, do NOT output an education section): ${educationLevel || "Not specified"}
Writing tone: ${toneMap[tone] ?? "professional"}
Output language: ${language === "vietnamese" ? "Vietnamese (use formal Vietnamese throughout, first-person)" : "English (first-person)"}

${personalNote}

═══ MY WORK EXPERIENCE ═══
${experienceBlock}

═══ MY SKILLS ═══
${skillBlock}

═══ JOB DESCRIPTION ═══
${jdBlock}

═══ OUTPUT JSON SCHEMA ═══
Return a JSON object with EXACTLY this structure:

{
  "personal": {
    "fullName": "(user's name if provided, else empty string)",
    "jobTitle": "${targetPosition}",
    "dob": "(if provided, else empty string)",
    "gender": "(if provided, else empty string)",
    "phone": "(if provided, else empty string)",
    "email": "(if provided, else empty string)",
    "website": "(if provided, else empty string)",
    "address": "(if provided, else empty string)",
    "avatar": null
  },
  "sections": [
    {
      "id": "career-goal",
      "type": "career-goal",
      "title": "${language === "vietnamese" ? "MỤC TIÊU NGHỀ NGHIỆP" : "CAREER SUMMARY"}",
      "visible": true,
      "content": "2–3 sentence first-person summary. Start with who I am, what I bring, and what I am seeking. Be honest to my background — do not overclaim."
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
          "description": "• Rewrote from my raw description\\n• Only real things I did\\n• No invented metrics"
        }
      ]
    },
    {
      "id": "skill",
      "type": "skill",
      "title": "${language === "vietnamese" ? "KỸ NĂNG" : "SKILLS"}",
      "visible": true,
      "items": [
        { "id": "skill-1", "name": "Category", "description": "Skill 1, Skill 2, Skill 3" }
      ]
    },
    {
      "id": "certificate",
      "type": "certificate",
      "title": "${language === "vietnamese" ? "CHỨNG CHỈ" : "CERTIFICATIONS"}",
      "visible": true,
      "items": []
    }
  ]
}

CRITICAL REQUIREMENTS:
1. First-person throughout — "I managed", "I built", "I am seeking".
2. Do NOT fabricate: no invented metrics, no fake certifications, no tools I didn't mention.
3. Experience: rewrite my raw descriptions into clean bullet points. If a description is empty, write only what the job title implies — keep it vague and honest.
4. Skills: only list what I provided. Group into 2–4 categories. If nothing provided, use only safe general categories.
5. Certificate items: leave as empty array [] if I mentioned no certifications. Do not generate fake ones.
6. personal block: populate every field I provided. Empty string for anything I did not provide.
7. Do NOT include an education section.
8. All IDs must be unique strings.
9. Return ONLY the JSON object. No markdown fence, no explanation.`;
}