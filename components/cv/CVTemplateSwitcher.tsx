"use client";
import { useState } from "react";
import { Palette, Check, ChevronDown, ChevronUp } from "lucide-react";
import { CV_TEMPLATES } from "@/types/cv.templates";
import type { TemplateId } from "@/types/cv.templates";

interface CVTemplateSwitcherProps {
  current: TemplateId;
  onChange: (id: TemplateId) => void;
}

export default function CVTemplateSwitcher({ current, onChange }: CVTemplateSwitcherProps) {
  const [open, setOpen] = useState(false);
  const currentTemplate = CV_TEMPLATES.find((t) => t.id === current)!;

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <Palette size={14} />
        <span className="font-medium">{currentTemplate.name}</span>
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute top-10 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-3 flex gap-3 w-max">
            {CV_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onChange(template.id as TemplateId);
                  setOpen(false);
                }}
                className={`relative flex flex-col items-center gap-2 p-2 rounded-lg transition-all hover:bg-gray-50 ${
                  current === template.id ? "ring-2 ring-offset-1" : ""
                }`}
                style={
                  current === template.id
                    ? { ringColor: template.colors.accent }
                    : {}
                }
              >
                {/* Mini A4 preview */}
                <MiniPreview template={template} />

                {/* Label */}
                <span className="text-xs font-medium text-gray-700">{template.name}</span>
                <span className="text-[10px] text-gray-400 text-center max-w-[80px] leading-tight">
                  {template.description}
                </span>

                {/* Selected badge */}
                {current === template.id && (
                  <div
                    className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: template.colors.accent }}
                  >
                    <Check size={10} color="#fff" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Mini A4 thumbnail ────────────────────────────────────────────────────────
function MiniPreview({ template }: { template: (typeof CV_TEMPLATES)[0] }) {
  const isTwo = template.layout === "two-column";

  return (
    <div
      style={{
        width: "80px",
        height: "113px", // A4 ratio
        background: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "3px",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {isTwo ? (
        /* Two-column mini */
        <div style={{ display: "flex", height: "100%" }}>
          {/* Sidebar */}
          <div style={{ width: "30px", background: template.colors.sidebar, padding: "6px 4px", flexShrink: 0 }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "rgba(255,255,255,0.25)", margin: "0 auto 5px" }} />
            <div style={{ height: "2px", background: "rgba(255,255,255,0.4)", borderRadius: "1px", marginBottom: "3px" }} />
            {[22, 18, 20, 16, 19].map((w, i) => (
              <div key={i} style={{ height: "2px", background: "rgba(255,255,255,0.2)", borderRadius: "1px", width: `${w}px`, marginBottom: "2px" }} />
            ))}
            <div style={{ height: "2px", background: template.colors.secondary, borderRadius: "1px", marginTop: "6px", marginBottom: "3px" }} />
            {[20, 16, 18].map((w, i) => (
              <div key={i} style={{ height: "2px", background: "rgba(255,255,255,0.2)", borderRadius: "1px", width: `${w}px`, marginBottom: "2px" }} />
            ))}
          </div>
          {/* Content */}
          <div style={{ flex: 1, padding: "6px 5px" }}>
            {["CAREER GOALS", "EDUCATION", "EXPERIENCE"].map((title, si) => (
              <div key={si} style={{ marginBottom: "7px" }}>
                <div style={{ borderLeft: `2px solid ${template.colors.accent}`, paddingLeft: "3px", height: "4px", marginBottom: "3px" }} />
                {[28, 22, 25, 20].map((w, i) => (
                  <div key={i} style={{ height: "2px", background: "#e5e5e5", borderRadius: "1px", width: `${w}px`, marginBottom: "2px" }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Single column mini */
        <div>
          {/* Top accent bar */}
          <div style={{ height: "3px", background: template.colors.accent }} />
          {/* Header */}
          <div style={{ padding: "5px 6px 4px", borderBottom: "1px solid #eee", display: "flex", gap: "4px", alignItems: "center" }}>
            <div style={{ width: "16px", height: "16px", borderRadius: template.id === "minimal" ? "2px" : "50%", background: "#ddd", flexShrink: 0 }} />
            <div>
              <div style={{ height: "3px", background: "#333", borderRadius: "1px", width: "28px", marginBottom: "2px" }} />
              <div style={{ height: "2px", background: template.colors.secondary, borderRadius: "1px", width: "22px", marginBottom: "3px" }} />
              {[20, 16].map((w, i) => (
                <div key={i} style={{ height: "1.5px", background: "#ddd", borderRadius: "1px", width: `${w}px`, marginBottom: "1.5px" }} />
              ))}
            </div>
          </div>
          {/* Sections */}
          {[1, 2, 3].map((si) => (
            <div key={si} style={{ padding: "4px 6px 0" }}>
              <div style={{ height: "2.5px", background: template.colors.accent === "#c0392b" ? "#e0e0e0" : template.colors.accent, opacity: 0.3, borderRadius: "1px", marginBottom: "2px" }} />
              <div style={{ height: "1px", background: "#eee", marginBottom: "3px" }} />
              {[28, 22, 25].map((w, i) => (
                <div key={i} style={{ height: "1.5px", background: "#e5e5e5", borderRadius: "1px", width: `${w}px`, marginBottom: "1.5px" }} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}