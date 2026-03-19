"use client";

import "@/styles/application/ApplicationCard.css";
import { Application } from "@/types/application";

interface Props {
  application: Application;
}

export default function ApplicationCard({ application }: Props) {

  const handleViewCV = () => {
    if (application.cvFileUrl) {
      window.open(`http://localhost:9191/uploads/${application.cvFileUrl}`, "_blank");
      // window.open(`http://localhost:9191/uploads/${application.cvFileUrl}`);
    } else {
      alert("No CV available");
    }
  };

  return (
    <div className="application-card">
      <div className="card-content">

        <h3 className="name">{application.fullName}</h3>

        <p><strong>Email:</strong> {application?.email}</p>
        <p><strong>Phone:</strong> {application?.phone}</p>
        <p><strong>Job ID:</strong> {application?.jobId}</p>

        <p><strong>Status:</strong>
          <span className={`status ${application.status?.toLowerCase()}`}>
            {application.status}
          </span>
        </p>

        <p><strong>Applied:</strong>
          {application.appliedDate
            ? new Date(application.appliedDate).toLocaleString()
            : ""}
        </p>

        <div className="letter">
          <strong>Cover Letter:</strong>
          <p>{application.letter}</p>
        </div>

      </div>

      <button className="btn-view-cv" onClick={handleViewCV}>
        View CV
      </button>
    </div>
  );
}