"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAppliedJobByCompanyId } from "@/services/application/application.service";
import ApplicationCard from "@/components/application/ApplicationCard";

export default function ApplicationCandidateList() {
  const auth = useAuth();
  const companyId = auth?.user?.companyId;

  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<"ALL" | "BY_JOB">("ALL");

  // BY JOB states
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobSearch, setJobSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  // fetch applications
  useEffect(() => {
    if (!companyId) return;

    getAppliedJobByCompanyId(Number(companyId)).then(setApplications);
  }, [companyId]);

  // fetch jobs
  useEffect(() => {
    if (!companyId) return;

    fetch(`http://localhost:9191/api/jobs/company/${companyId}`)
      .then(res => res.json())
      .then(setJobs);
  }, [companyId]);

  // filter jobs
  const filteredJobs = jobs
    .filter(job =>
      job.title?.toLowerCase().includes(jobSearch.toLowerCase())
    )
    .sort((a, b) => (sortAsc ? a.id - b.id : b.id - a.id));

  // filter apps by selected job
  const filteredApplications = applications.filter(app => {
    if (!selectedJob) return false;
    return app.jobId === selectedJob.id;
  });

  return (
    <div className="p-6 bg-[#f6f7fb] min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">
          Candidates <span className="text-gray-400">({applications.length})</span>
        </h1>
      </div>

      {/* TABS */}
      <div className="flex gap-6 mb-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`pb-2 border-b-2 ${
            activeTab === "ALL"
              ? "border-[#00b14f] text-[#00b14f]"
              : "border-transparent text-gray-400"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setActiveTab("BY_JOB")}
          className={`pb-2 border-b-2 ${
            activeTab === "BY_JOB"
              ? "border-[#00b14f] text-[#00b14f]"
              : "border-transparent text-gray-400"
          }`}
        >
          By Job
        </button>
      </div>

      {/* ===================== ALL VIEW ===================== */}
      {activeTab === "ALL" && (
        <div className="grid grid-cols-4 gap-5">
          {applications.map(app => (
            <ApplicationCard
              key={app.id}
              application={app}
              onUpdate={(updated) => {
                setApplications(prev =>
                  prev.map(a => a.id === updated.id ? updated : a)
                );
              }}
            />
          ))}
        </div>
      )}

      {/* ===================== BY JOB VIEW ===================== */}
      {activeTab === "BY_JOB" && (
        <div className="grid grid-cols-4 gap-6">

          {/* LEFT: JOB LIST */}
          <div className="col-span-1 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">

            {/* SEARCH + SORT */}
            <div className="mb-4 space-y-2">
              <input
                placeholder="Search job..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="w-full border border-gray-100 px-3 py-2 rounded-lg text-sm"
              />

              <button
                onClick={() => setSortAsc(prev => !prev)}
                className="text-xs border border-gray-200 px-3 py-1 rounded-md"
              >
                Sort ID {sortAsc ? "↑" : "↓"}
              </button>
            </div>

            {/* JOB LIST */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredJobs.map(job => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-3 rounded-xl cursor-pointer border ${
                    selectedJob?.id === job.id
                      ? "bg-[#00b14f]/10 border-[#00b14f]"
                      : "border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <p className="text-sm font-medium truncate">
                    {job.title}
                  </p>
                  <span className="text-xs text-gray-400">
                    ID: {job.id}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: APPLICATIONS */}
          <div className="col-span-3">

            {!selectedJob ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center text-gray-400">
                Select a job to view applicants
              </div>
            ) : (
              <>
                {/* HEADER */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">
                    {selectedJob.title}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Job ID: {selectedJob.id}
                  </p>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-3 gap-5">
                  {filteredApplications.length === 0 ? (
                    <p className="text-gray-400 text-sm">
                      No applicants for this job
                    </p>
                  ) : (
                    filteredApplications.map(app => (
                      <ApplicationCard
                        key={app.id}
                        application={app}
                        onUpdate={(updated) => {
                          setApplications(prev =>
                            prev.map(a => a.id === updated.id ? updated : a)
                          );
                        }}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}