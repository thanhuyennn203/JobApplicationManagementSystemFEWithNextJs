"use client";

import Link from "next/link";
import { Job } from "@/types/jobs";
import "@/styles/JobCard.css";
import { useState, useEffect } from "react";
import {
  checkSavedJob,
  saveJob,
  removeSavedJob,
} from "@/services/candidate/savedJob.service";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

interface Props {
  job: Job;
}

export default function JobCard({ job }: Props) {
  // console.log(job);
  const pathname = usePathname();
  const locations = job.locations ?? [];
  const firstLocation = locations[0];
  const remainingCount = locations.length - 1;
  const auth = useAuth();
  const [saved, setSaved] = useState(false);
  const candidateId = auth?.user?.candidateId;
  // console.log("candidateId: ", candidateId);

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
  }, [candidateId, job.id]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault(); // stop link navigation

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
  return (
    <Link href={`${pathname}/${job.id}`} className="job-card-link">
      <div className="job-card">
        <div className="job-card__header">
          <img
            src={job.logo}
            className="job-card__logo"
            alt={job.company_name}
          />

          <div className="job-card__info">
            <h3 className="job-card__title">{job.title}</h3>
            <p className="job-card__company">{job.company_name}</p>

            {job.tags?.includes("Pro") && (
              <span className="job-card__tag">Pro</span>
            )}
          </div>

          <div
            className="job-card__heart"
            onClick={(e) => e.preventDefault()} // prevent navigation
          >
            <button onClick={handleSave}>
              <i className={saved ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
            </button>

          </div>
        </div>

        <div className="job-card__footer">
          <span className="job-card__badge">
            {job.salary_min / 1_000_000} - {job.salary_max / 1_000_000} million
          </span>

          {firstLocation && (
            <span className="job-card__badge">
              {firstLocation.province}
              {remainingCount > 0 && ` +${remainingCount}`}
            </span>
          )}

        </div>
      </div>
    </Link>
  );
}
