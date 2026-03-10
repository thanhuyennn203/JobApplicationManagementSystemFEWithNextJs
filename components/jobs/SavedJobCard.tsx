"use client";

import "@/styles/SavedJobCard.css";
import { SavedJob } from "@/services/jobs/savedJob.service";

interface Props {
  job: SavedJob;
}

export default function SavedJobCard({ job }: Props) {

  const logo = job?.logo || "/default-company-logo.png";
  const title = job?.title || "Untitled Job";
  const company = job?.company || "Unknown Company";
  const salary = job?.salary || "Thỏa thuận";
  const locations = job?.locations ?? [];
  const experience = job?.experience || "Không yêu cầu";
  const savedDate = job?.savedDate || "N/A";
  const updatedAt = job?.updatedAt || "N/A";
  console.log(job);
  return (
    <div className="job-card">

      <img
        src={logo}
        className="company-logo"
        alt="company logo"
      />

      <div className="job-info">

        <div className="job-top">
          <h3>{title}</h3>
          <span className="salary">
            <i className="fa-solid fa-dollar-sign" style={{ marginRight: "5px" }}></i>
            {salary}
          </span>
        </div>

        <p className="company">{company}</p>

        <div className="tags">
          {locations.length > 0 ? (
            locations.map((loc, index) => (
              <span key={index} className="tag">
                {loc}
              </span>
            ))
          ) : (
            <span className="tag">Không rõ địa điểm</span>
          )}

          <span className="tag">{experience}</span>
        </div>

        <div className="job-bottom">
          <span>Đã lưu: {savedDate}</span>

          <div className="right">
            <span>Cập nhật {updatedAt}</span>
            <button className="heart">
              <i className="fa-solid fa-heart"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}