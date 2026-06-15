"use client";
import { useState } from "react";
import { Download, Eye, X, Loader2, AlertTriangle } from "lucide-react";
import type { CVData } from "@/types/Cv.types";
import type { TemplateId } from "../../types/cv.templates";
import CVPreview from "./CVPreview";
import CVTemplateSwitcher from "./CVTemplateSwitcher";
import { useRouter } from "next/navigation";

interface CVToolbarProps {
  cv: CVData;
  templateId: TemplateId;
  onTemplateChange: (id: TemplateId) => void;
  isOverflowing?: boolean;
  overflowMm?: number;
}

export default function CVToolbar({
  cv,
  templateId,
  onTemplateChange,
  isOverflowing = false,
  overflowMm = 0,
}: CVToolbarProps) {
  const [previewing, setPreviewing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const router = useRouter();

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const element = document.getElementById("cv-a4-preview");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);

      const fileName = cv.personal.fullName
        ? `CV_${cv.personal.fullName.replace(/\s+/g, "_")}.pdf`
        : "my_cv.pdf";
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("PDF export failed. Install: npm install html2canvas jspdf");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      {/* Toolbar */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0 z-10">
        {/* Left: breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="text-gray-400 cursor-pointer" onClick={() => { router.push("/candidate/cv") }}>CV Builder</span>
          <span className="text-gray-300">/</span>
          <span className="font-medium text-gray-700 truncate max-w-[200px]">Create</span>
        </div>

        {/* Right: warning + template switcher + actions */}
        <div className="flex items-center gap-2">
          {/* Overflow warning badge */}
          {isOverflowing && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-800"
              title={`Content exceeds 1 A4 page by ~${overflowMm.toFixed(0)}mm. The overflowing part will be cut off when exporting to PDF.`}
            >
              <AlertTriangle size={13} className="flex-shrink-0" />
              <span className="hidden sm:inline">Content exceeds 1 page — it will be cut off</span>
              <span className="sm:hidden">Overflow</span>
            </div>
          )}

          {/* Template switcher */}
          <CVTemplateSwitcher current={templateId} onChange={onTemplateChange} />

          <div className="w-px h-5 bg-gray-200" />

          <button
            onClick={() => setPreviewing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Eye size={14} />
            Preview
          </button>

          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e5538] text-white rounded-lg text-sm hover:bg-[#1a4731] disabled:opacity-60 transition-colors"
          >
            {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {exporting ? "Exporting..." : "Export PDF"}
          </button>
        </div>
      </div>

      {/* Full-screen preview modal */}
      {previewing && (
        <div className="fixed inset-0 z-50 bg-white flex items-start justify-center py-8 overflow-auto no-scrollbar">
          <div className="relative max-w-3xl w-full mx-4">
            {/* Modal controls */}
            <div className="flex items-center justify-between mb-3 px-1">
              <button
                onClick={() => { setPreviewing(false); handleExportPDF(); }}
                disabled={exporting}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e5538] text-white rounded-lg text-sm hover:bg-[#1a4731] disabled:opacity-60 transition-colors"
              >
                <Download size={14} />
                Export PDF
              </button>

              <CVTemplateSwitcher current={templateId} onChange={onTemplateChange} />

              <button
                onClick={() => setPreviewing(false)}
                className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors"
              >
                <X size={16} /> Close
              </button>
            </div>

            {/* Overflow warning in modal */}
            {isOverflowing && (
              <div className="mb-3 px-4 py-2.5 bg-amber-50 border border-amber-300 rounded-lg text-sm text-amber-800 flex items-center gap-2">
                <AlertTriangle size={16} className="flex-shrink-0" />
                <span>
                  Your content exceeds 1 A4 page by ~{overflowMm.toFixed(0)}mm.
                  The overflowing part will be <strong>cut off</strong> when exporting to PDF.
                  Please shorten your content.
                </span>
              </div>
            )}

            {/* A4 sheet */}
            <div className="bg-gray-50 shadow-2xl rounded-sm overflow-hidden flex items-center justify-center py-2">
              <CVPreview cv={cv} templateId={templateId} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}