"use client";

import { useEffect, useState } from "react";
import JobCard from "@/components/jobs/JobCard";
import Pagination from "@/components/jobs/Pagination";
import { Job } from "@/types/jobs";
import { PageResponse } from "@/types/TopJob";
import { searchJobs } from "@/services/jobs/jobs.service";
import JobSearch from "@/components/jobs/JobSearch";

export default function SearchJobsPage() {

    const [page, setPage] = useState(1);

    const [jobsPage, setJobsPage] =
        useState<PageResponse<Job> | null>(null);


    const params =
        new URLSearchParams(
            typeof window !== "undefined"
                ? window.location.search
                : ""
        );


    const jobTitle =
        params.get("jobTitle") || "";
    const companyName =
        params.get("companyName") || "";
    const province =
        params.get("province") || "";



    useEffect(() => {

        const loadJobs = async () => {

            const response =
                await searchJobs({
                    jobTitle: jobTitle,
                    companyName: companyName,
                    province,
                    page: page - 1,
                    size: 12,
                });


            setJobsPage(response);
        };
        loadJobs();

    }, [
        page,
        jobTitle, companyName,
        province
    ]);

    return (

        <div className="">
            <JobSearch />
            <div className="left">
                <div className="px-30 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {
                        jobsPage?.content.map(job => (

                            <JobCard
                                key={job.id}
                                job={job}
                            />

                        ))
                    }
                </div>

                <Pagination
                    page={page}
                    totalPages={
                        jobsPage?.totalPages || 0
                    }
                    setPage={setPage}
                />


            </div>


        </div>
    );
}