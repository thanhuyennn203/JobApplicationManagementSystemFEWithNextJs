"use client";

import { useState, useEffect } from "react";
import "@/styles/recruiter/CreateJob.css";
import {
  getProvinces,
  getWardsByProvince,
  Province,
  Ward
} from "@/services/locations/LocationService";

export default function CreateJobPage() {

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    province: "",
    ward: "",
    detailAddress: "",
    salary_min: "",
    salary_max: "",
    experience_required: "",
    due_date: "",
    status: "OPEN"
  });

  // ✅ Load provinces when page loads
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await getProvinces();
        setProvinces(data);
      } catch (err) {
        console.error("Failed to fetch provinces", err);
      }
    };

    fetchProvinces();
  }, []);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Load wards when province changes
    if (name === "province" && value) {

      try {

        const wardsData = await getWardsByProvince(value);

        setWards(wardsData);

        setFormData(prev => ({
          ...prev,
          ward: ""
        }));

      } catch (err) {
        console.error("Failed to fetch wards", err);
      }

    }

  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);

    // TODO: call API
  };

  return (
    <div className="create-job-container">

      <h1 className="page-title">Create Job Posting</h1>

      <form onSubmit={handleSubmit} className="job-form">

        {/* Job Title */}
        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            name="title"
            placeholder="Frontend Developer..."
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Location */}
        <h3>Job Location</h3>

        <div className="row">

          <div>
            <label>Province *</label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              required
            >
              <option value="">Select province</option>

              {provinces.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}

            </select>
          </div>

          <div>
            <label>Ward *</label>
            <select
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              disabled={!formData.province}
              required
            >
              <option value="">Select ward</option>

              {wards.map((ward) => (
                <option key={ward.code} value={ward.code}>
                  {ward.name}
                </option>
              ))}

            </select>
          </div>

        </div>

        {/* Detail Address */}
        <div className="form-group">
          <label>Detail Address *</label>

          <input
            name="detailAddress"
            type="text"
            placeholder="Street, building, office..."
            value={formData.detailAddress}
            onChange={handleChange}
            required
          />
        </div>

        {/* Salary */}
        <div className="salary-group">

          <div className="form-group">
            <label>Salary Min ($)</label>
            <input
              type="number"
              name="salary_min"
              value={formData.salary_min}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Salary Max ($)</label>
            <input
              type="number"
              name="salary_max"
              value={formData.salary_max}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* Experience */}
        <div className="form-group">
          <label>Experience Required</label>
          <select
            name="experience_required"
            value={formData.experience_required}
            onChange={handleChange}
          >
            <option value="">Select experience</option>
            <option value="No experience">No experience</option>
            <option value="1 year">1 year</option>
            <option value="2 years">2 years</option>
            <option value="3+ years">3+ years</option>
            <option value="5+ years">5+ years</option>
          </select>
        </div>

        {/* Due Date */}
        <div className="form-group">
          <label>Application Deadline</label>
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
          />
        </div>

        {/* Status */}
        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Job Description</label>
          <textarea
            name="description"
            rows={6}
            placeholder="Describe responsibilities..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-btn">
          Post Job
        </button>

      </form>

    </div>
  );
}