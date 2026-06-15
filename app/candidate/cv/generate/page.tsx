"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase, FileText, ChevronRight, ChevronLeft,
  Sparkles, Loader2, CheckCircle, AlertCircle,
  Plus, Trash2, User, Clock,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ExperienceInput {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface GenerateFormData {
  // Step 1
  targetPosition: string;
  industry: string;
  seniorityLevel: string;
  // Step 2
  experiences: ExperienceInput[];
  educationLevel: string;
  skills: string;
  // Step 3
  jobDescription: string;
  language: "english" | "vietnamese";
  tone: "professional" | "creative" | "concise";
}

const EMPTY_EXPERIENCE: Omit<ExperienceInput, "id"> = {
  company: "",
  position: "",
  duration: "",
  description: "",
};

const SENIORITY_OPTIONS = [
  { value: "intern", label: "Intern / Fresher" },
  { value: "junior", label: "Junior (0–2 years)" },
  { value: "mid", label: "Mid-level (2–5 years)" },
  { value: "senior", label: "Senior (5+ years)" },
  { value: "lead", label: "Lead / Manager" },
];

const TONE_OPTIONS = [
  { value: "professional", label: "Professional", desc: "Formal, results-focused" },
  { value: "creative", label: "Creative", desc: "Engaging, personality-driven" },
  { value: "concise", label: "Concise", desc: "Short, punchy, to the point" },
];

const STEPS = [
  { id: 1, label: "Target Role", icon: Briefcase },
  { id: 2, label: "Your Background", icon: User },
  { id: 3, label: "Job Details", icon: FileText },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CVGeneratePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<GenerateFormData>({
    targetPosition: "",
    industry: "",
    seniorityLevel: "mid",
    experiences: [{ id: "exp-1", ...EMPTY_EXPERIENCE }],
    educationLevel: "",
    skills: "",
    jobDescription: "",
    language: "english",
    tone: "professional",
  });

  const updateForm = <K extends keyof GenerateFormData>(
    key: K,
    value: GenerateFormData[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  // ── Experience helpers ─────────────────────────────────────────────────────
  const addExperience = () =>
    setForm((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { id: `exp-${Date.now()}`, ...EMPTY_EXPERIENCE },
      ],
    }));

  const removeExperience = (id: string) =>
    setForm((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));

  const updateExperience = (
    id: string,
    field: keyof Omit<ExperienceInput, "id">,
    value: string
  ) =>
    setForm((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    }));

  // ── Validation ─────────────────────────────────────────────────────────────
  const canProceed = () => {
    if (step === 1) return form.targetPosition.trim().length > 0;
    if (step === 2) return true; // background is optional
    return true;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const cvData = await res.json();
      // Store in sessionStorage so the editor can load it
      sessionStorage.setItem("generated-cv", JSON.stringify(cvData));
      router.push("/candidate/cv/create?mode=ai&source=generated");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 py-5 px-5">
        <span className="text-gray-400  cursor-pointer" onClick={() => { router.push("/candidate/cv") }}>CV Builder</span>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-gray-700 truncate max-w-[200px]">
          AI Generate
        </span>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1e5538] flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-800">Generate CV with AI</h1>
            <p className="text-xs text-gray-500">Powered by Groq · LLaMA 3.3 70B</p>
          </div>
          <StepIndicator current={step} steps={STEPS} />

        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-center gap-3">
        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mt- overflow-hidden">
          {/* Step 1: Target Role */}
          {step === 1 && (
            <StepCard
              title="What position are you applying for?"
              description="Tell us about the role so AI can tailor your CV to match exactly what employers want."
              icon={Briefcase}
            >
              <div className="space-y-5">
                <Field
                  label="Target Position *"
                  required
                  hint="Be specific — e.g. 'Senior Frontend Developer' not just 'Developer'"
                >
                  <input
                    type="text"
                    value={form.targetPosition}
                    onChange={(e) => updateForm("targetPosition", e.target.value)}
                    placeholder="e.g. Senior Frontend Developer, Product Manager, Data Analyst..."
                    className={inputCls}
                    autoFocus
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Industry / Domain">
                    <input
                      type="text"
                      value={form.industry}
                      onChange={(e) => updateForm("industry", e.target.value)}
                      placeholder="e.g. Fintech, Healthcare, E-commerce"
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Seniority Level">
                    <select
                      value={form.seniorityLevel}
                      onChange={(e) => updateForm("seniorityLevel", e.target.value)}
                      className={inputCls}
                    >
                      {SENIORITY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="CV Language">
                  <div className="flex gap-3">
                    {(["english", "vietnamese"] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => updateForm("language", lang)}
                        className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${form.language === lang
                          ? "border-[#1e5538] bg-green-50 text-[#1e5538]"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}
                      >
                        {lang === "english" ? "🇺🇸 English" : "🇻🇳 Tiếng Việt"}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </StepCard>
          )}

          {/* Step 2: Background */}
          {step === 2 && (
            <StepCard
              title="Tell us about your background"
              description="Add your experience and skills. The more detail you provide, the more personalized your CV will be. You can skip this if starting from scratch."
              icon={User}
            >
              <div className="space-y-6">
                {/* Work experience */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Work Experience
                      <span className="ml-2 text-xs text-gray-400 font-normal">(optional)</span>
                    </label>
                    <button
                      onClick={addExperience}
                      className="flex items-center gap-1.5 text-xs text-[#1e5538] font-medium hover:underline"
                    >
                      <Plus size={13} /> Add more
                    </button>
                  </div>

                  <div className="space-y-4">
                    {form.experiences.map((exp, idx) => (
                      <div
                        key={exp.id}
                        className="border border-gray-100 rounded-xl p-4 bg-gray-50 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-400">
                            Position {idx + 1}
                          </span>
                          {form.experiences.length > 1 && (
                            <button
                              onClick={() => removeExperience(exp.id)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Company</label>
                            <input
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                              placeholder="Company name"
                              className={inputSmCls}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Position</label>
                            <input
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                              placeholder="Your job title"
                              className={inputSmCls}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            <Clock size={10} className="inline mr-1" />
                            Duration
                          </label>
                          <input
                            value={exp.duration}
                            onChange={(e) => updateExperience(exp.id, "duration", e.target.value)}
                            placeholder="e.g. Jan 2022 – Dec 2023 (2 years)"
                            className={inputSmCls}
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Key responsibilities & achievements
                          </label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                            placeholder="Briefly describe what you did and achieved — AI will polish this..."
                            rows={3}
                            className={`${inputSmCls} resize-none`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <Field
                  label="Education Level"
                  hint="Optional — AI will include this in your profile"
                >
                  <input
                    type="text"
                    value={form.educationLevel}
                    onChange={(e) => updateForm("educationLevel", e.target.value)}
                    placeholder="e.g. Bachelor's in Computer Science, FPT University, 2022"
                    className={inputCls}
                  />
                </Field>

                {/* Skills */}
                <Field
                  label="Key Skills"
                  hint="List your top skills — AI will organize and expand them"
                >
                  <textarea
                    value={form.skills}
                    onChange={(e) => updateForm("skills", e.target.value)}
                    placeholder="e.g. React, TypeScript, Node.js, AWS, Agile, team leadership..."
                    rows={3}
                    className={`${inputCls} resize-none`}
                  />
                </Field>
              </div>
            </StepCard>
          )}

          {/* Step 3: Job Description + Tone */}
          {step === 3 && (
            <StepCard
              title="Job description & preferences"
              description="Paste the job description to get a CV perfectly tailored to this specific role. This step is optional but highly recommended."
              icon={FileText}
            >
              <div className="space-y-6">
                <Field
                  label="Job Description"
                  hint="Copy-paste from the job posting — AI will align your CV to match the keywords and requirements"
                >
                  <textarea
                    value={form.jobDescription}
                    onChange={(e) => updateForm("jobDescription", e.target.value)}
                    placeholder="Paste the full job description here...

                    Example:
                    We are looking for a Senior Frontend Developer with 5+ years of experience in React and TypeScript. You will be responsible for building scalable web applications, collaborating with the design team, and mentoring junior developers..."
                    rows={10}
                    className={`${inputCls} resize-none`}
                  />
                </Field>

                <Field label="Writing Tone">
                  <div className="grid grid-cols-3 gap-3">
                    {TONE_OPTIONS.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => updateForm("tone", t.value as any)}
                        className={`p-3 rounded-xl border text-left transition-all ${form.tone === t.value
                          ? "border-[#1e5538] bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <div className={`text-sm font-medium mb-0.5 ${form.tone === t.value ? "text-[#1e5538]" : "text-gray-700"}`}>
                          {t.label}
                        </div>
                        <div className="text-xs text-gray-400">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </Field>

                {/* Summary of inputs */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Summary — what AI will generate
                  </p>
                  <div className="space-y-2">
                    <SummaryRow icon="🎯" label="Role" value={form.targetPosition} />
                    {form.industry && <SummaryRow icon="🏢" label="Industry" value={form.industry} />}
                    <SummaryRow icon="📊" label="Level" value={SENIORITY_OPTIONS.find(o => o.value === form.seniorityLevel)?.label ?? ""} />
                    <SummaryRow icon="💼" label="Experience entries" value={`${form.experiences.filter(e => e.company || e.position).length} position(s)`} />
                    <SummaryRow icon="✍️" label="Tone" value={TONE_OPTIONS.find(o => o.value === form.tone)?.label ?? ""} />
                    <SummaryRow icon="🌐" label="Language" value={form.language === "english" ? "English" : "Vietnamese"} />
                    {form.jobDescription && <SummaryRow icon="📋" label="Job description" value="Provided ✓" highlight />}
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl">
                    <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>
            </StepCard>
          )}

          {/* Navigation */}
          <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={16} /> Back
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1e5538] text-white text-sm font-semibold rounded-xl hover:bg-[#1a4731] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={loading || !form.targetPosition.trim()}
                className="flex items-center gap-2.5 px-7 py-2.5 bg-[#1e5538] text-white text-sm font-semibold rounded-xl hover:bg-[#1a4731] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating your CV...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate CV
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#1e5538] flex items-center justify-center shadow-xl">
              <Sparkles size={32} className="text-white animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">Generating your CV...</p>
              <p className="text-sm text-gray-500 mt-1">AI is crafting your professional profile</p>
            </div>
            <div className="flex gap-1.5 mt-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-[#1e5538] rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StepIndicator({ current, steps }: { current: number; steps: typeof STEPS }) {
  return (
    <div className="flex-1 flex justify-center">
      <div className="flex items-center gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const done = current > step.id;
          const active = current === step.id;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${done
                      ? "bg-[#1e5538]"
                      : active
                        ? "bg-[#1e5538] ring-4 ring-[#1e5538]/20"
                        : "bg-gray-200"
                    }`}
                >
                  {done ? (
                    <CheckCircle size={14} className="text-white" />
                  ) : (
                    <Icon
                      size={13}
                      className={active ? "text-white" : "text-gray-400"}
                    />
                  )}
                </div>

                <span
                  className={`text-xs hidden sm:block ${active
                      ? "font-semibold text-gray-800"
                      : done
                        ? "text-[#1e5538]"
                        : "text-gray-400"
                    }`}
                >
                  {step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`w-8 h-[1px] mx-2 ${current > step.id
                      ? "bg-[#1e5538]"
                      : "bg-gray-200"
                    }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepCard({
  title, description, icon: Icon, children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="p-8">
      <div className="flex items-start gap-4 mb-7">
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
          <Icon size={20} className="text-[#1e5538]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({
  label, hint, required, children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function SummaryRow({
  icon, label, value, highlight,
}: {
  icon: string;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span>{icon}</span>
      <span className="text-gray-500 w-32 flex-shrink-0">{label}</span>
      <span className={`font-medium ${highlight ? "text-[#1e5538]" : "text-gray-700"}`}>
        {value || "—"}
      </span>
    </div>
  );
}

// ─── Style constants ──────────────────────────────────────────────────────────
const inputCls =
  "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1e5538] focus:ring-2 focus:ring-[#1e5538]/10 transition-colors bg-white";
const inputSmCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e5538] focus:ring-1 focus:ring-[#1e5538]/10 transition-colors bg-white";