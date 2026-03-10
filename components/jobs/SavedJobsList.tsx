"use client"

import { useEffect, useState } from "react"
import SavedJobCard from "./SavedJobCard"
import { getSavedJobs, SavedJob } from "@/services/jobs/savedJob.service"
import { useAuth } from "@/context/AuthContext"

export default function SavedJobsList() {

    const auth = useAuth()
    const candidateId = auth?.user?.candidateId

    const [jobs, setJobs] = useState<SavedJob[]>([])

    useEffect(() => {

        const fetchJobs = async () => {
            if (!candidateId) return

            const data = await getSavedJobs(Number(candidateId))
            setJobs(data)

            console.log("jobs saved:", data)
        }

        fetchJobs()

    }, [candidateId])   // ✅ important

    return (
        <div>
            <h2>
                Danh sách <span>{jobs.length}</span> việc làm đã lưu
            </h2>

            {jobs.map(job => (
                <SavedJobCard key={job.jobId} job={job} />
            ))}
        </div>
    )
}