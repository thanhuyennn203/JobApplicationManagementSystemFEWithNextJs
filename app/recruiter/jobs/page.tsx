"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { GeneralInformation, Job, JobDetail } from "@/types/jobs";
import JobCard from "@/components/recruiter/ManageJobCard";
import { useRouter } from "next/navigation";
import "@/styles/recruiter/ManageJobs.css";

export default function ManageJobsPage() {

  const auth = useAuth();
  const companyId = auth?.user?.companyId;
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!companyId) return;

    const fetchJobs = async () => {

      try {

        const res = await fetch(
          `http://localhost:9191/api/jobs/company/${companyId}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data: Job[] = await res.json();

        console.log(data);
        setJobs(data);

      } catch (err) {

        console.error("Failed to fetch jobs:", err);

      } finally {

        setLoading(false);

      }

    };

    fetchJobs();

  }, [companyId]);

  if (loading) {
    return <p className="loading">Loading jobs...</p>;
  }

  return (

    <div className="manage-jobs-container">

      <div className="manage-header">

        <h1>Manage Jobs</h1>

        <button
          className="create-job-btn"
          onClick={() => router.push("/recruiter/jobs/create")}
        >
          + Create Job
        </button>

      </div>

      {jobs.length === 0 && (
        <p className="empty-state">
          No jobs yet. Create your first job.
        </p>
      )}

      <div className="jobs-grid">

        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
          />
        ))}

      </div>

    </div>

  );

}