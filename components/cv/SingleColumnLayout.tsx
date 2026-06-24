import type { CVData, CVSection } from "@/types/Cv.types";
import type { CVTemplate, TemplateId } from "@/types/cv.templates";

// ─── Single Column (Classic + Minimal) ───────────────────────────────────────
export default function SingleColumnLayout({ cv, template }: { cv: CVData; template: CVTemplate }) {
  const { personal, sections } = cv;
  const visible = sections.filter((s) => s.visible);
  const isMinimal = template.id === "minimal";
  return (
    <>
      <div style={{ borderTop: `4px solid ${template.colors.accent}`, padding: "18px 30px 13px", borderBottom: `1px solid ${template.colors.border}` }}>
        <div style={{ display: "flex", gap: "17px", alignItems: "flex-start" }}>
          <div style={{ width: "140px", height: "140px", borderRadius: isMinimal ? "4px" : "50%", background: "#e0e0e0", flexShrink: 0, overflow: "hidden", border: `2px solid ${template.colors.border}` }}>
            {personal.avatar && <img src={personal.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="avatar" />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "18pt", fontWeight: "700", color: "#111", marginBottom: "3px", letterSpacing: isMinimal ? "1px" : "0" }}>
              {personal.fullName || "Full Name"}
            </div>
            <div style={{ fontSize: "12pt", color: template.colors.secondary, fontWeight: "600", marginBottom: "9px" }}>
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
      <div style={{ padding: "5px 30px 22px" }}>
        {visible.map((s) => <SingleSection key={s.id} section={s} template={template} />)}
      </div>
    </>
  );
}

// ─── Single Column Section Block ──────────────────────────────────────────────
function SingleSection({ section, template }: { section: CVSection; template: CVTemplate }) {
  const isModern = template.id === "modern";
  return (
    <div style={{ marginTop: "11px", pageBreakInside: "avoid" }}>
      <div style={{ marginBottom: "6px" }}>
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
        <p style={{ color: "#444", lineHeight: "1.55", fontSize: "10.5pt", marginLeft: "4px", margin: 0 }}>{section.content}</p>
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
      return <div style={{ color: "#555", fontSize: "10pt", marginTop: "3px", lineHeight: "1.48" }}>{description}</div>;
    }
    return (
      <ul style={{ margin: "3px 0 0 15px", padding: 0, color: "#555", fontSize: "10pt", lineHeight: "1.48" }}>
        {lines.map((line, i) => <li key={i} style={{ marginBottom: "1px" }}>{line}</li>)}
      </ul>
    );
  }
  return (
    <div style={{ display: "flex", gap: "13px", marginBottom: "8px" }}>
      <div style={{ width: "84px", flexShrink: 0, color: "#888", fontSize: "9.5pt", lineHeight: 1.4, paddingTop: "1px" }}>{date}</div>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: "700", color: "#111", fontSize: "10.5pt", lineHeight: 1.3 }}>{title}</div>}
        {subtitle && <div style={{ fontStyle: "italic", color: template.colors.secondary, fontSize: "10pt", marginTop: "1px", lineHeight: 1.3 }}>{subtitle}</div>}
        {description && renderDescription(description)}
      </div>
    </div>
  );
}

function InlineRow({ date, name }: { date: string; name: string }) {
  return (
    <div style={{ display: "flex", gap: "13px", marginBottom: "3px" }}>
      <div style={{ width: "84px", flexShrink: 0, color: "#888", fontSize: "9.5pt" }}>{date}</div>
      <div style={{ color: "#222", fontSize: "10.5pt", fontWeight: "500" }}>{name}</div>
    </div>
  );
}

function SkillRow({ name, description }: { name: string; description: string }) {
  return (
    <div style={{ display: "flex", gap: "13px", marginBottom: "3px" }}>
      <div style={{ width: "84px", flexShrink: 0, color: "#222", fontSize: "10.5pt", fontWeight: "600" }}>{name}</div>
      <div style={{ color: "#555", fontSize: "10pt", paddingLeft:"15px" }}>{description}</div>
    </div>
  );
}