import type { CVData, CVSection } from "@/types/Cv.types";
import type { CVTemplate, TemplateId } from "@/types/cv.templates";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Cake,
  User
} from "lucide-react";

// ─── Two Column (Modern) ──────────────────────────────────────────────────────
export default function TwoColumnLayout({ cv, template }: { cv: CVData; template: CVTemplate }) {
  const { personal, sections } = cv;
  const visible = sections.filter((s) => s.visible);
  const sidebarTypes = new Set(["skill", "certificate", "award"]);
  const sidebarSections = visible.filter((s) => sidebarTypes.has(s.type));
  const mainSections = visible.filter((s) => !sidebarTypes.has(s.type));
  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Sidebar */}
      <div style={{ width: "76mm", background: template.colors.sidebar, padding: "26px 18px", flexShrink: 0 }}>
        <div style={{ textAlign: "center", marginBottom: "18px" }}>
          <div style={{ width: "144px", height: "144px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", overflow: "hidden", margin: "0 auto 10px", border: "3px solid rgba(255,255,255,0.4)" }}>
            {personal.avatar
              ? <img src={personal.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="avatar" />
              : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24pt", color: "rgba(255,255,255,0.5)" }}>{(personal.fullName || "?")[0].toUpperCase()}</div>}
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
                    gap: "8px",
                    marginBottom: "6px",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    size={12}
                    strokeWidth={1.8}
                    style={{
                      color: template.colors.secondary,
                      flexShrink: 0,
                    }}
                  />

                  <span
                    style={{
                      fontSize: "9pt",
                      color: "rgba(255,255,255,0.85)",
                      lineHeight: 1.45,
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
              <div key={item.id} style={{ marginBottom: "8px" }}>
                <div style={{ fontSize: "9.5pt", fontWeight: "600", color: "#fff", marginBottom: "2px" }}>{item.name}</div>
                {renderLines(item.description, { fontSize: "9pt", color: "rgba(255,255,255,0.75)", lineHeight: 1.4 })}
              </div>
            ))}
            {(section.type === "certificate" || section.type === "award") && section.items.map((item) => (
              <div key={item.id} style={{ marginBottom: "7px" }}>
                <div style={{ fontSize: "9.5pt", color: "#fff", lineHeight: 1.35 }}>{item.name}</div>
                <div style={{ fontSize: "9pt", color: "rgba(255,255,255,0.6)", marginTop: "1px" }}>{item.date}</div>
              </div>
            ))}
          </SidebarSection>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "26px 24px" }}>
        {mainSections.map((s) => <SingleSection key={s.id} section={s} template={template} />)}
      </div>
    </div>
  );
}

function renderLines(text: string, style: React.CSSProperties) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length <= 1) return <div style={style}>{text}</div>;
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {lines.map((line, i) => (
        <li key={i} style={{ display: "flex", gap: "6px", marginBottom: "2px", ...style }}>
          <span style={{ flexShrink: 0 }}>•</span>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}
// ─── Sidebar Section Block ────────────────────────────────────────────────────
function SidebarSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ fontSize: "9pt", fontWeight: "700", color: accent, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px", paddingBottom: "5px", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
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
    <div style={{ marginTop: "16px", pageBreakInside: "avoid" }}>
      <div style={{ marginBottom: "8px" }}>
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
        <p style={{ color: "#444", lineHeight: "1.6", fontSize: "10.5pt", marginLeft: "4px", margin: 0 }}>{section.content}</p>
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

function renderDescription(description: string) {
  const lines = description.split("\n").map(l => l.replace(/^•\s*/, "").trim()).filter(Boolean);
  if (lines.length <= 1) {
    return <div style={{ color: "#555", fontSize: "10pt", marginTop: "4px", lineHeight: "1.55" }}>{description}</div>;
  }
  return (
    <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "#555", fontSize: "10pt", lineHeight: "1.55" }}>
      {lines.map((line, i) => <li key={i} style={{ marginBottom: "2px" }}>{line}</li>)}
    </ul>
  );
}

// ─── Row Primitives ───────────────────────────────────────────────────────────
function TimelineRow({ date, title, subtitle, description, template }: { date: string; title: string; subtitle?: string; description?: string; template: CVTemplate }) {

  return (
    <div style={{ display: "flex", gap: "14px", marginBottom: "11px" }}>
      <div style={{ width: "86px", flexShrink: 0, color: "#888", fontSize: "9.5pt", lineHeight: 1.5, paddingTop: "1px" }}>{date}</div>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: "700", color: "#111", fontSize: "10.5pt", lineHeight: 1.4 }}>{title}</div>}
        {subtitle && <div style={{ fontStyle: "italic", color: template.colors.secondary, fontSize: "10pt", marginTop: "2px", lineHeight: 1.4 }}>{subtitle}</div>}
        {description && renderDescription(description)}
      </div>
    </div>
  );
}

function InlineRow({ date, name }: { date: string; name: string }) {
  return (
    <div style={{ display: "flex", gap: "14px", marginBottom: "5px" }}>
      <div style={{ width: "86px", flexShrink: 0, color: "#888", fontSize: "9.5pt" }}>{date}</div>
      <div style={{ color: "#222", fontSize: "10.5pt", fontWeight: "500" }}>{name}</div>
    </div>
  );
}

function SkillRow({
  name,
  description,
}: {
  name: string;
  description: string | string[];
}) {
  return (
    <div style={{ display: "flex", gap: "14px", marginBottom: "5px" }}>
      <div style={{ width: "86px", flexShrink: 0, color: "#222", fontSize: "10.5pt", fontWeight: "600" }}>
        {name}
      </div>
      <div style={{ color: "#555", fontSize: "10pt" }}>
        {Array.isArray(description) ? (
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {description.map((item, i) => (
              <li key={i} style={{ display: "flex", gap: "6px", marginBottom: "2px" }}>
                <span style={{ flexShrink: 0, color: "#aaa" }}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          description
        )}
      </div>
    </div>
  );
}