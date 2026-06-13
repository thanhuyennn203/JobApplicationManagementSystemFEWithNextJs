"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import type { CVData, CVSection, PersonalInfo, SectionType } from "@/types/Cv.types";
import { DEFAULT_CV, ITEM_TEMPLATES } from "@/types/Cv.types";
import type { TemplateId } from "../../types/cv.templates";
import CVSidebar from "./CVSidebar";
import CVEditorPanel from "./CVEditorPanel";
import CVPreview from "./CVPreview";
import CVToolbar from "./CVToolbar";

interface CVEditorPageProps {
  initialMode?: string;   // "ai" | "blank" | "import" | "restore"
  initialTemplate?: TemplateId;
}

export default function CVEditorPage({
  initialMode = "blank",
  initialTemplate = "classic",
}: CVEditorPageProps) {
  const [cv, setCv] = useState<CVData>(DEFAULT_CV);
  const [templateId, setTemplateId] = useState<TemplateId>(initialTemplate);
  const [activeSection, setActiveSection] = useState<string | null>("personal");
  const [editorCollapsed, setEditorCollapsed] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loadStatus, setLoadStatus] = useState<"idle" | "loading" | "done">("idle");
  const previewRef = useRef<HTMLDivElement>(null);

  // ── Load generated CV from sessionStorage (AI mode) ───────────────────────
  useEffect(() => {
    if (initialMode !== "ai") return;

    setLoadStatus("loading");

    // Load template preference saved from template selector
    const savedTemplate = sessionStorage.getItem("selected-template") as TemplateId | null;
    if (savedTemplate) {
      setTemplateId(savedTemplate);
      sessionStorage.removeItem("selected-template");
    }

    // Load generated CV data
    const stored = sessionStorage.getItem("generated-cv");
    if (stored) {
      try {
        const parsed: CVData = JSON.parse(stored);
        setCv(parsed);
        sessionStorage.removeItem("generated-cv");
      } catch (e) {
        console.error("Failed to parse generated CV:", e);
      }
    }

    // Load restored CV (restore mode)
    if (initialMode === "restore") {
      const restored = localStorage.getItem("cv-autosave");
      if (restored) {
        try { setCv(JSON.parse(restored)); } catch {}
      }
    }

    setLoadStatus("done");
  }, [initialMode]);

  // ── Auto-save to localStorage every 30s ───────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      localStorage.setItem("cv-autosave", JSON.stringify(cv));
    }, 3000);
    return () => clearInterval(id);
  }, [cv]);

  // ─── Personal ─────────────────────────────────────────────────────────────
  const updatePersonal = useCallback((field: keyof PersonalInfo, value: string) => {
    setCv((prev) => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  }, []);

  // ─── Sections ─────────────────────────────────────────────────────────────
  const updateSection = useCallback((id: string, updates: Partial<CVSection>) => {
    setCv((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  }, []);

  const toggleSectionVisible = useCallback((id: string) => {
    setCv((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)),
    }));
  }, []);

  const moveSection = useCallback((id: string, dir: -1 | 1) => {
    setCv((prev) => {
      const sections = [...prev.sections];
      const idx = sections.findIndex((s) => s.id === id);
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= sections.length) return prev;
      [sections[idx], sections[newIdx]] = [sections[newIdx], sections[idx]];
      return { ...prev, sections };
    });
  }, []);

  const addSection = useCallback((type: SectionType) => {
    const newId = `section-${Date.now()}`;
    const defaults: Record<SectionType, Omit<CVSection, "id">> = {
      "career-goal": { type: "career-goal", title: "CAREER GOAL", visible: true, content: "" },
      education:    { type: "education",    title: "EDUCATION",      visible: true, items: [{ id: `${newId}-1`, startDate: "", endDate: "", school: "", major: "", description: "" }] },
      experience:   { type: "experience",   title: "WORK EXPERIENCE", visible: true, items: [{ id: `${newId}-1`, startDate: "", endDate: "", company: "", position: "", description: "" }] },
      activity:     { type: "activity",     title: "ACTIVITIES",      visible: true, items: [{ id: `${newId}-1`, startDate: "", endDate: "", organization: "", role: "", description: "" }] },
      certificate:  { type: "certificate",  title: "CERTIFICATIONS",  visible: true, items: [{ id: `${newId}-1`, date: "", name: "" }] },
      award:        { type: "award",        title: "AWARDS & HONORS", visible: true, items: [{ id: `${newId}-1`, date: "", name: "" }] },
      skill:        { type: "skill",        title: "SKILLS",          visible: true, items: [{ id: `${newId}-1`, name: "", description: "" }] },
    };
    setCv((prev) => ({
      ...prev,
      sections: [...prev.sections, { id: newId, ...defaults[type] } as CVSection],
    }));
    setActiveSection(newId);
  }, []);

  // ─── Items ────────────────────────────────────────────────────────────────
  const addItem = useCallback((sectionId: string, template: object) => {
    const newItemId = `item-${Date.now()}`;
    setCv((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id !== sectionId || s.type === "career-goal") return s;
        return { ...s, items: [...(s as any).items, { id: newItemId, ...template }] } as CVSection;
      }),
    }));
  }, []);

  const removeItem = useCallback((sectionId: string, itemId: string) => {
    setCv((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id !== sectionId || s.type === "career-goal") return s;
        return { ...s, items: (s as any).items.filter((item: any) => item.id !== itemId) } as CVSection;
      }),
    }));
  }, []);

  const updateItem = useCallback((sectionId: string, itemId: string, updates: object) => {
    setCv((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id !== sectionId || s.type === "career-goal") return s;
        return {
          ...s,
          items: (s as any).items.map((item: any) =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        } as CVSection;
      }),
    }));
  }, []);

  // ─── AI Enhance (polish existing CV content) ───────────────────────────────
  const handleGenerateAI = useCallback(async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/cv/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cv),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setCv((prev) => ({
        ...prev,
        sections: prev.sections.map((s) => {
          if (s.type === "career-goal" && data.summary) return { ...s, content: data.summary };
          if (s.type === "experience" && data.experiences) return { ...s, items: data.experiences };
          return s;
        }),
      }));
    } catch (err) {
      console.error("AI enhance failed:", err);
    } finally {
      setGenerating(false);
    }
  }, [cv]);

  // Loading state when coming from AI generate
  if (loadStatus === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[#1e5538] flex items-center justify-center mx-auto mb-3 animate-pulse">
            <span className="text-white text-xl">✨</span>
          </div>
          <p className="text-sm text-gray-600">Loading your generated CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Top toolbar */}
      <CVToolbar cv={cv} templateId={templateId} onTemplateChange={setTemplateId} />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Section list */}
        <CVSidebar
          sections={cv.sections}
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          onMoveSection={moveSection}
          onToggleVisible={toggleSectionVisible}
          onAddSection={addSection}
        />

        {/* Center: Editor panel + collapse tab */}
        <div className="relative flex flex-shrink-0">
          <CVEditorPanel
            cv={cv}
            activeSection={activeSection}
            collapsed={editorCollapsed}
            generating={generating}
            onToggleCollapse={() => setEditorCollapsed((v) => !v)}
            onUpdatePersonal={updatePersonal}
            onUpdateSection={updateSection}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onUpdateItem={updateItem}
            onGenerateAI={handleGenerateAI}
          />

          {/* Collapse tab */}
          <button
            onClick={() => setEditorCollapsed((v) => !v)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-10 bg-white border border-gray-200 rounded-r-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            title={editorCollapsed ? "Open editor" : "Collapse editor"}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
              className={`transition-transform duration-200 ${editorCollapsed ? "rotate-180" : ""}`}>
              <path d="M6 2L3 5L6 8" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Right: Live A4 preview */}
        <div className="flex-1 overflow-auto bg-gray-300 flex justify-center py-8 px-4">
          <div className="shadow-2xl">
            <CVPreview cv={cv} templateId={templateId} ref={previewRef} />
          </div>
        </div>
      </div>
    </div>
  );
}