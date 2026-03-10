"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/styles/JobDetailHeader.css";
import {
  checkSavedJob,
  saveJob,
  removeSavedJob,
} from "@/services/candidate/savedJob.service";

interface Props {
  data: {
    jobId: string;
    title: string;
    income: string;
    locations: string[];
    experience: string;
    due_date: string;
  };
}

export default function JobDetailHeader({ data }: Props) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const candidateId =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("candidateId") || "null")
      : null;

  const daysLeft = Math.max(
    Math.ceil(
      (new Date(data.due_date).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
    ),
    0
  );

  useEffect(() => {
    const checkSaved = async () => {
      if (!candidateId) return;

      try {
        const result = await checkSavedJob(candidateId, data.jobId);
        setSaved(result);
      } catch (err) {
        console.error("Check saved job failed", err);
      }
    };

    checkSaved();
  }, [candidateId, data.jobId]);

  const handleSaveJob = async () => {
    if (!candidateId) {
      alert("You have to login as a candidate.");
      return;
    }

    try {
      setLoading(true);

      if (saved) {
        await removeSavedJob(candidateId, data.jobId);
      } else {
        await saveJob(candidateId, data.jobId);
      }

      setSaved(!saved);
      router.refresh();

    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-apply-card">
      <h1 className="job-title">{data.title}</h1>

      <div className="job-meta-row">
        <MetaItem icon="fa-dollar-sign" label="Thu nhập" value={data.income} />

        <MetaItem
          icon="fa-location-dot"
          label="Địa điểm"
          value={data.locations.join(", ")}
        />

        <MetaItem
          icon="fa-hourglass-half"
          label="Kinh nghiệm"
          value={data.experience}
        />
      </div>
      <div className="job-actions">
        <button className="apply-btn">
          <i className="fa-solid fa-paper-plane" />
          Ứng tuyển ngay
        </button>

        <button className="save-btn" onClick={handleSaveJob} disabled={loading}>
          <i className={saved ? "fa-solid fa-heart" : "fa-regular fa-heart"} />
          {saved ? "Đã lưu" : "Lưu tin"}
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

