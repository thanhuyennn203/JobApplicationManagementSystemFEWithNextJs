"use client";
import { forwardRef } from "react";
import type { CVData, CVSection } from "@/types/Cv.types";
import type { CVTemplate, TemplateId } from "@/types/cv.templates";
import { getTemplate } from "@/types/cv.templates";
import TwoColumnLayout from "./TwoColumnLayout";
import SingleColumnLayout from "./SingleColumnLayout";

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
      style={{
        width: "210mm",
        height: "297mm",        // height cố định, không phải minHeight
        overflow: "hidden",      // cắt phần tràn quá 1 trang
        background: "#fff",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "11pt",
        color: "#333",
        boxSizing: "border-box",
      }}
    >
      {template.layout === "two-column"
        ? <TwoColumnLayout cv={cv} template={template} />
        : <SingleColumnLayout cv={cv} template={template} />}
    </div>
  );
});
CVPreview.displayName = "CVPreview";

export default CVPreview;

