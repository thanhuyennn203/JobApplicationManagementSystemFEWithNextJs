"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Download, Search, Eye, Check, X, Trash2,
  Briefcase, ChevronUp, ChevronDown, ArrowLeft, ArrowRight,
  CircleCheck, CircleX, Clock, Pencil,
} from "lucide-react";
import { fetchJobs } from "@/services/jobs/jobs.service";
import { useToast } from "@/components/notification/ToastProvider";
import { Job } from "@/types/jobs";
// ─── Types ───────────────────────────────────────────────────────────────────

interface Location { city?: string; district?: string }


type SortKey = "posted_date" | "salary" | "due";
type StatusFilter = "ALL" | "ACTIVE" | "CLOSED" | "EXPIRED";
type CreateFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED" | "DRAFT";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtSalary(n: number) {
  return (n / 1_000_000).toFixed(0) + "M";
}

function initials(name?: string) {
  return (name ?? "??").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

const LOGO_COLORS: [string, string][] = [
  ["#e1f5ee", "#0f6e56"],
  ["#e6f1fb", "#185fa5"],
  ["#eeedfe", "#534ab7"],
  ["#faeeda", "#854f0b"],
];
function logoColor(id: number): [string, string] {
  return LOGO_COLORS[id % LOGO_COLORS.length];
}

function dueLabel(d: Date): { text: string; cls: string } {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
  if (diff < 0)  return { text: "Expired",        cls: "text-[#a32d2d]" };
  if (diff <= 3) return { text: `${diff}d left`,   cls: "text-[#854f0b] font-medium" };
  return { text: new Date(d).toLocaleDateString("vi-VN"), cls: "text-gray-500" };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    ACTIVE:  { cls: "bg-[#eaf3de] text-[#3b6d11]", icon: <CircleCheck size={11} /> },
    CLOSED:  { cls: "bg-gray-100 text-gray-500",     icon: <CircleX size={11} /> },
    EXPIRED: { cls: "bg-[#fcebeb] text-[#a32d2d]",   icon: <Clock size={11} /> },
  };
  const v = map[status] ?? { cls: "bg-gray-100 text-gray-400", icon: null };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${v.cls}`}>
      {v.icon}{status}
    </span>
  );
}

function CreateStatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    APPROVED: { cls: "bg-[#eaf3de] text-[#3b6d11]", icon: <Check size={11} /> },
    PENDING:  { cls: "bg-[#e6f1fb] text-[#185fa5]",  icon: <Clock size={11} /> },
    REJECTED: { cls: "bg-[#fcebeb] text-[#a32d2d]",  icon: <X size={11} /> },
    DRAFT:    { cls: "bg-[#faeeda] text-[#854f0b]",  icon: <Pencil size={11} /> },
  };
  const v = map[status] ?? { cls: "bg-gray-100 text-gray-400", icon: null };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${v.cls}`}>
      {v.icon}{status}
    </span>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: number }) {
  if (!active) return null;
  return dir === 1 ? <ChevronUp size={12} className="inline ml-0.5" /> : <ChevronDown size={12} className="inline ml-0.5" />;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PER_PAGE = 10;

const STATUS_TABS: [StatusFilter, string][] = [
  ["ALL", "All jobs"], ["ACTIVE", "Active"], ["EXPIRED", "Expired"], ["CLOSED", "Closed"],
];

const CREATE_TABS: [CreateFilter, string][] = [
  ["ALL", "All"], ["PENDING", "Pending"], ["APPROVED", "Approved"], ["REJECTED", "Rejected"], ["DRAFT", "Draft"],
];

// ─── Main component ──────────────────────────────────────────────────────────

export default function JobPage() {
  const router = useRouter();
  const toast = useToast();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [createFilter, setCreateFilter] = useState<CreateFilter>("ALL");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortKey>("posted_date");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);

  // ── Fetch ──
  useEffect(() => {
    fetchJobs()
      .then(setJobs)
      .catch(() => toast.error("Failed to load jobs."))
      .finally(() => setLoading(false));
  }, []);

  // ── Filter + sort ──
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return jobs
      .filter((j) => {
        const mq = !q || j.title.toLowerCase().includes(q) || j.company_name.toLowerCase().includes(q) || (j.tags ?? []).join(" ").toLowerCase().includes(q);
        const ms = statusFilter === "ALL" || j.status === statusFilter;
        const mc = createFilter === "ALL" || j.createStatus === createFilter;
        return mq && ms && mc;
      })
      .sort((a, b) => {
        if (sort === "salary")      return sortDir * (a.salary_max - b.salary_max);
        if (sort === "due")         return sortDir * (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        return sortDir * (new Date(a.posted_date).getTime() - new Date(b.posted_date).getTime());
      });
  }, [jobs, search, statusFilter, createFilter, sort, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const counts = {
    total:   jobs.length,
    ACTIVE:  jobs.filter((j) => j.status === "ACTIVE").length,
    EXPIRED: jobs.filter((j) => j.status === "EXPIRED").length,
    CLOSED:  jobs.filter((j) => j.status === "CLOSED").length,
    PENDING: jobs.filter((j) => j.createStatus === "PENDING").length,
  };

  // ── Handlers ──
  const toggleSort = (key: SortKey) => {
    if (sort === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else { setSort(key); setSortDir(-1); }
  };

  const handleApprove = async (id: number) => {
    // await approveJob(id);
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, createStatus: "APPROVED" } : j));
    toast.success("Job approved.");
  };

  const handleReject = async (id: number) => {
    const reason = window.prompt("Rejection reason:");
    if (!reason) return;
    // await rejectJob(id, reason);
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, createStatus: "REJECTED" } : j));
    toast.success("Job rejected.");
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this job posting?")) return;
    // await deleteJob(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
    toast.success("Job deleted.");
  };

  // ── Render ──
  return (
    <div className="flex flex-col min-h-full bg-white">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Job Postings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and moderate all job listings</p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <Download size={14} />Export
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-2.5 px-6 py-3 border-b border-gray-100">
        {([
          ["Total",          counts.total,   "text-gray-900"],
          ["Active",         counts.ACTIVE,  "text-[#0f6e56]"],
          ["Expired",        counts.EXPIRED, "text-[#a32d2d]"],
          ["Closed",         counts.CLOSED,  "text-gray-500"],
          ["Pending review", counts.PENDING, "text-[#854f0b]"],
        ] as const).map(([label, value, cls]) => (
          <div key={label} className="bg-gray-50 rounded-lg px-4 py-2.5 flex-1">
            <div className={`text-lg font-medium ${cls}`}>{value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 px-6 py-2.5 border-b border-gray-100 flex-wrap">
        {/* Search */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-white w-56">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search title, company, tags…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="flex-1 text-sm outline-none text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Status tabs */}
        <div className="flex gap-1">
          {STATUS_TABS.map(([v, l]) => (
            <button
              key={v}
              onClick={() => { setStatusFilter(v); setPage(1); }}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${statusFilter === v ? "bg-[#1e5538] text-white" : "text-gray-500 hover:bg-gray-100"}`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-gray-200" />

        {/* Create status tabs */}
        <div className="flex gap-1">
          {CREATE_TABS.map(([v, l]) => (
            <button
              key={v}
              onClick={() => { setCreateFilter(v); setPage(1); }}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${createFilter === v ? "bg-[#1e5538] text-white" : "text-gray-500 hover:bg-gray-100"}`}
            >
              {l}
            </button>
          ))}
        </div>

        <span className="ml-auto text-xs text-gray-400">{filtered.length} job{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6">
        {loading ? (
          <div className="py-20 text-center text-sm text-gray-400">Loading jobs…</div>
        ) : pageRows.length === 0 ? (
          <div className="py-20 text-center">
            <Briefcase size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No jobs match your filters.</p>
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-2.5 pr-3 text-left w-10"></th>
                <th className="py-2.5 pr-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Job / Company</th>
                <th
                  className="py-2.5 pr-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wide cursor-pointer hover:text-gray-600 select-none whitespace-nowrap"
                  onClick={() => toggleSort("salary")}
                >
                  Salary <SortIcon active={sort === "salary"} dir={sortDir} />
                </th>
                <th className="py-2.5 pr-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Experience</th>
                <th
                  className="py-2.5 pr-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wide cursor-pointer hover:text-gray-600 select-none whitespace-nowrap"
                  onClick={() => toggleSort("due")}
                >
                  Due date <SortIcon active={sort === "due"} dir={sortDir} />
                </th>
                <th className="py-2.5 pr-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Status</th>
                <th className="py-2.5 pr-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Approval</th>
                <th className="py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((job) => {
                const [bg, fg] = logoColor(job.company_id);
                const due = dueLabel(job.dueDate);
                const locs = (job.locations ?? []).map((l) => l.city).filter(Boolean).join(", ") || "—";

                return (
                  <tr key={job.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    {/* Logo */}
                    <td className="py-3 pr-3">
                      <div
                        className="w-9 h-9 rounded-lg border border-gray-100 flex items-center justify-center text-[11px] font-medium overflow-hidden shrink-0"
                        style={{ background: bg, color: fg }}
                      >
                        {job.logo_url ? <img src={job.logo_url} alt="" className="w-full h-full object-contain" /> : initials(job.company_name)}
                      </div>
                    </td>

                    {/* Job info */}
                    <td className="py-3 pr-4" style={{ minWidth: 200 }}>
                      <div className="font-medium text-gray-900 text-sm truncate max-w-[200px]">{job.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{job.company_name} · {locs}</div>
                    </td>

                    {/* Salary */}
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 text-sm">
                        ${(job.salary_min)} – ${(job.salary_max)}
                      </div>
                      <div className="text-xs text-gray-400"> month</div>
                    </td>

                    {/* Experience */}
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-500 text-xs px-2 py-0.5 rounded">
                        <Briefcase size={10} />{job.experienceRequired}
                      </span>
                    </td>

                    {/* Due date */}
                    <td className="py-3 pr-4">
                      <span className={`text-xs ${due.cls}`}>{due.text}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 pr-4"><StatusBadge status={job.status} /></td>

                    {/* Create status */}
                    <td className="py-3 pr-4"><CreateStatusBadge status={job.createStatus} /></td>

                    {/* Actions */}
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => router.replace(`http://localhost:3000/candidate/jobs/${job.id}`)}
                          className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <Eye size={12} />View
                        </button>

                        {job.createStatus === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleApprove(job.id)}
                              className="p-1.5 rounded-lg text-[#0f6e56] bg-[#e1f5ee] border border-[#9fe1cb] hover:bg-[#9fe1cb] transition-colors"
                              title="Approve"
                            >
                              <Check size={12} />
                            </button>
                            <button
                              onClick={() => handleReject(job.id)}
                              className="p-1.5 rounded-lg text-[#a32d2d] bg-[#fcebeb] border border-[#f7c1c1] hover:bg-[#f7c1c1] transition-colors"
                              title="Reject"
                            >
                              <X size={12} />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-1.5 rounded-lg text-[#a32d2d] bg-[#fcebeb] border border-[#f7c1c1] hover:bg-[#f7c1c1] transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5 px-6 py-3 border-t border-gray-100">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft size={14} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                n === currentPage
                  ? "border border-gray-300 text-gray-900 font-medium"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowRight size={14} />
          </button>

          <span className="ml-auto text-xs text-gray-400">
            Page {currentPage} of {totalPages} · {filtered.length} total
          </span>
        </div>
      )}
    </div>
  );
}