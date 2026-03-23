"use client";

import Link from "next/link";
import "@/styles/recruiter/ManageJobCard.css";
import { usePathname } from "next/navigation";
import { GeneralInformation, Job, JobDetail } from "@/types/jobs";

interface Props {
  job: Job;
}

export default function JobCard({ job }: Props) {

  const pathname = usePathname();
  const firstLocation = job?.locations[0];
  const remainingCount = job?.locations.length - 1;

  const postedDate = new Date(job.posted_date).toLocaleDateString();
  const dueDate = new Date(job.dueDate).toLocaleDateString();

  return (
    <Link href={`${pathname}/edit/${job.id}`} className="job-card-link">

      <div className="job-row">

        {/* LEFT: logo + title */}
        <div className="job-row__main">

          <img
            src={job.logo_url || "/images/company-logo-default.jpg"}
            className="job-row__logo"
            alt={job.company_name || "Company"}
          />

          <div>

            <h3 className="job-row__title">{job.title}</h3>

            {/* <p className="job-row__company">
              {job.company_name || "Unknown Company"}
            </p> */}

          </div>

        </div>

        {/* SALARY */}
        <div className="job-row__item">
          <i className="fa-solid fa-money-bill-wave"></i>
          ${job.salary_min} - ${job.salary_max}
        </div>

        {/* LOCATION */}
        {firstLocation && (
          <div className="job-row__item">
            <i className="fa-solid fa-location-dot"></i>
            {firstLocation.province}
            {remainingCount > 0 && ` +${remainingCount}`}
          </div>
        )}

        {/* EXPERIENCE */}
        <div className="job-row__item">
          <i className="fa-solid fa-briefcase"></i>
          {job.experienceRequired}
        </div>

        {/* STATUS */}
        <div className={`job-row__status ${job.status?.toLowerCase()}`}>
          {job.status}
        </div>

        {/* DATES */}
        <div className="job-row__meta">

          <span>
            <i className="fa-solid fa-calendar"></i> {postedDate}
          </span>

          <span>
            <i className="fa-solid fa-clock"></i> {dueDate}
          </span>

        </div>
        <div className="job-row__actions">

          {job.createStatus =="COMPLETED" ? (

            <button className="edit-btn">
              <i className="fa-solid fa-pen"></i>
              Edit Job
            </button>

          ) : (

            <button className="continue-btn">
              <i className="fa-solid fa-circle-arrow-right"></i>
              Continue Creating
            </button>

          )}

        </div>
      </div>

    </Link>
  );
}