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
import { useToast } from "@/components/notification/ToastProvider";

interface Props {
  job: Job;
}

export default function JobCard({ job }: Props) {
  const router = useRouter();
  const toast = useToast();
  const locations = job.locations ?? [];

  const auth = useAuth();
  const candidateId = auth?.user?.candidateId;

  const [saved, setSaved] = useState(false);

  const { getProvinceName } = useLocation();

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
  // console.log(job);
  const provinces = locations.map(
    (loc) => getProvinceName(loc.province)
  );

  const visibleProvinces = provinces.slice(0, 3);
  const remainingCount = provinces.length - visibleProvinces.length;

  return (
    <div className="job-card" onClick={() => router.push(`/candidate/jobs/${job.id}`)}>
      <div className="job-card__header">
        <div className="job-card__logo-box">
          <img
            src={job.logo_url || "/images/company-logo-default.jpg"}
            className="job-card__logo"
            alt={job.company_name}
          />
        </div>

        <div className="job-card__info">
          <h3 className="job-card__title">
            {job.title}
            {job.tags?.includes("Pro") && (
              <span className="job-card__tag">Pro</span>
            )}
          </h3>

          <p className="job-card__company">{job?.company_name}</p>
          {visibleProvinces.length > 0 && (
            <span className="text-xs text-gray-500">
              {locations.map((loc, index) => (
                <span key={loc.id}>
                  {getProvinceName(loc.province)}
                  {index < visibleProvinces.length - 1 && ", "}
                </span>
              ))}

              {remainingCount > 0 && ` & +${remainingCount}`}
            </span>
          )}
        </div>
      </div>

      <div className="job-card__footer">
        <span className="job-card__badge">
          $ {job.salary_min} - {job.salary_max}
        </span>

        <span className="job-card__badge">
          {job.experienceRequired}
        </span>

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
  );
}