"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles, Upload, RotateCcw, PlusCircle,
  ChevronLeft, ChevronRight, Check, ArrowLeft, Info
} from "lucide-react";
import { CV_TEMPLATES } from "@/types/cv.templates";
import type { TemplateId } from "@/types/cv.templates";
import Image from "next/image";

// ─── Start Options ─────────────────────────────────────────────────────────────
// route: where to go when this option is selected
const OPTIONS = [
  {
    id: "ai",
    icon: Sparkles,
    title: "Content suggested by AI",
    description: "Answer a few questions — AI generates a full tailored CV for your target role.",
    route: "/candidate/cv/generate",          // → AI generate page (multi-step form)
    badge: "Recommended",
  },
  {
    id: "import",
    icon: Upload,
    title: "Import from your CV or LinkedIn",
    description: "Upload an existing CV or import from LinkedIn to reuse your information.",
    route: "/candidate/cv/create?mode=import",
    badge: null,
  },
  {
    id: "restore",
    icon: RotateCcw,
    title: "Restore unsaved copy",
    description: "Continue editing from the most recent CV you haven't saved yet.",
    route: "/candidate/cv/create?mode=restore",
    badge: null,
  },
  {
    id: "blank",
    icon: PlusCircle,
    title: "Create a CV from scratch",
    description: "Start with a blank template and enter all your information manually.",
    route: "/candidate/cv/create?mode=blank",
    badge: null,
  },
] as const;

type OptionId = (typeof OPTIONS)[number]["id"];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CVTemplatePage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("classic");
  const [selectedOption, setSelectedOption] = useState<OptionId | null>(null);
  const [previewIdx, setPreviewIdx] = useState(0);

  const currentTemplate = CV_TEMPLATES[previewIdx];

  const handleCreate = () => {
    if (!selectedOption) return;
    const option = OPTIONS.find((o) => o.id === selectedOption)!;

    // For AI route: go directly, template saved in sessionStorage
    if (selectedOption === "ai") {
      sessionStorage.setItem("selected-template", selectedTemplate);
      router.push(option.route);
      return;
    }

    // For other routes: pass template as query param
    router.push(`${option.route}&template=${selectedTemplate}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <h1 className="text-xl font-semibold text-gray-800">Create a professional CV</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Choose a template and how you want to get started
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Template name + dot nav */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {currentTemplate.name} Template
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{currentTemplate.description}</p>
          </div>
          {/* Color dot switcher */}
          <div className="flex items-center gap-2">
            {CV_TEMPLATES.map((t, i) => (
              <button
                key={t.id}
                onClick={() => {
                  setPreviewIdx(i);
                  setSelectedTemplate(t.id as TemplateId);
                }}
                title={t.name}
                className={`w-5 h-5 rounded-full border-2 transition-all ${i === previewIdx ? "scale-125 border-gray-700" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                style={{ background: t.colors.accent }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-8 items-start">
          {/* ── Left: A4 preview ── */}
          <div className="flex-1">
            <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
              {/* Arrow nav */}
              <button
                onClick={() => {
                  const i = Math.max(0, previewIdx - 1);
                  setPreviewIdx(i);
                  setSelectedTemplate(CV_TEMPLATES[i].id as TemplateId);
                }}
                disabled={previewIdx === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow disabled:opacity-25 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => {
                  const i = Math.min(CV_TEMPLATES.length - 1, previewIdx + 1);
                  setPreviewIdx(i);
                  setSelectedTemplate(CV_TEMPLATES[i].id as TemplateId);
                }}
                disabled={previewIdx === CV_TEMPLATES.length - 1}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow disabled:opacity-25 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={15} />
              </button>

              {/* A4 ratio preview */}
              {/* <div className="aspect-[210/297] w-full">
                <MiniA4Preview template={currentTemplate} />
              </div> */}
              <div className="aspect-[210/297] w-full">
                {currentTemplate.previewPdf ? (
                  <iframe
                    src={currentTemplate.previewPdf}
                    className="w-full h-full"
                    title={currentTemplate.name}
                  />
                ) : (
                  <MiniA4Preview template={currentTemplate} />
                )}
              </div>
              {/* Selected indicator */}
              {selectedTemplate === currentTemplate.id && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center shadow"
                  style={{ background: currentTemplate.colors.accent }}>
                  <Check size={13} color="#fff" strokeWidth={3} />
                </div>
              )}

              {/* Bottom: layout badge */}
              <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-gray-500 capitalize">
                  {currentTemplate.layout === "two-column" ? "Two-column layout" : "Single-column layout"}
                </span>
                <button
                  onClick={() => setSelectedTemplate(currentTemplate.id as TemplateId)}
                  className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${selectedTemplate === currentTemplate.id
                    ? "text-white"
                    : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                    }`}
                  style={selectedTemplate === currentTemplate.id
                    ? { background: currentTemplate.colors.accent }
                    : {}}
                >
                  {selectedTemplate === currentTemplate.id ? "Selected ✓" : "Select"}
                </button>
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-3 mt-4">
              {CV_TEMPLATES.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setPreviewIdx(i);
                    setSelectedTemplate(t.id as TemplateId);
                  }}
                  className={`flex-1 border-2 rounded-lg overflow-hidden transition-all ${selectedTemplate === t.id
                    ? "border-gray-700 shadow-md"
                    : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  <ThumbnailPreview template={t} />
                  <div className="py-1 text-center text-xs text-gray-600 bg-white">{t.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Options ── */}
          <div className="w-80 flex-shrink-0 flex flex-col gap-3">
            <p className="text-sm font-semibold text-gray-700">How do you want to start?</p>

            {OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isSelected
                    ? "border-[#1e5538] bg-green-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Radio */}
                    <div
                      className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "border-[#1e5538]" : "border-gray-300"
                        }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-[#1e5538]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Icon
                          size={14}
                          className={isSelected ? "text-[#1e5538]" : "text-gray-400"}
                        />
                        <span
                          className={`text-sm font-medium ${isSelected ? "text-[#1e5538]" : "text-gray-700"
                            }`}
                        >
                          {option.title}
                        </span>
                        {option.badge && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* CTA buttons */}
            <div className="flex flex-col gap-2 mt-1">
              <button
                onClick={handleCreate}
                disabled={!selectedOption}
                className="w-full py-3 rounded-xl bg-[#1e5538] text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1a4731] transition-colors"
              >
                {selectedOption === "ai" ? "✨ Generate with AI" : "Create a CV"}
              </button>
              <button
                onClick={() => router.push("/cv/templates")}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <ChevronLeft size={14} />
                View all templates
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Full A4 mini preview (scaled skeleton) ───────────────────────────────────
function MiniA4Preview({ template }: { template: (typeof CV_TEMPLATES)[0] }) {
  const isTwo = template.layout === "two-column";
  const accent = template.colors.accent;
  const secondary = template.colors.secondary;

  return (
    <div className="w-full h-full bg-white" style={{ fontFamily: "sans-serif" }}>
      {isTwo ? (
        <div className="flex h-full">
          {/* Sidebar */}
          <div
            className="w-[38%] h-full flex flex-col items-center pt-6 px-3 gap-3"
            style={{ background: template.colors.sidebar }}
          >
            <div className="w-14 h-14 rounded-full bg-white/20 mb-1" />
            <div className="h-2 rounded w-20 bg-white/50" />
            <div className="h-1.5 rounded w-16 bg-white/30 mb-2" />
            {["CONTACT", "SKILLS", "CERTIFICATIONS"].map((s) => (
              <div key={s} className="w-full">
                <div className="h-1.5 rounded mb-1.5 w-16" style={{ background: secondary, opacity: 0.9 }} />
                <div className="h-px mb-2 bg-white/20" />
                {[16, 20, 14, 18].map((w, i) => (
                  <div key={i} className="h-1.5 rounded mb-1.5 bg-white/25" style={{ width: `${w * 3}px` }} />
                ))}
              </div>
            ))}
          </div>
          {/* Main */}
          <div className="flex-1 pt-5 px-4 flex flex-col gap-4">
            {["CAREER SUMMARY", "WORK EXPERIENCE", "EDUCATION"].map((s) => (
              <div key={s}>
                <div
                  className="h-2 rounded mb-1 w-28"
                  style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 4, background: "transparent" }}
                />
                <div className="h-px bg-gray-200 mb-2" />
                {[32, 28, 36, 24].map((w, i) => (
                  <div key={i} className="h-1.5 rounded mb-1.5 bg-gray-200" style={{ width: `${w * 4}px` }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Top accent bar */}
          <div className="h-1" style={{ background: accent }} />
          {/* Header */}
          <div className="flex gap-4 px-6 pt-5 pb-4 border-b border-gray-100">
            <div
              className="flex-shrink-0 bg-gray-200"
              style={{
                width: 52, height: 52,
                borderRadius: template.id === "minimal" ? 4 : "50%",
              }}
            />
            <div className="flex-1">
              <div className="h-3 rounded bg-gray-800 w-32 mb-1.5" />
              <div className="h-2 rounded w-24 mb-3" style={{ background: secondary }} />
              <div className="grid grid-cols-2 gap-1">
                {[24, 20, 28, 22].map((w, i) => (
                  <div key={i} className="h-1.5 rounded bg-gray-200" style={{ width: `${w * 4}px` }} />
                ))}
              </div>
            </div>
          </div>
          {/* Sections */}
          <div className="px-6 pt-3 flex flex-col gap-4">
            {["CAREER SUMMARY", "WORK EXPERIENCE", "EDUCATION", "SKILLS"].map((s) => (
              <div key={s}>
                <div className="h-2 rounded mb-1 w-28 bg-gray-700" />
                <div className="h-px mb-2" style={{ background: accent, opacity: 0.4 }} />
                {[36, 28, 34, 22].map((w, i) => (
                  <div key={i} className="h-1.5 rounded mb-1.5 bg-gray-200" style={{ width: `${w * 4}px` }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Small thumbnail (strip below main preview) ────────────────────────────────
function ThumbnailPreview({ template }: { template: (typeof CV_TEMPLATES)[0] }) {
  const isTwo = template.layout === "two-column";
  return (
    <div className="w-full aspect-[3/4] bg-white overflow-hidden">
      {isTwo ? (
        <div className="flex h-full">
          <div className="w-[38%]" style={{ background: template.colors.sidebar }} />
          <div className="flex-1 pt-2 px-2">
            <div className="h-1 rounded mb-1 bg-gray-300 w-full" />
            <div className="h-px bg-gray-200 mb-1" />
            <div className="space-y-0.5">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-1 rounded bg-gray-200" style={{ width: `${70 + i * 8}%` }} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="h-0.5" style={{ background: template.colors.accent }} />
          <div className="p-2 flex gap-1.5 border-b border-gray-100">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-0.5">
              <div className="h-1.5 rounded bg-gray-700 w-12" />
              <div className="h-1 rounded w-10" style={{ background: template.colors.secondary }} />
            </div>
          </div>
          <div className="p-2 space-y-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <div className="h-1 rounded bg-gray-400 w-10 mb-0.5" />
                <div className="h-px bg-gray-200 mb-0.5" />
                <div className="h-1 rounded bg-gray-200 w-full" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}