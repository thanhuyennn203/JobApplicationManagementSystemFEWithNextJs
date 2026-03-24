"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Job } from "@/types/jobs";
import { Application } from "@/types/application";
import { getAppliedFormByCandidateId } from "@/services/application/application.service";
import { getJobsByIds } from "@/services/jobs/jobs.service";
import AppliedJobCard from "@/components/application/AppliedJobCard";

export default function AppliedJobsList() {
    const auth = useAuth();
    const candidateId = auth?.user?.candidateId;

    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        const fetchJobsFromApplications = async () => {
            if (!candidateId) return;

            try {
                // 1. Get applications
                const apps = await getAppliedFormByCandidateId(Number(candidateId));
                setApplications(apps);

                // 2. Extract jobIds
                const jobIds = apps.map((app) => app.jobId).filter(Boolean) as number[];

                if (jobIds.length === 0) {
                    setJobs([]);
                    return;
                }

                // 3. Get jobs
                const jobsData = await getJobsByIds(jobIds);
                setJobs(jobsData);

            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchJobsFromApplications();
    }, [candidateId]);

    return (
        <div className="saved_job_list_Wrapper">
            <h2>
                List <span>{applications.length}</span> applied jobs.
            </h2>

            <div className="saved_jobs_list_grid">
                {applications.map((app) => {
                    const job = jobs.find((j) => j.id === app.jobId);

                    if (!job) return null;

                    return (
                        <AppliedJobCard
                            key={app.id}
                            job={job}
                            application={app}
                        />
                    );
                })}
            </div>
        </div>
    );
}