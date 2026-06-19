"use client";

import { useState } from "react";
import { Application } from "@/types/application";
import { updateApplicationStatus } from "@/services/application/application.service";
import { Mail, Phone, MoreVertical } from "lucide-react";
import { useToast } from "../notification/ToastProvider";

const STATUS_CONFIG: Record<
  string,
  { label: string; text: string; bg: string; glow: string; ring: string }
> = {
  APPLIED: {
    label: "Applied",
    text: "text-blue-600",
    bg: "bg-blue-50",
    glow: "from-blue-100/80 via-blue-50/40",
    ring: "ring-blue-100",
  },
  ACCEPTED: {
    label: "Active",
    text: "text-emerald-600",
    bg: "bg-emerald-50",
    glow: "from-emerald-100/80 via-emerald-50/40",
    ring: "ring-emerald-100",
  },
  REJECTED: {
    label: "Rejected",
    text: "text-red-600",
    bg: "bg-red-50",
    glow: "from-red-100/80 via-red-50/40",
    ring: "ring-red-100",
  },
  PENDING: {
    label: "Pending",
    text: "text-amber-600",
    bg: "bg-amber-50",
    glow: "from-amber-100/80 via-amber-50/40",
    ring: "ring-amber-100",
  },
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
  const [checked, setChecked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["APPLIED"];

  const handleStatusChange = async (next: string) => {
    setMenuOpen(false);
    if (next === status) return;
    setSaving(true);
    try {
      const updated = await updateApplicationStatus(application.id!, next);
      setStatus(next as any);
      onUpdate?.(updated);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`relative w-full max-w-[280px] bg-white rounded-2xl border border-gray-100 shadow-sm ring-1 ${cfg.ring} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 p-4 overflow-hidden`}
    >
      {/* ── Soft gradient glow accent (top-right corner) ── */}
      <div
        className={`pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gradient-to-br ${cfg.glow} to-transparent blur-2xl`}
      />
      <div className="relative">

      {/* ── Top row: checkbox / status badge / menu ── */}
      <div className="flex items-center justify-between mb-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-[#00b14f] focus:ring-[#00b14f]/30 cursor-pointer"
        />

        <div className="flex items-center gap-1">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${cfg.text} ${cfg.bg}`}>
            {cfg.label}
          </span>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-7 z-10 bg-white border border-gray-100 rounded-xl shadow-lg py-1 w-32">
                {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => handleStatusChange(key)}
                    disabled={saving}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 ${val.text}`}
                  >
                    {val.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Avatar + name + role ── */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={application.candidate?.avatar || "/images/default-avatar.jpg"}
          alt={application.fullName}
          className="w-11 h-11 rounded-full object-cover shrink-0"
        />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {application.fullName}
          </h3>
          <p className="text-xs text-gray-400 truncate">
            {application.jobTitle || `Job #${application.jobId}`}
          </p>
        </div>
      </div>

      {/* ── Department / Date of joining ── */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">
            Department
          </p>
          <p className="text-xs font-medium text-gray-700 truncate">
            {application.department || "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">
            Date of Joining
          </p>
          <p className="text-xs font-medium text-gray-700 truncate">
            {application.appliedDate
              ? new Date(application.appliedDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
              : "—"}
          </p>
        </div>
      </div>

      {/* ── Contact box ── */}
      <div className="bg-gray-50 rounded-xl px-3 py-2.5 space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="truncate">{application.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="truncate">{application.phone || "—"}</span>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-2">
        <button
          onClick={onJobClick}
          className="flex-1 text-xs font-medium border border-gray-200 text-gray-600 py-2 rounded-xl hover:bg-gray-50 transition"
        >
          Edit
        </button>
        <button
          onClick={() =>
            window.open(`http://localhost:9191/uploads/${application.cvFileUrl}`, "_blank")
          }
          className="flex-1 text-xs font-medium border border-[#00b14f] hover:bg-[#009944] hover:text-white py-2 rounded-xl transition"
        >
          View
        </button>
      </div>
      </div>
    </div>
  );
}