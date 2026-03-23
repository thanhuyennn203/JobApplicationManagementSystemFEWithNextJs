"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { getAppliedJobByCompanyId } from "@/services/application/application.service"
import { Application } from "@/types/application"
import ApplicationCard from "@/components/application/ApplicationCard"
import "@/styles/application/ApplicationList.css"

export default function ApplicationCandidateList() {

    const auth = useAuth();
    const companyId = auth?.user?.companyId;

    const [applications, setApplications] = useState<Application[]>([]);
    const [activeTab, setActiveTab] = useState<"ALL" | "APPLIED" | "ACCEPTED" | "REJECTED" | "PENDING">("ALL");

    useEffect(() => {
        const fetchApplications = async () => {
            if (!companyId) return;

            try {
                const apps = await getAppliedJobByCompanyId(Number(companyId));
                setApplications(apps);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchApplications();
    }, [companyId]);

    // Filter applications based on active tab
    const filteredApplications = applications.filter(app => {
        if (activeTab === "ALL") return true;
        return app.status?.toUpperCase() === activeTab;
    });

    // Handle status change for a card
    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await fetch(`http://localhost:9191/api/applications/${id}/status?status=${newStatus}`, { method: "PATCH" });
            setApplications(prev =>
                prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
            );
        } catch (err) {
            alert("Status update failed");
        }
    };

    return (
        <div className="application-list-wrapper">
            <h2>
                Applications <span>{applications.length}</span>
            </h2>

            {/* Tabs */}
            <div className="application-tabs">
                {["ALL", "APPLIED", "ACCEPTED", "REJECTED", "PENDING"].map(tab => (
                    <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                        onClick={() => setActiveTab(tab as any)}
                    >
                        {tab.charAt(0) + tab.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>

            {/* Grid of ApplicationCards */}
            <div className="application-grid">
                {filteredApplications.length === 0 ? (
                    <p className="empty-state">No applications in this category.</p>
                ) : (
                    filteredApplications.map(app => (
                        <ApplicationCard
                            key={app.id}
                            application={app}
                            onStatusChange={handleStatusChange}
                        />
                    ))
                )}
            </div>
        </div>
    )
}