"use client";

import { useState } from "react";
import { Application } from "@/types/application";
import { updateApplicationStatus } from "@/services/application/application.service";
import {
  Phone,
  Mail,
  CalendarDays,
  FileText,
  Check,
  ChevronDown,
  Briefcase,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string; bg: string; border: string }> = {
  APPLIED:  { label: "Applied",  dot: "bg-blue-400",   text: "text-blue-600",  bg: "bg-blue-50",   border: "border-blue-200" },
  ACCEPTED: { label: "Accepted", dot: "bg-emerald-400", text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  REJECTED: { label: "Rejected", dot: "bg-red-400",    text: "text-red-600",   bg: "bg-red-50",    border: "border-red-200" },
  PENDING:  { label: "Pending",  dot: "bg-amber-400",  text: "text-amber-600", bg: "bg-amber-50",  border: "border-amber-200" },
};

export default function ApplicationCard({
  application,
  onUpdate,
  onJobClick,
}: {
  application: Application;
  onUpdate?: (app: Application) => void;
  onJobClick?: () => void;
}) {
  const [status, setStatus] = useState(application.status);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const percent = application.matchPercent ?? Math.floor(Math.random() * 30 + 65);
  
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["APPLIED"];

  // SVG ring params
  const R = 30;
  const C = 2 * Math.PI * R; // ~188.5
  const offset = C - (C * percent) / 100;

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateApplicationStatus(application.id!, status);
      setEditing(false);
      onUpdate?.(updated);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="group bg-[#f6f7fb] rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">

      {/* ── Colored top accent based on status ── */}
      <div className={`h-1 w-full ${cfg.dot}`} />

      {/* ── Status badge row ── */}
      <div className="flex items-center justify-between px-4 pt-3 pb-0">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.text} ${cfg.bg} ${cfg.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
        <span className="text-xs text-gray-400 font-mono">#{application.id}</span>
      </div>

      {/* ── Avatar + match ring ── */}
      <div className="flex flex-col items-center px-4 pt-4 pb-3">
        <div className="relative w-[72px] h-[72px]">
          {/* Ring SVG */}
          <svg width="72" height="72" className="absolute inset-0 -rotate-90">
            <circle cx="36" cy="36" r={R} stroke="#e5e7eb" strokeWidth="5" fill="none" />
            <circle
              cx="36"
              cy="36"
              r={R}
              stroke="#00b14f"
              strokeWidth="5"
              fill="none"
              strokeDasharray={C}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          {/* Avatar */}
          <img
            src={application.candidate?.avatar || "/images/default-avatar.jpg"}
            alt={application.fullName}
            className="w-[56px] h-[56px] rounded-full absolute top-[8px] left-[8px] object-cover"
          />
          {/* Match % label */}
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#00b14f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap shadow">
            {percent}%
          </span>
        </div>

        <h3 className="mt-4 text-sm font-semibold text-gray-900 text-center leading-tight">
          {application.fullName}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5 text-center truncate w-full">
          {application.email}
        </p>
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 border-t border-gray-100" />

      {/* ── Info rows ── */}
      <div className="px-4 py-3 space-y-2 flex-1">
        <InfoRow icon={<Phone className="w-3.5 h-3.5" />} value={application.phone || "—"} />
        <InfoRow
          icon={<Briefcase className="w-3.5 h-3.5" />}
          value={
            <button onClick={onJobClick} className="text-[#00b14f] hover:underline font-medium truncate max-w-[130px]">
              Job #{application.jobId}
            </button>
          }
        />
        <InfoRow
          icon={<CalendarDays className="w-3.5 h-3.5" />}
          value={
            application.appliedDate
              ? new Date(application.appliedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
              : "—"
          }
        />
      </div>

      {/* ── Actions ── */}
      <div className="px-4 pb-4 space-y-2 mt-1">
        {/* View CV */}
        <button
          onClick={() =>
            window.open(`http://localhost:9191/uploads/${application.cvFileUrl}`, "_blank")
          }
          className="w-full flex items-center justify-center gap-2 text-xs font-medium border border-gray-200 py-2 rounded-xl hover:bg-gray-50 transition text-gray-600"
        >
          <FileText className="w-3.5 h-3.5" />
          View CV
        </button>

        {/* Status selector + save */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setEditing(true); }}
              className="w-full appearance-none text-xs border border-gray-200 rounded-xl pl-3 pr-7 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00b14f]/30 focus:border-[#00b14f] cursor-pointer"
            >
              <option value="APPLIED">Applied</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="PENDING">Pending</option>
            </select>
            <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {editing && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-1 text-xs bg-[#00b14f] hover:bg-[#009944] text-white px-3 py-2 rounded-xl transition disabled:opacity-60 whitespace-nowrap"
            >
              {saving ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Helper ── */
function InfoRow({ icon, value }: { icon: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <span className="text-gray-400 shrink-0">{icon}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}