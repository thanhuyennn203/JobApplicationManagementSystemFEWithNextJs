"use client";

import "@/styles/application/ApplicationCard.css";
import { useState } from "react";
import { Application } from "@/types/application";
import { updateApplicationStatus } from "@/services/application/application.service";

interface Props {
  application: Application;
  onUpdate?: (updatedApp: Application) => void; // optional callback to update parent state
}

export default function ApplicationCard({ application, onUpdate }: Props) {
  const [status, setStatus] = useState(application.status);
  const [editing, setEditing] = useState(false);

  const handleViewCV = () => {
    if (application.cvFileUrl) {
      window.open(`http://localhost:9191/uploads/${application.cvFileUrl}`, "_blank");
    } else {
      alert("No CV available");
    }
  };

  const handleChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setEditing(true);
  };

  const handleSaveStatus = async () => {
    if (!confirm(`Are you sure you want to change status to "${status}"?`)) return;

    try {
      const updated = await updateApplicationStatus(application.id!, status);
      setEditing(false);
      if (onUpdate) onUpdate(updated);
      alert("Status updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  // Status color background
  const statusColors: Record<string, string> = {
    APPLIED: "#6bb2ff",
    ACCEPTED: "#0ae26b",
    REJECTED: "#fd3b4e",
    PENDING: "#fdcd3b",
  };

  return (
    <div className="application-card" style={{ minHeight: "350px" }}>
      {/* Top status row */}
      <div
        className="status-row"
        style={{
          background: statusColors[status] || "#eee",
          padding: "8px",
          borderRadius: "12px 12px 0 0",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Status: {status}
      </div>

      {/* Card content */}
      <div className="card-content" style={{ flexGrow: 1, padding: "10px" }}>
        <h3 className="name">{application.fullName}</h3>
        <p><strong>Email:</strong> {application.email}</p>
        <p><strong>Phone:</strong> {application.phone}</p>
        <p><strong>Job ID:</strong> {application.jobId}</p>
        <p><strong>Applied:</strong> {application.appliedDate ? new Date(application.appliedDate).toLocaleString() : ""}</p>

        <div className="letter">
          <strong>Cover Letter:</strong>
          <p style={{ whiteSpace: "pre-wrap" }}>{application.letter}</p>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="card-actions" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button className="btn-view-cv" onClick={handleViewCV}>
          View CV
        </button>

        <select value={status} onChange={handleChangeStatus} style={{ flexGrow: 1 }}>
          <option value="APPLIED">Applied</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
          <option value="PENDING">Pending</option>
        </select>

        {editing && (
          <button className="btn-save-status" onClick={handleSaveStatus}>
            Save
          </button>
        )}
      </div>
    </div>
  );
}