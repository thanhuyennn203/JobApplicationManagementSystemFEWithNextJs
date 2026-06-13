"use client";
import { useState } from "react";
import { Download, Eye, X, Loader2 } from "lucide-react";
import type { CVData } from "@/types/Cv.types";
import type { TemplateId } from "../../types/cv.templates";
import CVPreview from "./CVPreview";
import CVTemplateSwitcher from "./CVTemplateSwitcher";

interface CVToolbarProps {
  cv: CVData;
  templateId: TemplateId;
  onTemplateChange: (id: TemplateId) => void;
}

export default function CVToolbar({ cv, templateId, onTemplateChange }: CVToolbarProps) {
  const [previewing, setPreviewing] = useState(false);
  const [exporting, setExporting] = useState(false);

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
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = 297;
      let heightLeft = pdfHeight;
      let position = 0;
      let page = 0;

      while (heightLeft > 0) {
        if (page > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position === 0 ? 0 : -position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
        position += pageHeight;
        page++;
      }

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
          <span className="text-gray-400">CV Builder</span>
          <span className="text-gray-300">/</span>
          <span className="font-medium text-gray-700 truncate max-w-[200px]">
            {cv.personal.fullName || "Untitled CV"}
          </span>
        </div>

        {/* Right: template switcher + actions */}
        <div className="flex items-center gap-2">
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

              {/* Template switcher inside modal */}
              <CVTemplateSwitcher current={templateId} onChange={onTemplateChange} />

              <button
                onClick={() => setPreviewing(false)}
                className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors"
              >
                <X size={16} /> Close
              </button>
            </div>

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