"use client";

import { Job } from "@/types/jobs";
import "@/styles/candidate/SavedJobCard.css";
import { useState, useEffect } from "react";
import {
  checkSavedJob,
  saveJob,
  removeSavedJob,
} from "@/services/candidate/savedJob.service";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import { useToast } from "@/components/notification/ToastProvider";
interface Props {
  job: Job;
}

export default function SavedJobCard({ job }: Props) {
  const locations = job.locations ?? [];
  const firstLocation = locations[0];
  const remainingCount = locations.length - 1;
  const auth = useAuth();
  const toast = useToast();
  const [saved, setSaved] = useState(false);
  const candidateId = auth?.user?.candidateId;
  console.log("candidateId: ", job);
  const {getProvinceName} = useLocation();

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
  }, []);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault(); // stop link navigation

    if (!candidateId) {
      toast.warning("You must login as candidate");
      return;
    }

    try {
      if (saved) {
        await removeSavedJob(candidateId, job.id);
        toast.info("Job removed from saved list.");
      } else {
        await saveJob(candidateId, job.id);
        toast.success("Job saved successfully.");
      }

      setSaved(!saved);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update saved job.");
    }
  };
  return (
    <div>
      <div className="job-card">
        <div className="job-card__header">
          <div className="image-box">
            <img
              src={job.logo_url || "/images/company-logo-default.jpg"}
              className="job-card__logo"
              alt={job.company_name}
            />
          </div>


          <div className="job-card__info">
            <h3 className="job-card__title">{job.title}</h3>
            <p className="job-card__company">{job.company_name}</p>

            <span className="salary">
              <i className="fa-solid fa-dollar-sign" style={{ marginRight: "5px" }}></i>
              {job.salary_min && job.salary_max
                ? `${job.salary_min} - ${job.salary_max}`
                : "Negotiable"}
            </span>

          </div>
        </div>

        <div className="job-card__footer">
          {firstLocation && (
            <span className="job-card__badge">
              {getProvinceName(firstLocation.province)}
              {remainingCount > 0 && ` +${remainingCount}`}
            </span>
          )}

          <span className="job-card__badge">
            {job?.experienceRequired ? job.experienceRequired : "No Experience"}
          </span>

        </div>

        <div>
          <p>Saved at:  {new Date(job.savedAt).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</p>
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
    </div>
  );
}
