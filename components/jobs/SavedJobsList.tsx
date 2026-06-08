"use client"

import { useEffect, useState } from "react"
import SavedJobCard from "./SavedJobCard"
import { getSavedJobs } from "@/services/jobs/savedJob.service"
import { useAuth } from "@/context/AuthContext"
import { Job } from "@/types/jobs"

export default function SavedJobsList() {

    const auth = useAuth();
    const candidateId = auth?.user?.candidateId;

    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {

        const fetchJobs = async () => {
            if (!candidateId) return;

            const data = await getSavedJobs(Number(candidateId));
            setJobs(data);
            
            // console.log("jobs saved:", data);
        }

        fetchJobs();

    }, []);

    return (
        <div className="saved_job_list_Wrapper">
            <h2>
               List <span>{jobs.length}</span> saved jobs.
            </h2>
            <div className="saved_jobs_list_grid">
                {jobs.map(job => (
                    <SavedJobCard key={job.id} job={job} />
                ))}
            </div>

        </div>
    )
}