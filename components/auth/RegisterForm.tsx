"use client";

import { useState } from "react";
import "@/styles/candidate/Register.css";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/notification/ToastProvider";

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  };

  const clearForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAgree(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      toast.warning("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      toast.warning("Invalid email");
      return;
    }

    if (!validatePassword(password)) {
      toast.warning("Password must be at least 6 characters and contain letters and numbers");
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    if (!agree) {
      toast.warning("You must agree to the terms");
      return;
    }

    try {
      const data = await register({ fullName, email, password });

      // console.log("success: ", fullName);
      if (!data.success) {
        toast.error(data.message || "Register failed");
        console.log("Register failed: ", data.message );
      } else {
        clearForm();
        toast.success("Registration successful. Please log in.");

        router.push(`/candidate/login?email=${email}`);

      }

    } catch (err) {
      toast.error("Register failed");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2 className="title">Welcome to Job Application Management</h2>

        <form className="register-form" onSubmit={handleSubmit}>

          {/* Full name */}
          <div className="form-group">
            <label>Full name</label>
            <div className="input-wrapper">
              <i className="fa-solid fa-user icon" />
              <input
                type="text"
                placeholder="Nhập họ tên"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <i className="fa-solid fa-envelope icon" />
              <input
                type="email"
                placeholder="Nhập email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <i className="fa-solid fa-shield-halved icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i
                className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"
                  } toggle`}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          {/* Confirm password */}
          <div className="form-group">
            <label>Confirm password</label>
            <div className="input-wrapper">
              <i className="fa-solid fa-shield-halved icon" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <i
                className={`fa-solid ${showConfirm ? "fa-eye" : "fa-eye-slash"
                  } toggle`}
                onClick={() => setShowConfirm(!showConfirm)}
              />
            </div>
          </div>

          {/* Checkbox */}
          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={agree}
              required
              onChange={(e) => setAgree(e.target.checked)}
            />
            <label>
              I agree to the <span>Terms and Conditions</span>
            </label>
          </div>

          <button type="submit" className="register-btn">
            Register
          </button>

        </form>
        <p className="login-link">
          You had an account?{" "}
          <span onClick={() => router.push("/login")}>
            Login now
          </span>
        </p>
      </div>
    </div>
  );
}
