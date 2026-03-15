"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/services/auth/auth.service";
import "@/styles/recruiter/Login.css";

export default function LoginForm() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    password: searchParams.get("password") || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {

    if (!formData.email || !formData.password) {
      return "Email and Password are required";
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

      const res = await login(formData.email, formData.password);

      // console.log(res);
      if (res.sucess) {
        alert("Login successfully!")
        router.push("/recruiter");
      }else{
        alert(res.message);
      }


    } catch (err: any) {

      setError(err?.response?.data?.message || "Login failed");

    }
  };

  return (

    <form className="login-card" onSubmit={handleSubmit}>

      <h2>Login</h2>

      {error && <p className="error">{error}</p>}

      <button type="button" className="google-btn">
        Sign in with Google
      </button>

      <p className="divider">Or login using email</p>

      {/* Email */}
      <label>Email</label>

      <div className="input-wrapper">

        <i className="fa-solid fa-envelope icon"></i>

        <input
          name="email"
          type="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
        />

      </div>

      {/* Password */}
      <label>Password</label>

      <div className="input-wrapper">

        <i className="fa-solid fa-lock icon"></i>

        <input
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
        />

        <i
          className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-icon`}
          onClick={() => setShowPassword(!showPassword)}
        ></i>

      </div>

      <button type="submit" className="submit-btn">
        Login
      </button>

      <p className="login-link">
        Don't have an account?{" "}
        <span onClick={() => router.push("/recruiter/register")}>
          Register now
        </span>
      </p>

    </form>
  );
}