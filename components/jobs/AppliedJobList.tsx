"use client"

import { useEffect, useState } from "react"
import SavedJobCard from "./SavedJobCard"
import { useAuth } from "@/context/AuthContext"
import { Job } from "@/types/jobs"
import { getAppliedJobByCandidateId } from "@/services/application/application.service"
import { getJobsByIds } from "@/services/jobs/jobs.service"

export default function AppliedJobsList() {

    const auth = useAuth();
    const candidateId = auth?.user?.candidateId;

    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        const fetchJobsFromApplications = async () => {
            if (!candidateId) return;

            try {
                // 1. Get applications
                const applications = await getAppliedJobByCandidateId(Number(candidateId));

                // 2. Extract jobIds
                const jobIds = applications.map((app: any) => app.jobId);

                if (jobIds.length === 0) {
                    setJobs([]);
                    return;
                }

                // 3. Call API to get jobs by IDs
                const jobsData = await getJobsByIds(jobIds);

                // 4. Set jobs
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
                List <span>{jobs.length}</span> applied jobs.
            </h2>


            <div className="saved_jobs_list_grid">
                {jobs.map(job => (
                    <SavedJobCard key={job.id} job={job} />
                ))}
            </div>

        </div>
    )
}