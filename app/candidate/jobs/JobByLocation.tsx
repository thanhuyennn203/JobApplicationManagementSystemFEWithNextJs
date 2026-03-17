"use client";

import { useEffect, useState } from "react";
import JobCard from "@/components/jobs/JobCard";
import Pagination from "@/components/jobs/Pagination";
import "@/styles/jobs/JobsByLocations.css";
import { fetchJobs } from "@/services/jobs/jobs.service";
import { Job } from "@/types/jobs";
import JobFilterBar from "@/components/jobs/JobFilterBar";

export default function JobsByLocation() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);

  const pageSize = 8;

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchJobs();
        setJobs(data);
        setPage(1);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    loadJobs();
  }, []);

  const totalPages = Math.ceil(jobs.length / pageSize);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [jobs, totalPages]);

  const paginatedJobs = jobs.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="jobs-by-locations">
      <div className="left">

        <JobFilterBar
          onFilterChange={(type: string, value: string) => {
            console.log(type, value);
            // call API or filter jobs here
          }}
        />

        {/* job grid */}
        <div className="job-grid">
          {paginatedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      </div>

      <div className="right">
        <img src="/no-spotlight-mau-cv.png" alt="" />
      </div>
    </div>
  );
}