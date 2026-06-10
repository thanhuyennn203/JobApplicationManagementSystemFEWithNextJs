"use client";

import { useState } from "react";
import { Application } from "@/types/application";
import { updateApplicationStatus } from "@/services/application/application.service";

export default function ApplicationCard({
  application,
  onUpdate,
  onJobClick
}: {
  application: Application;
  onUpdate?: (app: Application) => void;
  onJobClick?: () => void;
}) {
  const [status, setStatus] = useState(application.status);
  const [editing, setEditing] = useState(false);

  const percent = application.matchPercent || Math.floor(Math.random() * 40 + 60);

  const statusColors: any = {
    APPLIED: "bg-blue-100 text-blue-600",
    ACCEPTED: "bg-green-100 text-green-600",
    REJECTED: "bg-red-100 text-red-600",
    PENDING: "bg-yellow-100 text-yellow-600",
  };

  const handleSave = async () => {
    const updated = await updateApplicationStatus(application.id!, status);
    setEditing(false);
    onUpdate?.(updated);
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition">

      {/* STATUS BAR */}
      <div className={`text-xs text-center py-1 rounded-md mb-3 ${statusColors[status]}`}>
        {status}
      </div>

      {/* AVATAR + MATCH */}
      <div className="flex flex-col items-center">

        <div className="relative w-20 h-20">
          <svg className="absolute" width="80" height="80">
            <circle cx="40" cy="40" r="36" stroke="#eee" strokeWidth="6" fill="none"/>
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="#00b14f"
              strokeWidth="6"
              fill="none"
              strokeDasharray={226}
              strokeDashoffset={226 - (226 * percent) / 100}
              strokeLinecap="round"
            />
          </svg>

          <img
            src={application.candidate?.avatar || "/images/default-avatar.jpg"}
            className="w-16 h-16 rounded-full absolute top-2 left-2"
          />
        </div>

        <h3 className="mt-3 text-sm font-semibold text-center">
          {application.fullName}
        </h3>
      </div>

      {/* INFO */}
      <div className="mt-4 text-xs text-gray-500 space-y-1">

        {/* JOB CLICKABLE */}
        <div className="flex justify-between">
          <span>Job</span>
          <button
            onClick={onJobClick}
            className="text-[#00b14f] hover:underline"
          >
            #{application.jobId}
          </button>
        </div>

        <div className="truncate text-right text-gray-400 text-xs">
          {application.jobId || "Unknown job"}
        </div>
         <div className="flex justify-between">
          <span>Phone</span>
          <span>{application.phone}</span>
        </div>
         <div className="flex justify-between">
          <span>Email</span>
          <span>{application.email}</span>
        </div>

        <div className="flex justify-between">
          <span>Applied</span>
          <span>
            {application.appliedDate
              ? new Date(application.appliedDate).toLocaleDateString()
              : "-"}
          </span>
        </div>
      </div>
 
      {/* ACTION */}
      <div className="mt-4 space-y-2">

        <button
          onClick={() =>
            window.open(
              `http://localhost:9191/uploads/${application.cvFileUrl}`,
              "_blank"
            )
          }
          className="w-full text-xs border border-gray-200 py-2 rounded-lg hover:bg-gray-50"
        >
          View CV
        </button>

        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setEditing(true);
            }}
            className="flex-1 text-xs border border-gray-200 rounded-lg px-2"
          >
            <option value="APPLIED">Applied</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="PENDING">Pending</option>
          </select>

          {editing && (
            <button
              onClick={handleSave}
              className="text-xs bg-[#00b14f] text-white px-3 rounded-lg"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}