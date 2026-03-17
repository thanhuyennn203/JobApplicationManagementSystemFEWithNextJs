"use client";

import { useEffect, useState } from "react";
import JobCard from "@/components/jobs/JobCard";
import Pagination from "@/components/jobs/Pagination";
import "@/styles/jobs/JobsPage.css";

export default function JobsByLocation() {

    const [jobs, setJobs] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchJobs = async (page: number) => {
        const res = await fetch(
            `http://localhost:8080/api/jobs?page=${page}&size=12`
        );

        const data = await res.json();

        setJobs(data.content);
        setTotalPages(data.totalPages);
    };

    useEffect(() => {
        fetchJobs(page);
    }, [page]);

    return (
        <div className="jobs-by-locations">
            <div className="left">

                {/* header */}
                <div className="jobs-header">

                    <h2>
                        Việc làm tốt nhất
                        <span className="ai-badge">TOPPY AI</span>
                    </h2>

                    <a className="view-all">Xem tất cả</a>

                </div>

                {/* filter chips */}
                <div className="job-filters">
                    <button className="active">Ngẫu Nhiên</button>
                    <button>Hà Nội</button>
                    <button>Thành phố Hồ Chí Minh</button>
                    <button>Miền Bắc</button>
                    <button>Miền Nam</button>
                </div>

                {/* job grid */}
                <div className="job-grid">

                    {jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}

                </div>

                {/* pagination */}
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    setPage={setPage}
                />

            </div>
            <div className="right">
                    <img src="/no-spotlight-mau-cv.png" alt="" />
            </div>
        </div>
    );
}