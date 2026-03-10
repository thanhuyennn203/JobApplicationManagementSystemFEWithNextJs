"use client";

import { useState } from "react";
import { recruiterRegister } from "@/services/auth/recruiterRegister.service";
import { useRouter } from "next/navigation";
import "@/styles/RecruiterRegister.css";

export default function RecruitmentRegisterForm() {

  const router = useRouter();

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    gender: "male", 
    phone: "",
    company: "",
    city: "",
    ward: "",
    agree: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    const { name, value, type } = e.target;

    if (type === "checkbox") {

      const checked = (e.target as HTMLInputElement).checked;

      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));

    } else {

      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

    }

  };

  // ✅ VALIDATION
  const validateForm = () => {

    if (
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.fullName ||
      !formData.gender ||
      !formData.phone ||
      !formData.company ||
      !formData.city ||
      !formData.ward
    ) {
      return "All fields are required";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Password and Confirm Password must match";
    }

    if (!formData.agree) {
      return "You must agree to Terms and Privacy Policy";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {

      await recruiterRegister({
        email: formData.email,
        password: formData.password,
        recruiterInfo: {
          fullName: formData.fullName,
          gender: formData.gender,
          phone: formData.phone,
          company: formData.company,
          city: formData.city,
          ward: formData.ward
        }
      });

      alert("Register successful");

      router.push("/login");

    } catch (err: any) {

      setError(err?.response?.data?.message || "Registration failed");

    }

  };

  return (

    <form className="register-card" onSubmit={handleSubmit}>

      <h2>Account</h2>

      {error && <p className="error">{error}</p>}

      <button type="button" className="google-btn">
        Sign up with Google
      </button>

      <p className="divider">Or sign up using email</p>

      <label>Email *</label>
      <input
        name="email"
        type="email"
        placeholder="example@company.com"
        onChange={handleChange}
      />

      <p className="note">
        Employers should use a company email instead of a personal email.
      </p>

      <label>Password *</label>
      <input
        name="password"
        type="password"
        onChange={handleChange}
      />

      <label>Confirm Password *</label>
      <input
        name="confirmPassword"
        type="password"
        onChange={handleChange}
      />

      <h2>Recruiter Information</h2>

      <label>Full Name *</label>
      <input
        name="fullName"
        type="text"
        placeholder="Your name"
        onChange={handleChange}
      />

      <label>Gender *</label>

      <div className="radio-group">

        <label>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={formData.gender === "male"}
            onChange={handleChange}
          />
          Male
        </label>

        <label>
          <input
            type="radio"
            name="gender"
            value="female"
            checked={formData.gender === "female"}
            onChange={handleChange}
          />
          Female
        </label>

      </div>

      <label>Phone Number *</label>
      <input
        name="phone"
        type="text"
        placeholder="Your phone number"
        onChange={handleChange}
      />

      <label>Company *</label>
      <input
        name="company"
        type="text"
        placeholder="Company name"
        onChange={handleChange}
      />

      <div className="row">

        <div>

          <label>Work Location *</label>

          <select name="city" onChange={handleChange}>

            <option value="">Select city</option>
            <option value="Hanoi">Hanoi</option>
            <option value="Ho Chi Minh">Ho Chi Minh</option>

          </select>

        </div>

        <div>

          <label>Ward *</label>

          <select name="ward" onChange={handleChange}>

            <option value="">Select ward</option>
            <option value="Ward 1">Ward 1</option>
            <option value="Ward 2">Ward 2</option>

          </select>

        </div>

      </div>

      <label className="agree">

        <input
          type="checkbox"
          name="agree"
          onChange={handleChange}
        />

        I agree to the Terms of Service and Privacy Policy

      </label>

      <button type="submit" className="submit-btn">
        Complete
      </button>

      <p className="login-link">
        Already have an account?{" "}
        <span onClick={() => router.push("/login")}>
          Login now
        </span>
      </p>

    </form>
  );

}