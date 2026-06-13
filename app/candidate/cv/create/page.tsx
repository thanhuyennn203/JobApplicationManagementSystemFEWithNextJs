"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CVEditorPage from "@/components/cv/CVEditorPage";

// This page is the shell that CVEditorPage mounts inside.
// It reads ?mode= and ?template= from the URL and passes them down.
// CVEditorPage handles loading from sessionStorage when mode=ai&source=generated.
export default function CreatePage() {
  const params = useSearchParams();
  const mode = params.get("mode") ?? "blank";
  const template = (params.get("template") ?? "classic") as any;

  return <CVEditorPage initialMode={mode} initialTemplate={template} />;
}