"use client";

import "@/styles/SavedJobCard.css";
import { SavedJob } from "@/services/jobs/savedJob.service";

interface Props {
  job: SavedJob
}

export default function SavedJobCard({ job }: Props) {
  return (
    <div className="job-card">

      <img src={job.logo} className="company-logo"/>

      <div className="job-info">

        <div className="job-top">
          <h3>{job.title}</h3>
          <span className="salary">{job.salary}</span>
        </div>

        <p className="company">{job.company}</p>

        <div className="tags">
          {job.locations?.map((loc, index) => (
            <span key={index} className="tag">{loc}</span>
          ))}

          {job.experience && (
            <span className="tag">{job.experience}</span>
          )}
        </div>

        <div className="job-bottom">
          <span>Đã lưu: {job.savedDate}</span>

          <div className="right">
            <span>Cập nhật {job.updatedAt}</span>
            <button className="heart">
              <i className="fa-solid fa-heart"></i>
            </button>
          </div>
        </div>

      </div>

    </div>
  )
}