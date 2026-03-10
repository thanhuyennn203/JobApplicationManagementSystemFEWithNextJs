"use client";

import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { fetchJobs } from "@/services/jobs/jobs.service";
import { Job } from "@/types/jobs"; 
import "@/styles/JobGrid.css";

export default function JobGrid() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchJobs();
        setJobs(data);
        // console.log("data: ", jobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    loadJobs();
  }, []);

  return (
    <div className="job-grid">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}