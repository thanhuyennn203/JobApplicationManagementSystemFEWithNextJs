"use client";
import { type LucideIcon, User, Mail, Phone, FileText, Calendar, Download } from "lucide-react";
import { Job } from "@/types/jobs";
import { Application } from "@/types/application";

interface Props {
  job: Job;
  application: Application;
}

const STATUS_CONFIG: Record<string, { bar: string; bg: string; text: string; label: string }> = {
  PENDING:  { bar: "#facc15", bg: "#faeeda", text: "#854f0b", label: "Pending"  },
  ACCEPTED: { bar: "#22c55e", bg: "#eaf3de", text: "#3b6d11", label: "Accepted" },
  REJECTED: { bar: "#ef4444", bg: "#fcebeb", text: "#a32d2d", label: "Rejected" },
};

const DEFAULT_STATUS = { bar: "#6ea2fd", bg: "#e6f1fb", text: "#185fa5", label: "Unknown" };

function getInitials(name?: string) {
  if (!name) return "??";
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function MetaItem({ icon: Icon, value }: { icon: LucideIcon; value?: string | null }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 text-[12.5px] text-gray-500">
      <Icon size={14} className="shrink-0" />
      <span className="truncate">{value || "N/A"}</span>
    </div>
  );
}

export default function AppliedJobCard({ job, application }: Props) {
  const status = STATUS_CONFIG[application.status ?? ""] ?? {
    ...DEFAULT_STATUS,
    label: application.status ?? "Unknown",
  };

  return (
    <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-gray-400 hover:shadow-sm">

      {/* LEFT STATUS BAR */}
      <div className="w-1 shrink-0" style={{ backgroundColor: status.bar }} />

      {/* CARD BODY */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">

        {/* HEADER */}
        <div className="flex items-start gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border text-sm font-medium uppercase"
            style={{ backgroundColor: "#e6f1fb", borderColor: "#b5d4f4", color: "#185fa5" }}
          >
            {getInitials(job.company_name)}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-medium text-gray-900">{job.title}</p>
            <p className="truncate text-[13px] text-gray-500">{job.company_name}</p>
          </div>

          <span
            className="shrink-0 self-start rounded-full px-3 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: status.bg, color: status.text }}
          >
            {status.label}
          </span>
        </div>

        {/* DIVIDER */}
        <hr className="border-gray-100" />

        {/* META GRID */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          <MetaItem icon={User}     value={application.fullName} />
          <MetaItem icon={Mail}     value={application.email} />
          <MetaItem icon={Phone}    value={application.phone} />
          <MetaItem icon={FileText} value={application.letter || "No cover letter"} />
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[12px] text-gray-400">
            <Calendar size={13} />
            Applied{" "}
            {application.appliedDate
              ? new Date(application.appliedDate).toLocaleDateString("vi-VN")
              : "N/A"}
          </span>

          {application.cvFileUrl ? (
             <a href={"http://localhost:9191/uploads/" + application.cvFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-md border px-3 py-1 text-[12.5px] font-medium transition-colors"
              style={{ backgroundColor: "#e6f1fb", borderColor: "#b5d4f4", color: "#185fa5" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b5d4f4")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e6f1fb")}
            >
              <Download size={13} />
              View CV
            </a>
          ) : (
            <span className="text-[12px] text-gray-400">No CV attached</span>
          )}
        </div>
      </div>
    </div>
  );
}