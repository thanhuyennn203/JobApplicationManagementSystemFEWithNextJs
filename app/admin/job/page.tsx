"use client";

import { useEffect, useState } from "react";
import "@/styles/admin/AdminPage.css";
import Pagination from "@/components/jobs/Pagination";
import { getAllJobs } from "@/services/jobs/jobs.service";
import { Job } from "@/types/jobs";

export default function JobPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(jobs.length / itemsPerPage);

    const currentJobs = jobs.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

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

    // ✅ fix page overflow after data change
    useEffect(() => {
        const newTotal = Math.ceil(jobs.length / itemsPerPage);
        if (page > newTotal) setPage(newTotal || 1);
    }, [jobs]);

    return (
        <div style={{ width: "100%" }}>
            {/* Header */}
            <div className="header">
                <h2>Jobs</h2>
                <div className="actions">
                    <button className="btn primary">+ Add Job</button>
                    <button className="btn">Import</button>
                    <button className="btn">Export</button>
                </div>
            </div>

            {/* Loading */}
            {loading && <p>Loading...</p>}

            {/* Table */}
            {!loading && (
                <>
                    <div className="table" style={{border: "1px"}}>
                        <div className="row head">
                            <div>Logo</div>
                            <div>Title</div>
                            <div>Company</div>
                            <div>Experience</div>
                            <div>Salary</div>
                            <div>Deadline</div>
                            <div>Status</div>
                        </div>

                        {currentJobs.map((job) => (
                            <div className="row" key={job.id}>
                                {/* Logo */}
                                <div>
                                    <img
                                        src={job.logo_url || "/images/company-logo-default.jpg"}
                                        className="avatar"
                                    />
                                </div>

                                {/* Title */}
                                <div>{job.title}</div>

                                {/* Company */}
                                <div>{job.company_name}</div>
                                {/* Experience */}
                                <div>{job.experienceRequired}</div>

                                {/* Salary */}
                                <div>
                                    {job.salary_min} - {job.salary_max}
                                </div>


                                {/* Deadline */}
                                <div>
                                    {new Date(job.dueDate).toLocaleDateString()}
                                </div>

                                {/* Status */}
                                <div>
                                    <span
                                        className={`status ${job.createStatus === "APPROVED"
                                                ? "active"
                                                : job.createStatus === "REJECTED"
                                                    ? "inactive"
                                                    : "pending"
                                            }`}
                                    >
                                        {job.createStatus}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        setPage={setPage}
                    />
                </>
            )}
        </div>
    );
}