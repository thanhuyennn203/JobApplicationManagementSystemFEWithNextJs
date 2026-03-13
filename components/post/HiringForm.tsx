"use client";

import { useState } from "react";
import "@/styles/candidate/HiringForm.css";

export default function HiringForm() {

  const [formData, setFormData] = useState({
    jobCategory: "",
    level: "Staff",
    deadline: "",
    quantity: 1,
    continuous: false,
    salaryFrom: "",
    salaryTo: "",
    budgetSource: "company",
    consultation: ""
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const increase = () => {
    setFormData({ ...formData, quantity: formData.quantity + 1 });
  };

  const decrease = () => {
    if (formData.quantity > 1) {
      setFormData({ ...formData, quantity: formData.quantity - 1 });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="hiring-container">

      <div className="hiring-left">

        <h2>Hello, Tran Van Quyen</h2>

        <p className="subtitle">
          Please provide information about your upcoming recruitment needs.
        </p>

        <form onSubmit={handleSubmit}>

          <h3>Recruitment Needs</h3>

          <label>What position are you hiring for? *</label>
          <select
            name="jobCategory"
            onChange={handleChange}
            required
          >
            <option value="">Select job position</option>
            <option>Software Engineer</option>
            <option>Designer</option>
            <option>Marketing</option>
          </select>

          <label>Level *</label>
          <select name="level" onChange={handleChange}>
            <option>Intern</option>
            <option>Staff</option>
            <option>Senior</option>
            <option>Manager</option>
          </select>

          <div className="row">

            <div>
              <label>Hiring deadline *</label>
              <input
                type="date"
                name="deadline"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Number of hires *</label>

              <div className="quantity-box">
                <button type="button" onClick={decrease}>-</button>
                <span>{formData.quantity}</span>
                <button type="button" onClick={increase}>+</button>
              </div>

            </div>

          </div>

          <label className="checkbox">
            <input
              type="checkbox"
              name="continuous"
              onChange={handleChange}
            />
            Continuous recruitment
          </label>

          <label>Recruitment budget</label>

          <div className="row">
            <input
              type="number"
              placeholder="From"
              name="salaryFrom"
              onChange={handleChange}
            />

            <input
              type="number"
              placeholder="To"
              name="salaryTo"
              onChange={handleChange}
            />
          </div>

          <label>Budget source</label>

          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="budgetSource"
                value="company"
                defaultChecked
                onChange={handleChange}
              />
              Company
            </label>

            <label>
              <input
                type="radio"
                name="budgetSource"
                value="personal"
                onChange={handleChange}
              />
              Personal
            </label>
          </div>

          <label>Need consultation?</label>
          <select
            name="consultation"
            onChange={handleChange}
          >
            <option value="">Select consultation</option>
            <option>Posting job</option>
            <option>CV database</option>
            <option>Employer branding</option>
          </select>

          <button className="submit-btn">
            Complete
          </button>

        </form>

      </div>

      <div className="hiring-right">
        <img src="/recruiter-illustration.png" />
      </div>

    </div>
  );
}