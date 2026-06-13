"use client";
import { forwardRef } from "react";
import type { CVData, CVSection } from "@/types/Cv.types";
import type { CVTemplate, TemplateId } from "@/types/cv.templates";
import { getTemplate } from "@/types/cv.templates";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Cake,
  User
} from "lucide-react";

interface CVPreviewProps {
  cv: CVData;
  templateId: TemplateId;
}

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(({ cv, templateId }, ref) => {
  const template = getTemplate(templateId);
  return (
    <div
      ref={ref}
      id="cv-a4-preview"
      style={{ width: "210mm", minHeight: "297mm", background: "#fff", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "11pt", color: "#333", boxSizing: "border-box", boxShadow: "-moz-initial" }}
    >
      {template.layout === "two-column"
        ? <TwoColumnLayout cv={cv} template={template} />
        : <SingleColumnLayout cv={cv} template={template} />}
    </div>
  );
});
CVPreview.displayName = "CVPreview";

export default CVPreview;

// ─── Single Column (Classic + Minimal) ───────────────────────────────────────
function SingleColumnLayout({ cv, template }: { cv: CVData; template: CVTemplate }) {
  const { personal, sections } = cv;
  const visible = sections.filter((s) => s.visible);
  const isMinimal = template.id === "minimal";
  return (
    <>
      <div style={{ borderTop: `4px solid ${template.colors.accent}`, padding: "20px 28px 16px", borderBottom: `1px solid ${template.colors.border}` }}>
        <div style={{ display: "flex", gap: "18px", alignItems: "flex-start" }}>
          <div style={{ width: "176px", height: "176px", borderRadius: isMinimal ? "4px" : "50%", background: "#e0e0e0", flexShrink: 0, overflow: "hidden", border: `2px solid ${template.colors.border}` }}>
            {personal.avatar && <img src={personal.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="avatar" />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "18pt", fontWeight: "700", color: "#111", marginBottom: "2px", letterSpacing: isMinimal ? "1px" : "0" }}>
              {personal.fullName || "Full Name"}
            </div>
            <div style={{ fontSize: "12pt", color: template.colors.secondary, fontWeight: "600", marginBottom: "10px" }}>
              {personal.jobTitle || "Job Title"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 32px" }}>
              {[
                { label: "Date of birth:", value: personal.dob },
                { label: "Gender:", value: personal.gender },
                { label: "Phone:", value: personal.phone },
                { label: "Email:", value: personal.email },
                { label: "Website:", value: personal.website },
                { label: "Address:", value: personal.address },
              ].filter((f) => f.value).map((f) => (
                <div key={f.label} style={{ display: "flex", gap: "5px", fontSize: "9.5pt" }}>
                  <span style={{ color: "#666", fontWeight: "600", whiteSpace: "nowrap" }}>{f.label}</span>
                  <span style={{ color: "#222" }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: "4px 28px 28px" }}>
        {visible.map((s) => <SingleSection key={s.id} section={s} template={template} />)}
      </div>
    </>
  );
}

// ─── Two Column (Modern) ──────────────────────────────────────────────────────
function TwoColumnLayout({ cv, template }: { cv: CVData; template: CVTemplate }) {
  const { personal, sections } = cv;
  const visible = sections.filter((s) => s.visible);
  const sidebarTypes = new Set(["skill", "certificate", "award"]);
  const sidebarSections = visible.filter((s) => sidebarTypes.has(s.type));
  const mainSections = visible.filter((s) => !sidebarTypes.has(s.type));
  return (
    <div style={{ display: "flex", minHeight: "297mm" }}>
      {/* Sidebar */}
      <div style={{ width: "76mm", background: template.colors.sidebar, padding: "24px 16px", flexShrink: 0 }}>
        <div style={{ textAlign: "center", marginBottom: "18px" }}>
          <div style={{ width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", overflow: "hidden", margin: "0 auto 10px", border: "3px solid rgba(255,255,255,0.4)" }}>
            {personal.avatar
              ? <img src={personal.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="avatar" />
              : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28pt", color: "rgba(255,255,255,0.5)" }}>{(personal.fullName || "?")[0].toUpperCase()}</div>}
          </div>
          <div style={{ fontSize: "13pt", fontWeight: "700", color: "#fff", lineHeight: 1.3 }}>{personal.fullName || "Full Name"}</div>
          <div style={{ fontSize: "10pt", color: "rgba(255,255,255,0.75)", marginTop: "3px" }}>{personal.jobTitle || "Job Title"}</div>
        </div>

        <SidebarSection title="CONTACT" accent={template.colors.secondary}>
          {[
            { icon: Phone, value: personal.phone },
            { icon: Mail, value: personal.email },
            { icon: Globe, value: personal.website },
            { icon: MapPin, value: personal.address },
            { icon: Cake, value: personal.dob },
            { icon: User, value: personal.gender },
          ]
            .filter((f) => f.value)
            .map((f) => {
              const Icon = f.icon;

              return (
                <div
                  key={f.value}
                  style={{
                    display: "flex",
                    gap: "6px",
                    marginBottom: "5px",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    size={13}
                    strokeWidth={1.8}
                    style={{
                      color: template.colors.secondary,
                      flexShrink: 0,
                    }}
                  />

                  <span
                    style={{
                      fontSize: "9.5pt",
                      color: "rgba(255,255,255,0.85)",
                      lineHeight: 1.4,
                    }}
                  >
                    {f.value}
                  </span>
                </div>
              );
            })}
        </SidebarSection>

        {sidebarSections.map((section) => (
          <SidebarSection key={section.id} title={section.title} accent={template.colors.secondary}>
            {section.type === "skill" && section.items.map((item) => (
              <div key={item.id} style={{ marginBottom: "7px" }}>
                <div style={{ fontSize: "9.5pt", fontWeight: "600", color: "#fff", marginBottom: "2px" }}>{item.name}</div>
                <div style={{ fontSize: "9pt", color: "rgba(255,255,255,0.75)" }}>{item.description}</div>
              </div>
            ))}
            {(section.type === "certificate" || section.type === "award") && section.items.map((item) => (
              <div key={item.id} style={{ marginBottom: "5px" }}>
                <div style={{ fontSize: "9.5pt", color: "#fff" }}>{item.name}</div>
                <div style={{ fontSize: "9pt", color: "rgba(255,255,255,0.6)" }}>{item.date}</div>
              </div>
            ))}
          </SidebarSection>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "24px 22px" }}>
        {mainSections.map((s) => <SingleSection key={s.id} section={s} template={template} />)}
      </div>
    </div>
  );
}

// ─── Sidebar Section Block ────────────────────────────────────────────────────
function SidebarSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ fontSize: "9pt", fontWeight: "700", color: accent, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px", paddingBottom: "4px", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

// ─── Single Column Section Block ──────────────────────────────────────────────
function SingleSection({ section, template }: { section: CVSection; template: CVTemplate }) {
  const isModern = template.id === "modern";
  return (
    <div style={{ marginTop: "14px", pageBreakInside: "avoid" }}>
      <div style={{ marginBottom: "7px" }}>
        {isModern ? (
          <div style={{ borderLeft: `3px solid ${template.colors.accent}`, paddingLeft: "8px", fontSize: "11.5pt", fontWeight: "700", color: template.colors.accent }}>
            {section.title}
          </div>
        ) : (
          <>
            <div style={{ fontSize: "11.5pt", fontWeight: "700", color: "#111", letterSpacing: "0.6px", textTransform: "uppercase" }}>{section.title}</div>
            <div style={{ height: "1.5px", background: template.colors.border, marginTop: "3px" }} />
          </>
        )}
      </div>

      {section.type === "career-goal" && (
        <p style={{ color: "#444", lineHeight: "1.65", fontSize: "10.5pt", marginLeft: "4px" }}>{section.content}</p>
      )}
      {section.type === "education" && section.items.map((item) => (
        <TimelineRow key={item.id} date={[item.startDate, item.endDate].filter(Boolean).join(" – ")} title={item.school} subtitle={item.major} description={item.description} template={template} />
      ))}
      {section.type === "experience" && section.items.map((item) => (
        <TimelineRow key={item.id} date={[item.startDate, item.endDate].filter(Boolean).join(" – ")} title={item.company} subtitle={item.position} description={item.description} template={template} />
      ))}
      {section.type === "activity" && section.items.map((item) => (
        <TimelineRow key={item.id} date={[item.startDate, item.endDate].filter(Boolean).join(" – ")} title={item.organization} subtitle={item.role} description={item.description} template={template} />
      ))}
      {section.type === "certificate" && section.items.map((item) => (
        <InlineRow key={item.id} date={item.date} name={item.name} />
      ))}
      {section.type === "award" && section.items.map((item) => (
        <InlineRow key={item.id} date={item.date} name={item.name} />
      ))}
      {section.type === "skill" && section.items.map((item) => (
        <SkillRow key={item.id} name={item.name} description={item.description} />
      ))}
    </div>
  );
}

// ─── Row Primitives ───────────────────────────────────────────────────────────
function TimelineRow({ date, title, subtitle, description, template }: { date: string; title: string; subtitle?: string; description?: string; template: CVTemplate }) {
  function renderDescription(description: string) {
    const lines = description.split("\n").map(l => l.replace(/^•\s*/, "").trim()).filter(Boolean);
    if (lines.length <= 1) {
      return <div style={{ color: "#555", fontSize: "10pt", marginTop: "3px", lineHeight: "1.55" }}>{description}</div>;
    }
    return (
      <ul style={{ margin: "3px 0 0 14px", padding: 0, color: "#555", fontSize: "10pt", lineHeight: "1.55" }}>
        {lines.map((line, i) => <li key={i}>{line}</li>)}
      </ul>
    );
  }
  return (
    <div style={{ display: "flex", gap: "14px", marginBottom: "10px" }}>
      <div style={{ width: "88px", flexShrink: 0, color: "#888", fontSize: "9.5pt", lineHeight: 1.5, paddingTop: "1px" }}>{date}</div>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: "700", color: "#111", fontSize: "10.5pt" }}>{title}</div>}
        {subtitle && <div style={{ fontStyle: "italic", color: template.colors.secondary, fontSize: "10pt", marginTop: "1px" }}>{subtitle}</div>}
        {/* {description && <div style={{ color: "#555", fontSize: "10pt", marginTop: "3px", lineHeight: "1.55" }}>{description}</div>} */}
        {description && renderDescription(description)}
      </div>
    </div>
  );
}

function InlineRow({ date, name }: { date: string; name: string }) {
  return (
    <div style={{ display: "flex", gap: "14px", marginBottom: "5px" }}>
      <div style={{ width: "88px", flexShrink: 0, color: "#888", fontSize: "9.5pt" }}>{date}</div>
      <div style={{ color: "#222", fontSize: "10.5pt", fontWeight: "500" }}>{name}</div>
    </div>
  );
}

function SkillRow({ name, description }: { name: string; description: string }) {
  return (
    <div style={{ display: "flex", gap: "14px", marginBottom: "5px" }}>
      <div style={{ width: "88px", flexShrink: 0, color: "#222", fontSize: "10.5pt", fontWeight: "600" }}>{name}</div>
      <div style={{ color: "#555", fontSize: "10pt" }}>{description}</div>
    </div>
  );
}