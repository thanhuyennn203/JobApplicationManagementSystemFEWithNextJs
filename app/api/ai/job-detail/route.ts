import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
    try {
        const { job, generalInfo } = await req.json();

        const prompt = `
You are a recruitment expert. Based on the job information below, generate suggested content for the job detail fields.

Job information:
- Title: ${job?.title ?? ""}
- Company: ${job?.company_name ?? ""}
- Salary range: ${job?.salary_min ?? ""} - ${job?.salary_max ?? ""}
- Required experience: ${job?.experienceRequired ?? ""}
- Tags: ${(job?.tags ?? []).join(", ")}

General information:
- Rank: ${generalInfo?.rank ?? ""}
- Education: ${generalInfo?.education ?? ""}
- Number of recruitment: ${generalInfo?.numberOfRecruitment ?? ""}
- Working style: ${generalInfo?.workingStyle ?? ""}

Return ONLY a JSON object with the following keys (no extra text, no markdown):
{
  "description": "...",
  "requirement": "...",
  "income": "...",
  "interest": "...",
  "allowance": "...",
  "working_equipment": "...",
  "working_location": "...",
  "working_time": "...",
  "apply_by": "..."
}
        `;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are an AI assistant specialized in writing job posting content. Always return valid JSON."
                },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7
        });

        const content = completion.choices[0]?.message?.content;
        const suggestion = JSON.parse(content || "{}");

        return NextResponse.json(suggestion);

    } catch (err: any) {
        console.error("Groq generate error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to generate AI suggestion" },
            { status: 500 }
        );
    }
}