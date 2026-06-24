"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { Job } from "@/types/jobs";
import { Application } from "@/types/application";
import { getAppliedFormByCandidateId } from "@/services/application/application.service";
import { getJobsByIds } from "@/services/jobs/jobs.service";
import AppliedJobCard from "@/components/application/AppliedJobCard";
import Pagination from "@/components/jobs/Pagination";

export default function AppliedJobsList() {
    const auth = useAuth();
    const candidateId = auth?.user?.candidateId;

    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [page, setPage] = useState(1);

    const ITEMS_PER_PAGE = 3;

    useEffect(() => {
        const fetchJobsFromApplications = async () => {
            if (!candidateId) return;

            try {
                const apps = await getAppliedFormByCandidateId(
                    Number(candidateId)
                );

                setApplications(apps);

                const jobIds = apps
                    .map((app) => app.jobId)
                    .filter(Boolean) as number[];

                if (jobIds.length === 0) {
                    setJobs([]);
                    return;
                }

                const jobsData = await getJobsByIds(jobIds);
                setJobs(jobsData);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchJobsFromApplications();
    }, [candidateId]);

    // Applications của trang hiện tại
    const paginatedApplications = useMemo(() => {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        return applications.slice(startIndex, endIndex);
    }, [applications, page]);

    const totalPages = Math.ceil(
        applications.length / ITEMS_PER_PAGE
    );

    return (
        <div className="saved_job_list_Wrapper">
            <h2>
                List <span>{applications.length}</span> applied jobs.
            </h2>

            <div className="grid grid-col-2 gap-4">
                {paginatedApplications.map((app) => {
                    const job = jobs.find(
                        (j) => j.id === app.jobId
                    );

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

            {totalPages > 1 && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    setPage={setPage}
                />
            )}
        </div>
    );
}