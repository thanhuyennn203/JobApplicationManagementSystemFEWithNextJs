"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth"; 
import { useLocation } from "@/context/LocationContext";
import { useRouter } from "next/navigation";
import "@/styles/recruiter/RecruiterRegister.css";

export default function RecruitmentRegisterForm() {
  const { recruiterRegister } = useAuth();
  const router = useRouter();

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const { provinces, wardsMap, getWards } = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    gender: "male",
    phone: "",
    name: "",
    province: "",
    ward: "",
    agree: false
  });


  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {

    const { name, value, type } = e.target;

    if (type === "checkbox") {

      const checked = (e.target as HTMLInputElement).checked;

      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));

      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Load wards when province changes
    if (name === "province" && value) {

      try {

        await getWards(value);

        setFormData(prev => ({
          ...prev,
          ward: ""
        }));

      } catch (err) {

        console.error("Failed to fetch wards", err);

      }
    }
  };

  // Validation
  const validateForm = () => {

    if (
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.fullName ||
      !formData.phone ||
      !formData.name ||
      !formData.province ||
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

  const clearForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      gender: "male",
      phone: "",
      name: "",
      province: "",
      ward: "",
      agree: false
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {

      const data = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        recruiterInfo: {
          gender: formData.gender,
          phone: formData.phone
        },
        companyInfor: {
          name: formData.name,
          province: formData.province,
          ward: formData.ward
        }
      };

      const res = await recruiterRegister(data);

      if (res.success) {

        clearForm();

        router.push(`/recruiter/login?email=${formData.email}`);

      } else {
        alert(res.message);
        setError(res.message || "Registration failed");

      }

    } catch (err: any) {
      alert("Register failed.")
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

      {/* Email */}
      <label>Email *</label>

      <div className="input-wrapper">
        <i className="fa-solid fa-envelope icon" />

        <input
          name="email"
          type="email"
          placeholder="example@company.com"
          onChange={handleChange}
        />
      </div>

      {/* Password */}
      <label>Password *</label>

      <div className="input-wrapper">

        <i className="fa-solid fa-lock icon" />

        <input
          name="password"
          type={showPassword ? "text" : "password"}
          onChange={handleChange}
        />

        <i
          className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-icon`}
          onClick={() => setShowPassword(!showPassword)}
        />

      </div>

      {/* Confirm Password */}
      <label>Confirm Password *</label>

      <div className="input-wrapper">

        <i className="fa-solid fa-lock icon" />

        <input
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          onChange={handleChange}
        />

        <i
          className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} toggle-icon`}
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        />

      </div>

      <h2>Recruiter Information</h2>

      {/* Full Name */}
      <label>Full Name *</label>

      <div className="input-wrapper">
        <i className="fa-solid fa-user icon" />

        <input
          name="fullName"
          type="text"
          placeholder="Your name"
          onChange={handleChange} required
        />
      </div>

      {/* Gender */}
      <label>Gender *</label>

      <div className="radio-group">

        <label>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={formData.gender === "male"}
            onChange={handleChange} required
          />
          Male
        </label>

        <label>
          <input
            type="radio"
            name="gender"
            value="female"
            checked={formData.gender === "female"}
            onChange={handleChange} required
          />
          Female
        </label>

      </div>

      {/* Phone */}
      <label>Phone Number *</label>

      <div className="input-wrapper">
        <i className="fa-solid fa-phone icon" />

        <input
          name="phone"
          type="text"
          placeholder="Your phone number"
          onChange={handleChange} required
        />
      </div>

      {/* Company */}
      <label>Company *</label>

      <div className="input-wrapper">
        <i className="fa-solid fa-building icon" />

        <input
          name="name"
          type="text"
          placeholder="Company name"
          onChange={handleChange} required
        />
      </div>

      {/* Location */}
      <div className="row">

        <div>

          <label>Work Location *</label>

          <select
            name="province"
            value={formData.province}
            onChange={handleChange} required
          >

            <option value="">Select province</option>

            {provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.nameEn}
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
            disabled={!formData.province} required
          >

            <option value="">Select ward</option>

            {((formData.province && wardsMap[formData.province]) || []).map((ward) => (
              <option key={ward.code} value={ward.code}>
                {ward.nameEn}
              </option>
            ))}

          </select>

        </div>

      </div>

      {/* Agree */}
      <label className="agree">
        <input
          type="checkbox"
          name="agree"
          onChange={handleChange}
          required
        />
        <span>I agree to the Terms of Service and Privacy Policy</span>

      </label>

      <button type="submit" className="submit-btn">
        Complete
      </button>

      <p className="login-link">
        Already have an account?{" "}
        <span onClick={() => router.push("/recruiter/login")}>
          Login now
        </span>
      </p>

    </form>
  );
}