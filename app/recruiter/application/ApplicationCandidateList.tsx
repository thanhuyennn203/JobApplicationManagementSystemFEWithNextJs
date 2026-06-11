"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAppliedJobByCompanyId } from "@/services/application/application.service";
import ApplicationCard from "@/components/application/ApplicationCard";
import {
  Users,
  LayoutGrid,
  Layers,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";

const PAGE_SIZE = 8;

export default function ApplicationCandidateList() {
  const auth = useAuth();
  const companyId = auth?.user?.companyId;

  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<"ALL" | "BY_JOB">("ALL");

  // BY_JOB
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobSearch, setJobSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  // Pagination — ALL tab
  const [allPage, setAllPage] = useState(1);

  // Pagination — BY_JOB tab
  const [jobPage, setJobPage] = useState(1);

  // ── fetch ──────────────────────────────────────
  useEffect(() => {
    if (!companyId) return;
    getAppliedJobByCompanyId(Number(companyId)).then(setApplications);
  }, [companyId]);

  useEffect(() => {
    if (!companyId) return;
    fetch(`http://localhost:9191/api/jobs/company/${companyId}`)
      .then((r) => r.json())
      .then(setJobs);
  }, [companyId]);

  // ── derived ────────────────────────────────────
  const filteredJobs = jobs
    .filter((j) => j.title?.toLowerCase().includes(jobSearch.toLowerCase()))
    .sort((a, b) => (sortAsc ? a.id - b.id : b.id - a.id));

  const jobApplications = applications.filter(
    (a) => selectedJob && a.jobId === selectedJob.id
  );

  // Pagination helpers
  const paginate = <T,>(arr: T[], page: number) =>
    arr.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalPages = (count: number) => Math.max(1, Math.ceil(count / PAGE_SIZE));

  const allPaged = paginate(applications, allPage);
  const jobPaged = paginate(jobApplications, jobPage);

  // Reset page when selection changes
  const handleSelectJob = (job: any) => {
    setSelectedJob(job);
    setJobPage(1);
  };

  // Status summary counts
  const countByStatus = (list: any[]) =>
    list.reduce<Record<string, number>>((acc, a) => {
      acc[a.status] = (acc[a.status] ?? 0) + 1;
      return acc;
    }, {});

  const allCounts = countByStatus(applications);

  const STAT_PILLS = [
    { key: "APPLIED",  label: "Applied",  color: "text-blue-600 bg-blue-50 border-blue-200" },
    { key: "PENDING",  label: "Pending",  color: "text-amber-600 bg-amber-50 border-amber-200" },
    { key: "ACCEPTED", label: "Accepted", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { key: "REJECTED", label: "Rejected", color: "text-red-600 bg-red-50 border-red-200" },
  ];

  return (
    <div className="p-6 bg-white min-h-screen">

      {/* ── Page Header ─────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#00b14f]" />
              Candidates
              <span className="text-sm font-normal text-gray-400 ml-1">
                ({applications.length} total)
              </span>
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Manage and review all job applicants
            </p>
          </div>
        </div>

        {/* Status summary pills */}
        <div className="flex flex-wrap gap-2">
          {STAT_PILLS.map((p) => (
            <span
              key={p.key}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${p.color}`}
            >
              {p.label}
              <span className="font-bold">{allCounts[p.key] ?? 0}</span>
            </span>
          ))}
        </div>
      </div>
    
      {/* ── Tabs ────────────────────────────────────── */}
      <div className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm">
        <TabBtn
          active={activeTab === "ALL"}
          onClick={() => { setActiveTab("ALL"); setAllPage(1); }}
          icon={<LayoutGrid className="w-4 h-4" />}
          label="All Candidates"
        />
        <TabBtn
          active={activeTab === "BY_JOB"}
          onClick={() => { setActiveTab("BY_JOB"); setJobPage(1); }}
          icon={<Layers className="w-4 h-4" />}
          label="By Job"
        />
      </div>

      {/* ══════════════ ALL VIEW ══════════════ */}
      {activeTab === "ALL" && (
        <div>
          {applications.length === 0 ? (
            <EmptyState message="No candidates yet. Share your job postings to start receiving applications." />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {allPaged.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onUpdate={(updated) =>
                      setApplications((prev) =>
                        prev.map((a) => (a.id === updated.id ? updated : a))
                      )
                    }
                  />
                ))}
              </div>
              <Pagination
                page={allPage}
                total={totalPages(applications.length)}
                onChange={setAllPage}
              />
            </>
          )}
        </div>
      )}

      {/* ══════════════ BY JOB VIEW ══════════════ */}
      {activeTab === "BY_JOB" && (
        <div className="flex gap-5 items-start">

          {/* Left: job list */}
          <div className="w-64 shrink-0 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Job Postings
              </p>
            </div>

            <div className="p-3 border-b border-gray-100 space-y-2">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  placeholder="Search jobs..."
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b14f]/30 focus:border-[#00b14f]"
                />
              </div>
              {/* Sort */}
              <button
                onClick={() => setSortAsc((p) => !p)}
                className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
              >
                <ArrowUpDown className="w-3 h-3" />
                Sort ID {sortAsc ? "↑" : "↓"}
              </button>
            </div>

            <div className="max-h-[560px] overflow-y-auto divide-y divide-gray-100">
              {filteredJobs.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8 px-4">No jobs found</p>
              ) : (
                filteredJobs.map((job) => {
                  const appCount = applications.filter((a) => a.jobId === job.id).length;
                  const isActive = selectedJob?.id === job.id;
                  return (
                    <button
                      key={job.id}
                      onClick={() => handleSelectJob(job)}
                      className={`w-full text-left px-4 py-3 transition ${
                        isActive
                          ? "bg-[#00b14f]/8 border-l-2 border-[#00b14f]"
                          : "hover:bg-gray-50 border-l-2 border-transparent"
                      }`}
                    >
                      <p className={`text-sm font-medium truncate ${isActive ? "text-[#00b14f]" : "text-gray-800"}`}>
                        {job.title}
                      </p>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs text-gray-400">ID #{job.id}</span>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                          appCount > 0 ? "bg-[#00b14f]/10 text-[#00b14f]" : "bg-gray-100 text-gray-400"
                        }`}>
                          {appCount}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: applications */}
          <div className="flex-1 min-w-0">
            {!selectedJob ? (
              <EmptyState
                icon={<Layers className="w-10 h-10 text-gray-300" />}
                message="Select a job on the left to view its applicants."
              />
            ) : (
              <>
                {/* Job header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">{selectedJob.title}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {jobApplications.length} applicant{jobApplications.length !== 1 ? "s" : ""} · Job ID #{selectedJob.id}
                    </p>
                  </div>
                </div>

                {jobApplications.length === 0 ? (
                  <EmptyState message="No applications received for this job yet." />
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                      {jobPaged.map((app) => (
                        <ApplicationCard
                          key={app.id}
                          application={app}
                          onUpdate={(updated) =>
                            setApplications((prev) =>
                              prev.map((a) => (a.id === updated.id ? updated : a))
                            )
                          }
                        />
                      ))}
                    </div>
                    <Pagination
                      page={jobPage}
                      total={totalPages(jobApplications.length)}
                      onChange={setJobPage}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ─────────────────────────── */

function TabBtn({
  active, onClick, icon, label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-[#00b14f] text-white shadow-sm"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Pagination({
  page, total, onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  if (total <= 1) return null;

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
            p === page
              ? "bg-[#00b14f] text-white shadow-sm"
              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === total}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function EmptyState({
  icon,
  message,
}: {
  icon?: React.ReactNode;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-100 rounded-2xl text-center px-6">
      {icon ?? <Inbox className="w-10 h-10 text-gray-300 mb-3" />}
      <p className="text-sm text-gray-400 mt-3 max-w-xs">{message}</p>
    </div>
  );
}