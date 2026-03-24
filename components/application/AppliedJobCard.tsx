"use client";

import { Job } from "@/types/jobs";
import { Application } from "@/types/application";

interface Props {
  job: Job;
  application: Application;
}

export default function AppliedJobCard({ job, application }: Props) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "PENDING":
        return "#facc15";
      case "ACCEPTED":
        return "#22c55e";
      case "REJECTED":
        return "#ef4444";
      default:
        return "#6ea2fd";
    }
  };
  console.log(application);
  return (
    <div className="applied_job_card">
      {/* LEFT COLOR BAR */}
      <div
        className="status_bar"
        style={{ backgroundColor: getStatusColor(application.status) }}
      />

      <div className="card_content">
        {/* HEADER */}
        <div className="card_header">
          <h3>{job.title}</h3>
          <span
            className="status_badge"
            style={{ backgroundColor: getStatusColor(application.status) }}
          >
            {application.status || "UNKNOWN"}
          </span>
        </div>

        {/* FIELDS */}
        <div className="card_body">
          <p><strong>Company:</strong> {job.company_name}</p>
          <p><strong>Full Name:</strong> {application.fullName}</p>
          <p><strong>Email:</strong> {application.email}</p>
          <p><strong>Phone:</strong> {application.phone}</p>
          <p>
            <strong>Applied Date:</strong>{" "}
            {application.appliedDate
              ? new Date(application.appliedDate).toLocaleDateString()
              : "N/A"}
          </p>
          <p><strong>Cover Letter:</strong> {application.letter || "N/A"}</p>
        </div>

        {/* ACTION */}
        <div className="card_footer">
          {application.cvFileUrl && (
            <a
              href={`http://localhost:9191/uploads/${application.cvFileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cv_button"
            >
              View CV
            </a>
          )}
        </div>
      </div>
    </div>
  );
}