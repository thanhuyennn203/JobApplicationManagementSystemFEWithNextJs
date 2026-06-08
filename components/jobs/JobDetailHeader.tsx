"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/styles/candidate/JobDetailHeader.css";
import {
  checkSavedJob,
  saveJob,
  removeSavedJob,
} from "@/services/candidate/savedJob.service";
import { useAuth } from "@/context/AuthContext";
import ApplyJobModal from "../application/ApplyJobModal";
import { useToast } from "@/components/notification/ToastProvider";

interface Props {
  data: {
    jobId: number;
    title: string;
    income: string;
    locations: Location[];
    experience: string;
    due_date: Date;
    companyId: number;
  };
}

export default function JobDetailHeader({ data }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const toast = useToast();
  const [saved, setSaved] = useState(false);
  const candidateId = auth?.user?.candidateId;
  const [showModal, setShowModal] = useState(false);
  // console.log("candidateId: ", candidateId);

  useEffect(() => {
    const detectSaved = async () => {
      if (!candidateId) return;

      try {
        const result = await checkSavedJob(candidateId, data.jobId);
        setSaved(result);
      } catch (err) {
        console.error(err);
      }
    };

    detectSaved();
  }, [candidateId, data.jobId]);

  const daysLeft = Math.max(
    Math.ceil(
      (new Date(data.due_date).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
    ),
    0
  );

  const handleSaveJob = async () => {
    if (!candidateId) {
      toast.warning("You have to login as a candidate.");
      return;
    }

    try {
      setLoading(true);

      if (saved) {
        await removeSavedJob(candidateId, data.jobId);
        toast.info("Job removed from saved list.");
      } else {
        await saveJob(candidateId, data.jobId);
        toast.success("Job saved successfully.");
      }

      setSaved(!saved);
      router.refresh();

    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-apply-card">
      {showModal && (
        <>
          <div className="modal-backdrop" onClick={() => setShowModal(false)}></div>
          <ApplyJobModal
            jobTitle={data?.title || ""}
            jobId={data.jobId}
            companyId={data.companyId}
            onClose={() => setShowModal(false)}
          />
        </>
      )}
      <h1 className="job-title">{data.title}</h1>

      <div className="job-meta-row">
        <MetaItem icon="fa-dollar-sign" label="Income" value={data.income} />

        <MetaItem
          icon="fa-location-dot"
          label="Location"
          value={
            data.locations.length > 2
              ? `${data.locations.slice(0, 2).join(", ")}...`
              : data.locations.join(", ")
          }
        />

        <MetaItem
          icon="fa-hourglass-half"
          label="Experience"
          value={data.experience}
        />
      </div>

      <p><strong>Due date:</strong>{" "}
        {new Date(data.due_date).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}

        {daysLeft > 0 ? (
          <span style={{ color: daysLeft <= 3 ? "red" : "green", paddingLeft: "5px", }}>
            ({daysLeft} days left)
          </span>
        ) : (
          <span style={{ color: "red", paddingLeft: "5px", }}>(Expired)</span>
        )}
      </p>

      <div className="job-actions">
        <button className="apply-btn" onClick={() => setShowModal(true)}>
          <i className="fa-solid fa-paper-plane" />
          Apply Now
        </button>

        <button className="save-btn" onClick={handleSaveJob} disabled={loading}>
          <i className={saved ? "fa-solid fa-heart" : "fa-regular fa-heart"} />
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}

function MetaItem({
  icon, label, value,
}:
  { icon: string; label: string; value: string; }) {
  return (
    <div className="meta-item">
      <div className="icon">
        <i className={`fa-solid ${icon}`} />
      </div>
      <div> <span className="label">{label}</span>
        <span className="value">{value}</span>
      </div>
    </div>
  );
}

