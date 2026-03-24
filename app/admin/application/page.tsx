"use client";

import { useEffect, useState } from "react";
import "@/styles/admin/AdminPage.css";
import Pagination from "@/components/jobs/Pagination";
import {
    getAllApplications,
    updateApplicationStatus,
} from "@/services/application/application.service";

interface Application {
    appliedDate?: Date;
    cvFileUrl?: string;
    email?: string;
    fullName?: string;
    id?: number;
    jobId?: number;
    letter?: string;
    phone?: string;
    status?: string;
    companyId?: number;
}

export default function ApplicationPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(applications.length / itemsPerPage);

    const currentApplications = applications.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    // ✅ fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllApplications();
                setApplications(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // ✅ fix page overflow
    useEffect(() => {
        const newTotal = Math.ceil(applications.length / itemsPerPage);
        if (page > newTotal) setPage(newTotal || 1);
    }, [applications]);

    // ✅ update status
    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await updateApplicationStatus(id, status);

            setApplications((prev) =>
                prev.map((app) =>
                    app.id === id ? { ...app, status } : app
                )
            );
        } catch (err) {
            alert("Update failed");
        }
    };

    return (
        <div style={{ width: "100%" }}>
            {/* Header */}
            <div className="header">
                <h2>Applications</h2>
            </div>

            {/* Loading */}
            {loading && <p>Loading...</p>}

            {!loading && (
                <>
                    {/* Table */}
                    <div className="table">
                        <div className="row head">
                            <div>Job ID</div>
                            <div>Name</div>
                            <div>Email</div>
                            <div>Phone</div>
                            <div>Applied Date</div>
                            <div>CV</div>
                            <div>Status</div>
                            {/* <div>Action</div> */}
                        </div>

                        {currentApplications.map((app) => (
                            <div className="row" key={app.id}>
                                {/* Job */}
                                <div>{app.jobId}</div>

                                {/* Name */}
                                <div>{app.fullName}</div>

                                {/* Email */}
                                <div>{app.email}</div>

                                {/* Phone */}
                                <div>{app.phone}</div>

                                {/* Date */}
                                <div>
                                    {app.appliedDate
                                        ? new Date(app.appliedDate).toLocaleDateString()
                                        : "N/A"}
                                </div>

                                {/* CV */}
                                <div>
                                    {app.cvFileUrl ? (
                                        <a
                                            href={app.cvFileUrl}
                                            target="_blank"
                                            className="link"
                                        >
                                            View
                                        </a>
                                    ) : (
                                        "N/A"
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <span
                                        className={`status ${app.status === "ACCEPTED"
                                                ? "active"
                                                : app.status === "REJECTED"
                                                    ? "inactive"
                                                    : "pending"
                                            }`}
                                    >
                                        {app.status || "PENDING"}
                                    </span>
                                </div>

                                {/* Actions */}
                                {/* <div className="actions-btn">
                  <button
                    className="btn approve"
                    onClick={() =>
                      handleUpdateStatus(app.id!, "ACCEPTED")
                    }
                  >
                    Accept
                  </button>

                  <button
                    className="btn reject"
                    onClick={() =>
                      handleUpdateStatus(app.id!, "REJECTED")
                    }
                  >
                    Reject
                  </button>
                </div> */}
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