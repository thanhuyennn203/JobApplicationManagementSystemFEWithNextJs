"use client";
import { useState } from "react";
import {
  Plus, ChevronUp, ChevronDown, User, Briefcase,
  GraduationCap, Award, Star, Activity, Eye, EyeOff,
} from "lucide-react";
import type { CVSection, SectionType } from "../../types/cv.types";

// ─── Icon map ─────────────────────────────────────────────────────────────────
const SECTION_ICONS: Record<string, React.ElementType> = {
  "career-goal": Star,
  education: GraduationCap,
  experience: Briefcase,
  activity: Activity,
  certificate: Award,
  award: Award,
  skill: Star,
};

const ADD_SECTION_OPTIONS: { type: SectionType; label: string }[] = [
  { type: "experience", label: "Work Experience" },
  { type: "education", label: "Education" },
  { type: "skill", label: "Skills" },
  { type: "activity", label: "Activities" },
  { type: "certificate", label: "Certifications" },
  { type: "award", label: "Awards & Honors" },
  { type: "career-goal", label: "Career Goal" },
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface CVSidebarProps {
  sections: CVSection[];
  activeSection: string | null;
  onSelectSection: (id: string) => void;
  onMoveSection: (id: string, dir: -1 | 1) => void;
  onToggleVisible: (id: string) => void;
  onAddSection: (type: SectionType) => void;
}

export default function CVSidebar({
  sections,
  activeSection,
  onSelectSection,
  onMoveSection,
  onToggleVisible,
  onAddSection,
}: CVSidebarProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col overflow-y-auto flex-shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          CV Sections
        </p>
      </div>

      {/* Personal info item */}
      <div className="px-3 pt-3">
        <SidebarItem
          label="Personal Information"
          icon={User}
          active={activeSection === "personal"}
          onClick={() => onSelectSection("personal")}
        />
      </div>

      {/* Dynamic sections */}
      <div className="flex-1 px-3 py-2 space-y-0.5">
        {sections.map((section, idx) => {
          const Icon = SECTION_ICONS[section.type] || Star;
          return (
            <div key={section.id} className="group flex items-center gap-0.5">
              <SidebarItem
                label={section.title}
                icon={Icon}
                active={activeSection === section.id}
                muted={!section.visible}
                onClick={() => onSelectSection(section.id)}
                className="flex-1 min-w-0"
              />
              {/* Controls shown on hover */}
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 flex-shrink-0 transition-opacity">
                <button
                  onClick={() => onToggleVisible(section.id)}
                  className="p-0.5 text-gray-400 hover:text-gray-600"
                  title={section.visible ? "Hide section" : "Show section"}
                >
                  {section.visible ? <Eye size={11} /> : <EyeOff size={11} />}
                </button>
                <div className="flex flex-col">
                  <button
                    onClick={() => onMoveSection(section.id, -1)}
                    disabled={idx === 0}
                    className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-20"
                  >
                    <ChevronUp size={11} />
                  </button>
                  <button
                    onClick={() => onMoveSection(section.id, 1)}
                    disabled={idx === sections.length - 1}
                    className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-20"
                  >
                    <ChevronDown size={11} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add section button */}
      <div className="px-3 pb-3 relative">
        <button
          onClick={() => setShowAddMenu((v) => !v)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-[#1e5538] text-[#1e5538] text-xs font-medium hover:bg-green-50 transition-colors"
        >
          <Plus size={13} /> Add Section
        </button>

        {showAddMenu && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
            <div className="absolute bottom-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
              {ADD_SECTION_OPTIONS.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => {
                    onAddSection(opt.type);
                    setShowAddMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Sidebar Item ─────────────────────────────────────────────────────────────
interface SidebarItemProps {
  label: string;
  icon: React.ElementType;
  active: boolean;
  muted?: boolean;
  onClick: () => void;
  className?: string;
}

function SidebarItem({ label, icon: Icon, active, muted, onClick, className = "" }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
        active
          ? "bg-green-50 text-[#1e5538] font-semibold"
          : muted
          ? "text-gray-300 hover:bg-gray-50"
          : "text-gray-600 hover:bg-gray-50"
      } ${className}`}
    >
      <Icon size={13} className={active ? "text-[#1e5538] flex-shrink-0" : "text-gray-400 flex-shrink-0"} />
      <span className="truncate">{label}</span>
    </button>
  );
}