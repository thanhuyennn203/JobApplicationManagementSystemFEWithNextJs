"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { getAppliedJobByCompanyId } from "@/services/application/application.service"
import { Application } from "@/types/application"
import ApplicationCard from "@/components/application/ApplicationCard"

export default function ApplicationCandidateList() {

    const auth = useAuth();
    // const candidateId = auth?.user?.candidateId;
    const companyId = auth?.user?.companyId;

    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        const fetchApplications = async () => {
            if (!companyId) return;

            try {
                // 1. Get applications
                const applications = await getAppliedJobByCompanyId(Number(companyId));
                setApplications(applications);
                console.log(applications);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchApplications();
    }, [companyId]);

    return (
        <div className="saved_job_list_Wrapper">
            <h2>
                List <span>{applications.length}</span> applications.
            </h2>


            <div className="saved_jobs_list_grid">
                {applications.map(app => (
                    <ApplicationCard key={app.id} application={app} />
                ))}
            </div>

        </div>
    )
}