"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import JobCard from "@/components/jobs/JobCard";
import { Job } from "@/types/jobs";
import { getAllJobs } from "@/services/jobs/jobs.service";


export default function SuggestJobs() {

    const [jobs, setJobs] = useState<Job[]>([]);
    const [page, setPage] = useState(0);

    const JOB_PER_PAGE = 6;


    useEffect(() => {

        const load = async () => {
            try {

                const data = await getAllJobs();

                setJobs(data);

            } catch {

                setJobs([]);

            }
        };

        load();

    }, []);



    const totalPages = Math.ceil(
        jobs.length / JOB_PER_PAGE
    );


    const visibleJobs = jobs.slice(
        page * JOB_PER_PAGE,
        page * JOB_PER_PAGE + JOB_PER_PAGE
    );



    const nextPage = () => {
        setPage(prev =>
            Math.min(prev + 1, totalPages - 1)
        );
    };


    const prevPage = () => {
        setPage(prev =>
            Math.max(prev - 1, 0)
        );
    };



    return (
        <section className="top-company-page-wrapper bg-gray-300">

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold text-[#19324d]">
                    Suggest suitable jobs
                </h2>

                <div className="flex gap-3">

                    <button
                        onClick={prevPage}
                        disabled={page === 0}
                        className="w-10 h-10 rounded-full border flex items-center justify-center disabled:opacity-30"
                    >
                        <ChevronLeft size={20}/>
                    </button>


                    <button
                        onClick={nextPage}
                        disabled={page === totalPages - 1}
                        className="w-10 h-10 rounded-full border flex items-center justify-center disabled:opacity-30"
                    >
                        <ChevronRight size={20}/>
                    </button>

                </div>

            </div>

            <div className="grid grid-cols-3 gap-2">

                {visibleJobs.map(job => (
                    <JobCard
                        key={job.id}
                        job={job}
                    />

                ))}

            </div>


        </section>
    );
}