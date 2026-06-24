"use client";
import { Plus, Trash2, User, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import type {
  CVData, CVSection, PersonalInfo,
  EducationItem, ExperienceItem, ActivityItem,
  CertificateItem, AwardItem, SkillItem,
  SectionType,
} from "@/types/Cv.types";
import { ITEM_TEMPLATES } from "@/types/Cv.types";

// ─── Props ────────────────────────────────────────────────────────────────────
interface CVEditorPanelProps {
  cv: CVData;
  activeSection: string | null;
  collapsed: boolean;
  generating: boolean;
  onToggleCollapse: () => void;
  onUpdatePersonal: (field: keyof PersonalInfo, value: string) => void;
  onUpdateSection: (id: string, updates: Partial<CVSection>) => void;
  onAddItem: (sectionId: string, template: object) => void;
  onRemoveItem: (sectionId: string, itemId: string) => void;
  onUpdateItem: (sectionId: string, itemId: string, updates: object) => void;
  onGenerateAI: () => void;
}

export default function CVEditorPanel({
  cv, activeSection, collapsed, generating,
  onToggleCollapse, onUpdatePersonal, onUpdateSection,
  onAddItem, onRemoveItem, onUpdateItem, onGenerateAI,
}: CVEditorPanelProps) {
  const section = cv.sections.find((s) => s.id === activeSection);
  const isPersonal = activeSection === "personal" || !activeSection;

  const panelTitle = isPersonal
    ? "Personal Information"
    : section?.title ?? "Select a section";

  return (
    <div
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden flex-shrink-0 ${
        collapsed ? "w-0 border-r-0" : "w-80"
      }`}
    >
      {/* Collapse toggle tab */}
      {/* <button
        onClick={onToggleCollapse}
        className="absolute left-56 top-1/2 -translate-y-1/2 z-20 w-5 h-10 bg-white border border-gray-200 rounded-r-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
        title={collapsed ? "Open editor" : "Close editor"}
        style={{ marginLeft: collapsed ? 0 : "320px" }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button> */}

      {!collapsed && (
        <>
          {/* Panel header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{panelTitle}</p>
            {/* <button
              onClick={onGenerateAI}
              disabled={generating}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1e5538] text-white text-xs rounded-lg hover:bg-[#1a4731] disabled:opacity-50 transition-colors flex-shrink-0"
            >
              {generating ? (
                <span className="inline-block animate-spin">⟳</span>
              ) : (
                <Sparkles size={11} />
              )}
              AI Enhance
            </button> */}
          </div>

          {/* Scrollable form content */}
          <div className="flex-1 overflow-y-auto p-4">
            {isPersonal ? (
              <PersonalForm data={cv.personal} onChange={onUpdatePersonal} />
            ) : section ? (
              <SectionForm
                section={section}
                onUpdate={onUpdateSection}
                onAddItem={onAddItem}
                onRemoveItem={onRemoveItem}
                onUpdateItem={onUpdateItem}
              />
            ) : (
              <p className="text-sm text-gray-400 text-center mt-8">
                Select a section from the sidebar to edit
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Personal Form ────────────────────────────────────────────────────────────
interface PersonalFormProps {
  data: PersonalInfo;
  onChange: (field: keyof PersonalInfo, value: string) => void;
}

function PersonalForm({ data, onChange }: PersonalFormProps) {
  const fields: { key: keyof PersonalInfo; label: string; type?: string }[] = [
    { key: "fullName", label: "Full Name" },
    { key: "jobTitle", label: "Job Title / Position Applying For" },
    { key: "dob", label: "Date of Birth", type: "date" },
    { key: "gender", label: "Gender" },
    { key: "phone", label: "Phone Number" },
    { key: "email", label: "Email Address", type: "email" },
    { key: "website", label: "Website / LinkedIn" },
    { key: "address", label: "Address" },
  ];

  return (
    <div className="space-y-3">
      {/* Avatar upload */}
      <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
        <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
          {data.avatar ? (
            <img src={data.avatar} className="w-full h-full object-cover" alt="avatar" />
          ) : (
            <User size={20} className="text-gray-400" />
          )}
        </div>
        <div>
          <p className="text-xs font-medium text-gray-700">Profile Photo</p>
          <label className="text-xs text-[#1e5538] cursor-pointer hover:underline">
            Upload photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onChange("avatar" as keyof PersonalInfo, URL.createObjectURL(file));
              }}
            />
          </label>
          {data.avatar && (
            <button
              onClick={() => onChange("avatar" as keyof PersonalInfo, "")}
              className="block text-xs text-red-400 hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {fields.map((f) => (
        <FormField
          key={f.key}
          label={f.label}
          value={(data[f.key] as string) || ""}
          type={f.type}
          onChange={(v) => onChange(f.key, v)}
        />
      ))}
    </div>
  );
}

// ─── Section Form (dispatches to typed sub-forms) ─────────────────────────────
interface SectionFormProps {
  section: CVSection;
  onUpdate: (id: string, updates: Partial<CVSection>) => void;
  onAddItem: (sectionId: string, template: object) => void;
  onRemoveItem: (sectionId: string, itemId: string) => void;
  onUpdateItem: (sectionId: string, itemId: string, updates: object) => void;
}

function SectionForm({ section, onUpdate, onAddItem, onRemoveItem, onUpdateItem }: SectionFormProps) {
  return (
    <div className="space-y-4">
      {/* Section title */}
      <FormField
        label="Section Title"
        value={section.title}
        onChange={(v) => onUpdate(section.id, { title: v } as Partial<CVSection>)}
        className="font-medium"
      />

      {/* Career Goal */}
      {section.type === "career-goal" && (
        <FormField
          label="Content"
          value={section.content}
          onChange={(v) => onUpdate(section.id, { content: v } as Partial<CVSection>)}
          textarea
          rows={5}
        />
      )}

      {/* Education */}
      {section.type === "education" &&
        section.items.map((item, idx) => (
          <ItemCard
            key={item.id}
            index={idx}
            onRemove={() => onRemoveItem(section.id, item.id)}
          >
            <EducationForm
              item={item}
              onChange={(u) => onUpdateItem(section.id, item.id, u)}
            />
          </ItemCard>
        ))}

      {/* Experience */}
      {section.type === "experience" &&
        section.items.map((item, idx) => (
          <ItemCard
            key={item.id}
            index={idx}
            onRemove={() => onRemoveItem(section.id, item.id)}
          >
            <ExperienceForm
              item={item}
              onChange={(u) => onUpdateItem(section.id, item.id, u)}
            />
          </ItemCard>
        ))}

      {/* Activity */}
      {section.type === "activity" &&
        section.items.map((item, idx) => (
          <ItemCard
            key={item.id}
            index={idx}
            onRemove={() => onRemoveItem(section.id, item.id)}
          >
            <ActivityForm
              item={item}
              onChange={(u) => onUpdateItem(section.id, item.id, u)}
            />
          </ItemCard>
        ))}

      {/* Certificate */}
      {section.type === "certificate" &&
        section.items.map((item, idx) => (
          <ItemCard
            key={item.id}
            index={idx}
            onRemove={() => onRemoveItem(section.id, item.id)}
          >
            <CertificateForm
              item={item}
              onChange={(u) => onUpdateItem(section.id, item.id, u)}
            />
          </ItemCard>
        ))}

      {/* Award */}
      {section.type === "award" &&
        section.items.map((item, idx) => (
          <ItemCard
            key={item.id}
            index={idx}
            onRemove={() => onRemoveItem(section.id, item.id)}
          >
            <AwardForm
              item={item}
              onChange={(u) => onUpdateItem(section.id, item.id, u)}
            />
          </ItemCard>
        ))}

      {/* Skill */}
      {section.type === "skill" &&
        section.items.map((item, idx) => (
          <ItemCard
            key={item.id}
            index={idx}
            onRemove={() => onRemoveItem(section.id, item.id)}
          >
            <SkillForm
              item={item}
              onChange={(u) => onUpdateItem(section.id, item.id, u)}
            />
          </ItemCard>
        ))}

      {/* Add item button (not for career-goal) */}
      {section.type !== "career-goal" && (
        <button
          onClick={() =>
            onAddItem(section.id, ITEM_TEMPLATES[section.type as SectionType] ?? {})
          }
          className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-[#1e5538] text-[#1e5538] text-xs rounded-lg hover:bg-green-50 transition-colors"
        >
          <Plus size={13} /> Add Entry
        </button>
      )}
    </div>
  );
}

// ─── Typed Sub-Forms ──────────────────────────────────────────────────────────
function EducationForm({ item, onChange }: { item: EducationItem; onChange: (u: Partial<EducationItem>) => void }) {
  return (
    <>
      <DateRangeRow startDate={item.startDate} endDate={item.endDate} onChange={onChange} />
      <FormField label="School / University" value={item.school} onChange={(v) => onChange({ school: v })} />
      <FormField label="Major / Field of Study" value={item.major} onChange={(v) => onChange({ major: v })} />
      <FormField label="Description" value={item.description} onChange={(v) => onChange({ description: v })} textarea />
    </>
  );
}

function ExperienceForm({ item, onChange }: { item: ExperienceItem; onChange: (u: Partial<ExperienceItem>) => void }) {
  return (
    <>
      <DateRangeRow startDate={item.startDate} endDate={item.endDate} onChange={onChange} />
      <FormField label="Company" value={item.company} onChange={(v) => onChange({ company: v })} />
      <FormField label="Position / Job Title" value={item.position} onChange={(v) => onChange({ position: v })} />
      <FormField label="Description" value={item.description} onChange={(v) => onChange({ description: v })} textarea />
    </>
  );
}

function ActivityForm({ item, onChange }: { item: ActivityItem; onChange: (u: Partial<ActivityItem>) => void }) {
  return (
    <>
      <DateRangeRow startDate={item.startDate} endDate={item.endDate} onChange={onChange} />
      <FormField label="Organization" value={item.organization} onChange={(v) => onChange({ organization: v })} />
      <FormField label="Role / Position" value={item.role} onChange={(v) => onChange({ role: v })} />
      <FormField label="Description" value={item.description} onChange={(v) => onChange({ description: v })} textarea />
    </>
  );
}

function CertificateForm({ item, onChange }: { item: CertificateItem; onChange: (u: Partial<CertificateItem>) => void }) {
  return (
    <>
      <FormField label="Date / Year" value={item.date} onChange={(v) => onChange({ date: v })} />
      <FormField label="Certificate Name" value={item.name} onChange={(v) => onChange({ name: v })} />
    </>
  );
}

function AwardForm({ item, onChange }: { item: AwardItem; onChange: (u: Partial<AwardItem>) => void }) {
  return (
    <>
      <FormField label="Date / Year" value={item.date} onChange={(v) => onChange({ date: v })} />
      <FormField label="Award Name" value={item.name} onChange={(v) => onChange({ name: v })} />
    </>
  );
}

function SkillForm({ item, onChange }: { item: SkillItem; onChange: (u: Partial<SkillItem>) => void }) {
  return (
    <>
      <FormField label="Skill Category" value={item.name} onChange={(v) => onChange({ name: v })} />
      <FormField
        label="Details"
        value={item.description}
        onChange={(v) => onChange({ description: v })}
        textarea
        rows={4}
      />
    </>
  );
}

// ─── Reusable UI Primitives ───────────────────────────────────────────────────
interface FormFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  rows?: number;
  className?: string;
}

export function FormField({ label, value, onChange, type = "text", textarea, rows = 3, className = "" }: FormFieldProps) {
  const base =
    "w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#1e5538] focus:ring-1 focus:ring-[#1e5538]/20 transition-colors";
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={`${base} resize-none ${className}`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} ${className}`}
        />
      )}
    </div>
  );
}

function DateRangeRow({
  startDate,
  endDate,
  onChange,
}: {
  startDate: string;
  endDate: string;
  onChange: (u: { startDate?: string; endDate?: string }) => void;
}) {
  return (
    <div className="flex gap-2">
      <FormField
        label="Start Date"
        value={startDate}
        onChange={(v) => onChange({ startDate: v })}
        className="flex-1"
      />
      <FormField
        label="End Date"
        value={endDate}
        onChange={(v) => onChange({ endDate: v })}
        className="flex-1"
      />
    </div>
  );
}

function ItemCard({
  index,
  onRemove,
  children,
}: {
  index: number;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-100 rounded-lg p-3 bg-gray-50 space-y-2.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-400">Entry #{index + 1}</span>
        <button
          onClick={onRemove}
          className="text-red-400 hover:text-red-600 transition-colors"
          title="Remove entry"
        >
          <Trash2 size={13} />
        </button>
      </div>
      {children}
    </div>
  );
}