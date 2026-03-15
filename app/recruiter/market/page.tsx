"use client";

import { useState } from "react";
import "@/styles/recruiter/CreateJobDetail.css";

export default function CreateJobDetailPage() {

  const [formData, setFormData] = useState({
    description: "",
    requirement: "",
    income: "",
    interest: "",
    allowance: "",
    working_equipment: "",
    working_location: "",
    working_time: "",
    apply_by: "",
    due_date: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    console.log(formData);

    // call API here

  };

  return (

    <div className="job-detail-container">

      <h1 className="page-title">Job Detail</h1>

      <form className="job-detail-form" onSubmit={handleSubmit}>

        {/* Description */}
        <div className="form-section">
          <h3>Job Description</h3>

          <textarea
            name="description"
            rows={6}
            placeholder="Describe the job responsibilities..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Requirements */}
        <div className="form-section">
          <h3>Job Requirements</h3>

          <textarea
            name="requirement"
            rows={6}
            placeholder="Skills, experience, education..."
            value={formData.requirement}
            onChange={handleChange}
          />
        </div>

        {/* Income */}
        <div className="form-section">
          <h3>Income</h3>

          <textarea
            name="income"
            rows={4}
            placeholder="Salary details, bonuses..."
            value={formData.income}
            onChange={handleChange}
          />
        </div>

        {/* Benefits */}
        <div className="form-section">
          <h3>Benefits</h3>

          <textarea
            name="interest"
            rows={4}
            placeholder="Insurance, bonus, holidays..."
            value={formData.interest}
            onChange={handleChange}
          />
        </div>

        {/* Allowance */}
        <div className="form-section">
          <h3>Allowance</h3>

          <textarea
            name="allowance"
            rows={3}
            placeholder="Lunch allowance, transportation..."
            value={formData.allowance}
            onChange={handleChange}
          />
        </div>

        {/* Equipment */}
        <div className="form-section">
          <h3>Working Equipment</h3>

          <textarea
            name="working_equipment"
            rows={3}
            placeholder="Laptop, monitor, software..."
            value={formData.working_equipment}
            onChange={handleChange}
          />
        </div>

        {/* Working Info */}
        <div className="grid-2">

          <div>
            <label>Working Location</label>

            <input
              type="text"
              name="working_location"
              placeholder="Office location"
              value={formData.working_location}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Working Time</label>

            <input
              type="text"
              name="working_time"
              placeholder="Mon - Fri, 9AM - 6PM"
              value={formData.working_time}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* Apply */}
        <div className="grid-2">

          <div>
            <label>Apply Method</label>

            <input
              type="text"
              name="apply_by"
              placeholder="Send CV to email or apply via system"
              value={formData.apply_by}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Application Deadline</label>

            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
            />
          </div>

        </div>

        <button className="submit-btn">
          Save Job Detail
        </button>

      </form>

    </div>

  );
}