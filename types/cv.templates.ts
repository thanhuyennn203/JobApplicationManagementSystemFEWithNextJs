// ─── Template Config ──────────────────────────────────────────────────────────

export type TemplateId = "classic" | "modern" | "minimal";

export interface CVTemplate {
  id: TemplateId;
  name: string;
  description: string;
  colors: {
    accent: string;       // primary accent (headings, borders)
    accentText: string;   // text on accent bg
    secondary: string;    // job title / subtitle color
    sidebar: string;      // sidebar bg (modern layout)
    sidebarText: string;
    border: string;
    headerBg: string;
  };
  layout: "single" | "two-column"; // single = full width, two-column = sidebar left
  previewPdf?: string,
}

export const CV_TEMPLATES: CVTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Clean & professional — red accent, full-width layout",
    colors: {
      accent: "#c0392b",
      accentText: "#ffffff",
      secondary: "#c0392b",
      sidebar: "#f5f5f5",
      sidebarText: "#333",
      border: "#ddd",
      headerBg: "#ffffff",
    },
    layout: "single",
    previewPdf: "/cv-builder/classic.pdf",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Bold sidebar with dark green — two-column layout",
    colors: {
      accent: "#1e5538",
      accentText: "#ffffff",
      secondary: "#27ae60",
      sidebar: "#1e5538",
      sidebarText: "#ffffff",
      border: "#e0e0e0",
      headerBg: "#1e5538",
    },
    layout: "two-column",   
     previewPdf: "/cv-builder/modern.pdf",

  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple & elegant — navy blue, clean lines",
    colors: {
      accent: "#2c3e50",
      accentText: "#ffffff",
      secondary: "#2980b9",
      sidebar: "#2c3e50",
      sidebarText: "#ffffff",
      border: "#bdc3c7",
      headerBg: "#ffffff",
    },
    layout: "single",
        previewPdf: "/cv-builder/minimal.pdf",
  },
];

export const getTemplate = (id: TemplateId): CVTemplate =>
  CV_TEMPLATES.find((t) => t.id === id) ?? CV_TEMPLATES[0];