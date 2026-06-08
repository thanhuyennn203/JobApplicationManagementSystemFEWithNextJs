"use client";

import { useEffect, useState } from "react";
import "@/styles/admin/AdminPage.css";
import { getAllCompanies, approveCompany, rejectCompany } from "@/services/companies/company.service";
import Pagination from "@/components/jobs/Pagination"; // adjust path
import { useToast } from "@/components/notification/ToastProvider";

export default function CompanyPage() {
    const toast = useToast();
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(companies.length / itemsPerPage);

    const currentCompanies = companies.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );
                    console.log(localStorage.getItem("token"));

    const handleReject = async (id: number) => {
        const reason = prompt("Enter rejection reason:");
        if (!reason) return;

        try {
            await rejectCompany(id, reason);

            // remove from list
            setCompanies((prev) => prev.filter((c) => c.id !== id));
            toast.success("Company rejected.");

        } catch (err) {
            toast.error("Reject failed");
        }
    };
    const handleApprove = async (id: number) => {
        try {
            await approveCompany(id);

            // remove from list (pending list UX)
            setCompanies((prev) => prev.filter((c) => c.id !== id));
            toast.success("Company approved.");

        } catch (err) {
            toast.error("Approve failed");
        }
    };
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const data = await getAllCompanies();
                setCompanies(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    return (
        <div style={{ width: "100%" }}>

            {/* Header */}
            <div className="header">
                <h2>Companies</h2>
                <div className="actions">
                    <button className="btn primary">+ Add new</button>
                    <button className="btn">Import</button>
                    <button className="btn">Export</button>
                    <button className="btn purple">Filter</button>
                </div>
            </div>

            {/* Loading */}
            {loading && <p>Loading...</p>}

            {/* Table */}
            {!loading && (
                <div className="table">
                    <div className="row head">
                        <div>Logo</div>
                        <div>Name</div>
                        <div>Industry</div>
                        <div>Location</div>
                        <div>Status</div>
                        <div>Certificate</div>
                        <div>Action</div>
                    </div>

                    {currentCompanies.map((c) => (
                        <div className="row" key={c.id}>
                            {/* Logo */}
                            <div>
                                <img
                                    src={c.logo_url || "/images/company-logo-default.jpg"}
                                    className="avatar"
                                />
                            </div>

                            {/* Name */}
                            <div>{c.name}</div>

                            {/* Industry */}
                            <div>{c.industry}</div>

                            {/* Location */}
                            <div>
                                {c.province} - {c.ward}
                            </div>

                            {/* Status */}
                            <div>
                                <span
                                    className={`status ${c.verificationStatus === "APPROVED"
                                        ? "active"
                                        : c.verificationStatus === "REJECTED"
                                            ? "inactive"
                                            : "pending"
                                        }`}
                                >
                                    {c.verificationStatus || "PENDING"}
                                </span>
                            </div>

                            {/* Certificate */}
                            <div>
                                {c.certificateUrl ? (
                                    <a
                                        href={c.certificateUrl}
                                        target="_blank"
                                        className="link"
                                    >
                                        View
                                    </a>
                                ) : (
                                    "N/A"
                                )}
                            </div>

                            {/* Actions */}
                            <div className="actions-btn">
                                <button
                                    className="btn approve"
                                    onClick={() => handleApprove(c.id)}
                                >
                                    Approve
                                </button>

                                <button
                                    className="btn reject"
                                    onClick={() => handleReject(c.id)}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
                
            )}
                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />

        </div>
    );
}
