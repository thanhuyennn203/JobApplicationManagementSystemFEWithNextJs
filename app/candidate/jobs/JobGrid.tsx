"use client";

import { Job } from "@/types/jobs";
import JobCard from "./JobCard";
import "@/styles/JobGrid.css";

export default function JobGrid({ jobs }: { jobs: Job[] }) {
  return (
    <div className="job-grid">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
