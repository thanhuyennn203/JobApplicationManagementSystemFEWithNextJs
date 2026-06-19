"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { useAuth } from "@/context/AuthContext";
import {
  getJobByCompanyId,
  updateJobStatus
} from "@/services/jobs/jobs.service";

import {
  Briefcase,
  Edit,
  FileText,
  PlayCircle,
  ShieldAlert,
  StopCircle,
} from "lucide-react";
import { useToast } from "@/components/notification/ToastProvider";
import JobCard from "@/components/jobs/JobCardRecruiter";
import { Job } from "@/types/jobs";

export default function DashboardPage() {
  const auth = useAuth();
  const router = useRouter();
  const toast = useToast();

  const companyId = auth?.user?.companyId;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [changingStatusId, setChangingStatusId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [appliedRange, setAppliedRange] = useState<[
    Date | null,
    Date | null
  ]>([null, null]);

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 8;

  const fetchJobs = async () => {
    try {
      if (!companyId) return;

      const data = await getJobByCompanyId(companyId);
      setJobs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [companyId]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (
        statusFilter !== "ALL" &&
        job.status !== statusFilter
      ) {
        return false;
      }

      if (
        search &&
        !job.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      ) {
        return false;
      }

      const [start, end] = appliedRange;

      if (start && end && job.postedDate) {
        const jobDate = new Date(job.postedDate);

        const startDate = new Date(start);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);

        if (jobDate < startDate || jobDate > endDate) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, search, statusFilter, appliedRange]);

  // console.log("jobs", jobs);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredJobs.length / jobsPerPage)
  );

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const totalJobs = jobs.length;
  const openJobs = jobs.filter((j) => j.status === "OPEN").length;
  const closedJobs = jobs.filter((j) => j.status === "CLOSED").length;
  const expiredJobs = jobs.filter((j) => j.status === "EXPIRED").length;
  const draftJobs = jobs.filter((j) => j.status === "DRAFT").length;

  const handleChangeStatus = async (
    jobId: number,
    status: string
  ) => {
    const actionText =
      status === "OPEN"
        ? "publish"
        : "close";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} this job?`
    );

    if (!confirmed) return;

    try {
      setChangingStatusId(jobId);

      await updateJobStatus(jobId, status);

      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? {
              ...job,
              status,
            }
            : job
        )
      );
      toast.success(`Job status updated to ${status}.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update job status");
    } finally {
      setChangingStatusId(null);
    }
  };



  return (
    <div className="min-h-screen bg-[#f4f7fb] px-12 py-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Recruiter Dashboard
              </h1>

              <p className="text-gray-500 mt-1">
                Monitor and manage your recruitment posts professionally.
              </p>
            </div>

            <button
              onClick={() => router.push("/recruiter/jobs/create")}
              className="bg-[#00b14f] hover:bg-[#009245] transition text-white px-5 py-3 rounded-2xl font-medium flex items-center gap-2"
            >
              <Briefcase size={18} />
              Create New Job
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
          <StatsCard
            title="Total Jobs"
            value={totalJobs}
            color="bg-blue-50"
            text="All created job posts"
            icon={<FileText size={20} />}
          />

          <StatsCard
            title="Draft Jobs"
            value={draftJobs}
            color="bg-orange-50"
            text="Currently receiving applications"
            icon={<Edit size={20} />}
          />

          <StatsCard
            title="Active Jobs"
            value={openJobs}
            color="bg-green-50"
            text="Currently receiving applications"
            icon={<PlayCircle size={20} />}
          />

          <StatsCard
            title="Closed Jobs"
            value={closedJobs}
            color="bg-red-50"
            text="Closed manually"
            icon={<StopCircle size={20} />}
          />

          <StatsCard
            title="Expired Jobs"
            value={expiredJobs}
            color="bg-yellow-50"
            text="Expired automatically"
            icon={<ShieldAlert size={20} />}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-6 gap-6">

          {/* LEFT */}
          <div className="xl:col-span-4 space-y-5">

            {/* FILTER */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
              <div className="flex flex-wrap gap-4 items-center justify-between">

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Job Listings
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Track job performance and manage recruitment status.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search jobs..."
                    className="w-[220px] border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#00b14f]"
                  />

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none"
                  >
                    <option value="ALL">All Status</option>
                    <option value="OPEN">Open</option>
                    <option value="CLOSED">Closed</option>
                    <option value="DRAFT">Draft</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                </div>
              </div>
            </div>

            {/* JOB LIST */}
            <div className="space-y-4">
              {loading ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm text-gray-400">
                  Loading jobs...
                </div>
              ) : paginatedJobs.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm text-gray-400">
                  No jobs found.
                </div>
              ) : (
                paginatedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    router={router}
                    changingStatusId={changingStatusId}
                    onChangeStatus={handleChangeStatus}
                  />
                ))
              )}
            </div>

            {/* PAGINATION */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="xl:col-span-2 space-y-5">

            {/* DATE FILTER */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h2 className="font-semibold text-gray-900">
                Filter By Date
              </h2>

              <Calendar
                locale="en-US"
                selectRange
                onChange={(value: any) => setDateRange(value)}
                value={dateRange}
                className="!w-full"
              />

              <button
                onClick={() => setAppliedRange(dateRange)}
                className="w-full bg-[#00b14f] hover:bg-[#009245] text-white py-2.5 rounded-2xl text-sm font-medium"
              >
                Apply Filter
              </button>

              <button
                onClick={() => {
                  setDateRange([null, null]);
                  setAppliedRange([null, null]);
                }}
                className="w-full border border-gray-200 py-2.5 rounded-2xl text-sm"
              >
                Clear Filter
              </button>
            </div>

            {/* HELP CARD */}
            <div className="bg-gradient-to-br from-[#00b14f] to-[#009245] rounded-3xl p-5 text-white shadow-sm">
              <h3 className="text-lg font-semibold">
                Recruitment Tips
              </h3>

              <p className="text-sm text-green-50 mt-2 leading-6">
                Jobs with detailed descriptions and clear salary ranges usually receive more applications.
              </p>

              <button className="mt-4 bg-white text-[#00b14f] px-4 py-2 rounded-2xl text-sm font-semibold">
                Improve Job Posts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */



/* ========================================================= */

function StatsCard({
  title,
  value,
  text,
  color,
  icon,
}: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs text-gray-500">
            {title}
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-2">
            {value}
          </h3>

          <p className="text-xs text-gray-400 mt-1">
            {text}
          </p>
        </div>

        <div className={`${color} p-3 rounded-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}