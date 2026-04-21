"use client";

import { Job } from "@/types/jobs";
import "@/styles/candidate/JobCard.css";
import { useState, useEffect } from "react";
import {
  checkSavedJob,
  saveJob,
  removeSavedJob,
} from "@/services/candidate/savedJob.service";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import { useRouter } from "next/navigation";

interface Props {
  job: Job;
}

export default function JobCard({ job }: Props) {
  const router = useRouter();
  const locations = job.locations ?? [];
  const firstLocation = locations[0];
  const remainingCount = locations.length - 1;

  const auth = useAuth();
  const candidateId = auth?.user?.candidateId;

  const [saved, setSaved] = useState(false);

  const { provinces, getProvinceName } = useLocation();
  // console.log("locations: ", candidateId);

  useEffect(() => {
    const detectSaved = async () => {
      if (!candidateId) return;

      try {
        const result = await checkSavedJob(candidateId, job.id);
        setSaved(result);
      } catch (err) {
        console.error(err);
      }
    };

    detectSaved();
  }, [candidateId]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!candidateId) {
      alert("You must login as candidate");
      return;
    }

    try {
      if (saved) {
        await removeSavedJob(candidateId, job.id);
      } else {
        await saveJob(candidateId, job.id);
      }

      setSaved(!saved);
    } catch (error) {
      console.error(error);
    }
  };
  console.log(job);

  return (
    // <Link href={`/candidate/jobs/${job.id}`} className="job-card-link">
    <div className="job-card" onClick={() => router.push(`/candidate/jobs/${job.id}`)}>
      <div className="job-card__header">
        <div className="box-comapny-logo">
          <div className="avatar">
            <img
              src={job.logo_url || "/images/company-logo-default.jpg"}
              className="job-card__logo"
              alt={job.company_name}
            />
          </div>
        </div>

        <div className="job-card__info">
          <h3 className="job-card__title">{job.title}</h3>

          <div className="company_name">
            <p className="job-card__company">{job.company_name}</p>
          </div>

          {job.tags?.includes("Pro") && (
            <span className="job-card__tag">Pro</span>
          )}
        </div>
      </div>

      <div className="job-card__footer">
        <span className="job-card__badge">
          {job.salary_min} - {job.salary_max} dollar
        </span>

        {firstLocation && (
          <span className="job-card__badge">
            {getProvinceName(firstLocation.province)}
            {remainingCount > 0 && ` +${remainingCount}`}
          </span>
        )}

        <div
          className="job-card__heart"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="heart-icon" onClick={handleSave}>
            <i
              className={
                saved ? "fa-solid fa-heart" : "fa-regular fa-heart"
              }
            ></i>
          </button>
        </div>
      </div>
    </div>
    // </Link>
  );
}