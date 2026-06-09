"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/jobs/Pagination";
import { getAllJobs } from "@/services/jobs/jobs.service";
import { Job } from "@/types/jobs";
import { BriefcaseBusiness, Plus, Download, Upload, Search } from "lucide-react";


export default function JobPage() {

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");

    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const statusStyle: Record<string, string> = {
        DRAFT: "bg-gray-100 text-gray-600",
        OPEN: "bg-green-100 text-green-700",
        CLOSED: "bg-blue-100 text-blue-700",
        EXPIRED: "bg-orange-100 text-orange-700",
    };

    useEffect(() => {

        const fetchJobs = async () => {
            try {
                const data = await getAllJobs();
                setJobs(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();

    }, []);



    const filteredJobs = jobs.filter(job =>
        job.title?.toLowerCase()
            .includes(keyword.toLowerCase())
        ||
        job.company_name?.toLowerCase()
            .includes(keyword.toLowerCase())
    );


    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);


    const currentJobs = filteredJobs.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );



    return (

        <div className="min-h-screen bg-[#f7f9fc] p-6">


            {/* Header */}

            <div className="flex items-center justify-between mb-6">


                <div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Job Management
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage all recruitment posts
                    </p>

                </div>



                <div className="flex gap-3">


                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-white text-sm hover:bg-gray-50">
                        <Upload size={16} />
                        Import
                    </button>


                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-white text-sm hover:bg-gray-50">
                        <Download size={16} />
                        Export
                    </button>


                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0b77da] text-white text-sm hover:bg-blue-700">
                        <Plus size={16} />
                        Add Job
                    </button>


                </div>

            </div>





            {/* Search */}

            <div className="bg-white border rounded-xl px-4 py-3 mb-5 flex items-center gap-3">

                <Search size={18} className="text-gray-400" />

                <input
                    placeholder="Search job title or company..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="outline-none w-full text-sm"
                />

            </div>





            {loading && (
                <div className="text-gray-500">
                    Loading jobs...
                </div>
            )}






            {!loading && (


                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">


                    {/* table header */}

                    <div className="grid grid-cols-[80px_2fr_1.5fr_1fr_1fr_1fr_120px] px-5 py-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">

                        <div>ID</div>
                        <div>Job</div>
                        <div>Company</div>
                        <div>Experience</div>
                        <div>Salary</div>
                        <div>Deadline</div>
                        <div>Status</div>

                    </div>




                    {
                        currentJobs.map(job => (


                            <div
                                key={job.id}
                                className="grid grid-cols-[80px_2fr_1.5fr_1fr_1fr_1fr_120px] items-center px-5 py-4 border-t hover:bg-gray-50 transition"
                            >



                                {/* ID */}

                                <div className="text-sm font-medium text-gray-500">
                                    #{job.id}
                                </div>





                                {/* Job */}

                                <div className="flex items-center gap-3">


                                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                                        <BriefcaseBusiness size={20} className="text-[#0b77da]" />

                                    </div>


                                    <div>

                                        <p className="font-semibold text-gray-900">
                                            {job.title}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            {job.location || "Remote"}
                                        </p>

                                    </div>


                                </div>





                                {/* Company */}

                                <div className="flex items-center gap-2">


                                    <img
                                        src={job.logo_url || "/images/company-logo-default.jpg"}
                                        className="w-9 h-9 rounded-lg object-cover border"
                                    />


                                    <span className="text-sm text-gray-700">
                                        {job.company_name}
                                    </span>


                                </div>





                                {/* Experience */}

                                <div className="text-sm text-gray-600">
                                    {job.experienceRequired || "-"}
                                </div>





                                {/* Salary */}

                                <div className="text-sm font-medium text-[#0b77da]">

                                    {job.salary_min && job.salary_max
                                        ? `${job.salary_min} - ${job.salary_max}`
                                        : "Negotiable"
                                    }

                                </div>





                                {/* Deadline */}

                                <div className="text-sm text-gray-600">

                                    {new Date(job.dueDate)
                                        .toLocaleDateString("vi-VN")}

                                </div>

                                {/* Status */}
                                <div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[job.status] || "bg-gray-100 text-gray-500"}`}>
                                        {job.status}
                                    </span>


                                </div>



                            </div>


                        ))
                    }
                </div>
            )}

            {!loading && (

                <div className="mt-5">

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        setPage={setPage}
                    />

                </div>

            )}



        </div>

    );
}