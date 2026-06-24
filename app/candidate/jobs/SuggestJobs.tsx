"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import JobCard from "@/components/jobs/JobCard";
import { Job } from "@/types/jobs";
import { getMatchedJobsForCandidate } from "@/services/jobs/jobs.service";
import { useAuth } from "@/context/AuthContext";
import { PageResponse } from "@/types/TopJob";


export default function SuggestJobs() {

    const auth = useAuth();
    const candidateId = auth?.user?.candidateId;


    const [page, setPage] = useState(0);

    const [jobsPage, setJobsPage] =
        useState<PageResponse<Job> | null>(null);


    const JOB_PER_PAGE = 6;

    useEffect(() => {

        if (!candidateId) return;

        const load = async () => {

            try {

                const data =
                    await getMatchedJobsForCandidate(
                        candidateId,
                        page,
                        JOB_PER_PAGE
                    );

                // console.log("suitable job: ",data);
                setJobsPage(data);

            } catch (err) {

                setJobsPage(null);

            }
        };


        load();


    }, [
        candidateId,
        page
    ]);



    if (!candidateId) {
        return null;
    }



    const totalPages =
        jobsPage?.totalPages ?? 0;



    const nextPage = () => {

        setPage(prev =>
            Math.min(
                prev + 1,
                totalPages - 1
            )
        );

    };



    const prevPage = () => {

        setPage(prev =>
            Math.max(
                prev - 1,
                0
            )
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
                        className="
                          w-10 h-10
                          rounded-full
                          border
                          flex
                          items-center
                          justify-center
                          disabled:opacity-30
                        "
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <button
                        onClick={nextPage}
                        disabled={
                            page === totalPages - 1 ||
                            totalPages === 0
                        }
                        className="
                          w-10 h-10
                          rounded-full
                          border
                          flex
                          items-center
                          justify-center
                          disabled:opacity-30
                        "
                    >
                        <ChevronRight size={20} />
                    </button>


                </div>


            </div>



            <div className="
                grid
                grid-cols-3
                gap-2
            ">


                {
                    jobsPage?.content?.length ? (

                        jobsPage.content.map(job => (

                            <JobCard
                                key={job.id}
                                job={job}
                            />

                        ))

                    ) : (

                        <div
                            className="
        col-span-3
        min-h-[280px]
        flex
        flex-col
        items-center
        justify-center
        rounded-2xl
        bg-gradient-to-br
        from-emerald-50
        via-white
        to-green-50
        border
        border-emerald-100
        shadow-sm
        text-center
        px-6
      "
                        >

                            <div
                                className="
          w-16
          h-16
          rounded-full
          bg-emerald-100
          flex
          items-center
          justify-center
          mb-4
        "
                            >

                                <i
                                    className="
            fa-solid
            fa-briefcase
            text-2xl
            text-emerald-500
          "
                                />

                            </div>



                            <h3
                                className="
          text-xl
          font-semibold
          text-emerald-800
          mb-2
        "
                            >
                                No suitable jobs found
                            </h3>



                            <p
                                className="
          text-gray-500
          max-w-md
          leading-relaxed
        "
                            >
                                We don't have enough information to suggest suitable jobs yet.
                                You can search and apply for jobs using the search bar. </p>


                        </div>

                    )
                }


            </div>


        </section>
    );
}