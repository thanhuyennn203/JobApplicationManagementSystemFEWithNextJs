"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Calendar from "react-calendar";
// import { useRouter } from "next/navigation";
import "react-calendar/dist/Calendar.css";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const auth = useAuth();
  const companyId = auth?.user?.companyId;
  const router = useRouter();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  console.log(auth?.user);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [appliedRange, setAppliedRange] = useState<[Date | null, Date | null]>([null, null]);

  // ✅ pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 20;

  // 📊 stats
  const totalJobs = jobs.length;
  const openJobs = jobs.filter((j) => j.status === "OPEN").length;
  const closedJobs = jobs.filter((j) => j.status === "CLOSED").length;
  const expiredJobs = jobs.filter((j) => j.status === "EXPIRED").length;
  const draftJobs = jobs.filter((j) => j.status === "DRAFT");
  // fetch
  const fetchJobs = async () => {
    try {
      const res = await fetch(`http://localhost:9191/api/jobs/company/${companyId}`);
      const data = await res.json();
      setJobs(data || []);
      console.log("jobs: ",data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) fetchJobs();
  },[companyId]);

  // ✅ FILTER
  const filteredJobs = jobs.filter((job) => {
    if (statusFilter !== "ALL" && job.status !== statusFilter) return false;

    if (search && !job.title?.toLowerCase().includes(search.toLowerCase())) return false;

    const [start, end] = appliedRange;

    if (start && end && job.postedDate) {
      const jobDate = new Date(job.postedDate);

      const startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);

      if (jobDate < startDate || jobDate > endDate) return false;
    }

    return true;
  });

  // ✅ pagination logic
const totalPages = Math.max(
  1,
  Math.ceil(filteredJobs.length / jobsPerPage)
);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );
  const emptyRows = jobsPerPage - paginatedJobs.length;
  return (
    <div className="p-6 bg-[#f6f7fb] min-h-screen space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">
          Hi, {auth?.user?.email || "Recruiter"}
        </h1>
        <p className="text-gray-500 text-sm">
          Here is your job posting performance
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Jobs" value={totalJobs} sub="All job posts" />
        <StatCard title="Active Jobs" value={openJobs} sub="Currently open" positive />
        <StatCard title="Closed Jobs" value={closedJobs} sub="Closed by recruiter" />
        <StatCard title="Expired Jobs" value={expiredJobs} sub="Reached deadline" negative />
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="col-span-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          {draftJobs.length > 0 && (
            <DraftReminder draftJobs={draftJobs} />
          )}
          {/* FILTER */}
          <div className="flex justify-between items-center mb-4 gap-3">
            <h2 className="font-semibold">Job Listings</h2>

            <div className="flex gap-3">
              <button
              onClick={() => router.push("./jobs/create")}
              className="flex items-center gap-2 bg-[#00b14f] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#009e46] transition"
            >
              + New Job
            </button>
              <input
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-100 px-3 py-2 rounded-lg text-sm w-48 focus:ring-2 focus:ring-[#00b14f]"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-100 px-3 py-2 rounded-lg text-sm"
              >
                <option value="ALL">All</option>
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
                <option value="DRAFT">Draft</option>
                <option value="EXPIRED">Expired</option>
              </select>
              
            </div>
            
          </div>

          {/* TABLE AREA */}
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <table className="w-full text-sm">

              {/* STICKY HEADER */}
              <thead className="text-gray-400 text-left sticky top-0 bg-white z-10">
                <tr>
                  <th className="py-2">Job Title</th>
                  <th>Status</th>
                  <th>Applications</th>
                  <th>Posted</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-t border-gray-100 hover:bg-[#f0fdf4]"
                  >
                    {/* TITLE (truncate) */}
                    <td className="py-3 max-w-[220px]">
                      <p className="truncate text-sm font-medium">
                        {job.title}
                      </p>
                    </td>

                    {/* STATUS */}
                    <td>
                      <StatusBadge status={job.status} />
                    </td>

                    {/* APPLICATION */}
                    <td>{job.applicationCount || 0}</td>

                    {/* DATE */}
                    <td>
                      {job.postedDate
                        ? new Date(job.postedDate).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* ACTIONS */}
                    <td className="text-right space-x-2">
                      {/* OPEN */}
                      {job.status === "OPEN" && (
                        <>
                          <button
                            onClick={() => router.push(`/jobs/${job.id}`)}
                            className="text-xs text-gray-600 hover:underline"
                          >
                            View
                          </button>

                          <button
                            onClick={() => router.push(`jobs/edit/${job.id}`)}
                            className="text-xs text-[#00b14f] font-medium hover:underline"
                          >
                            Edit
                          </button>
                        </>
                      )}

                      {/* DRAFT */}
                      {job.status === "DRAFT" && (
                        <button
                          onClick={() => router.push(`jobs/edit/${job.id}`)}
                          className="text-xs text-[#00b14f] font-medium hover:underline"
                        >
                          Continue
                        </button>
                      )}

                      {/* CLOSED / EXPIRED */}
                      {(job.status === "CLOSED" || job.status === "EXPIRED") && (
                        <button
                          onClick={() => router.push(`/jobs/${job.id}`)}
                          className="text-xs text-gray-600 hover:underline"
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}

          {/* PAGINATION (ALWAYS STAYS BOTTOM) */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <span className="text-gray-400">
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border border-gray-100 rounded-md disabled:opacity-40"
              >
                Prev
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border border-gray-100 rounded-md disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>

          {/* EMPTY STATE */}
          {!loading && filteredJobs.length === 0 && (
            <p className="text-center text-gray-400 py-4">
              No jobs found
            </p>
          )}

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* CALENDAR */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-semibold">Filter by Date</h2>

            <Calendar
            locale="en-US"
              selectRange
              onChange={(value: any) => setDateRange(value)}
              value={dateRange}
            />

            <button
              onClick={() => setAppliedRange(dateRange)}
              className="w-full text-sm bg-[#00b14f] text-white py-2 rounded-lg hover:bg-[#009e46]"
            >
              Apply Date Filter
            </button>

            <button
              onClick={() => {
                setDateRange([null, null]);
                setAppliedRange([null, null]);
              }}
              className="w-full text-sm border border-gray-100 py-2 rounded-lg"
            >
              Clear Date Filter
            </button>

            {appliedRange[0] && appliedRange[1] && (
              <p className="text-sm text-gray-500 text-center">
                {appliedRange[0].toLocaleDateString()} →{" "}
                {appliedRange[1].toLocaleDateString()}
              </p>
            )}
          </div>

          <SystemAds />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style: any = {
    OPEN: "bg-green-100 text-green-600",
    CLOSED: "bg-red-100 text-red-600",
    EXPIRED: "bg-yellow-100 text-yellow-600",
    DRAFT: "bg-gray-100 text-gray-500",
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs ${style[status]}`}>
      {status}
    </span>
  );
}

function StatCard({
  title,
  value,
  sub,
  positive,
  negative,
}: any) {
  return (
    <div className="bg-white p-4 rounded-2xl">
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-xl font-semibold">{value}</h3>

      <span
        className={`text-xs ${positive
          ? "text-green-500"
          : negative
            ? "text-red-500"
            : "text-gray-400"
          }`}
      >
        {sub}
      </span>
    </div>
  );
}

function JobRow({ job }: { job: any }) {
  const statusStyle: any = {
    OPEN: "bg-green-100 text-green-600",
    CLOSED: "bg-red-100 text-red-600",
    EXPIRED: "bg-yellow-100 text-yellow-600",
    DRAFT: "bg-gray-100 text-gray-500",
  };

  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="py-3">{job.title}</td>

      <td>
        <span
          className={`px-2 py-1 rounded-md text-xs ${statusStyle[job.status]
            }`}
        >
          {job.status}
        </span>
      </td>

      <td>{job.applicationCount || 0}</td>

      <td>
        {job.createdAt
          ? new Date(job.createdAt).toLocaleDateString()
          : "-"}
      </td>

      <td>
        {job.dueDate
          ? new Date(job.dueDate).toLocaleDateString()
          : "-"}
      </td>

      <td className="text-right">
        <button className="text-sm text-purple-600 hover:underline">
          View
        </button>
      </td>
    </tr>
  );
}

function SystemAds() {
  const ads = [
    {
      title: "Boost your job post",
      desc: "Reach more candidates faster.",
      img: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400",
      date: "2 days ago",
      cta: "Boost Now",
    },
    {
      title: "Upgrade to Premium",
      desc: "Unlock smart hiring tools.",
      img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400",
      date: "1 week ago",
      cta: "Upgrade",
    },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <h2 className="font-semibold text-sm">Announcements</h2>

      {ads.map((ad, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition"
        >
          <img src={ad.img} className="w-full h-28 object-cover" />

          <div className="p-3">
            <div className="flex justify-between">
              <h3 className="text-sm font-semibold">{ad.title}</h3>
              <span className="text-xs text-gray-400">{ad.date}</span>
            </div>

            <p className="text-xs text-gray-500 mt-1">{ad.desc}</p>

            <button className="mt-3 w-full text-xs text-white bg-[#00b14f] py-1.5 rounded-md hover:bg-[#009e46]">
              {ad.cta}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}


function DraftReminder({ draftJobs }: { draftJobs: any[] }) {
  const router = useRouter();

  const latestDraft = draftJobs[0]; // you can improve later

  return (
    <div className="mb-4 p-4 rounded-xl border border-yellow-100 bg-yellow-50 flex items-center justify-between">

      {/* LEFT TEXT */}
      <div>
        <p className="text-sm font-semibold text-yellow-700">
          You have unfinished job posts
        </p>
        <p className="text-xs text-yellow-600">
          Complete your draft to start receiving applications
        </p>
      </div>

      {/* ACTION */}
      <button
        onClick={() => router.push(`/jobs/edit/${latestDraft.id}`)}
        className="text-xs bg-[#00b14f] text-white px-3 py-1.5 rounded-md hover:bg-[#009e46]"
      >
        Continue
      </button>
    </div>
  );
}