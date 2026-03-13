"use client";

import { useState } from "react";
import "@/styles/candidate/Register.css";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();

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
      alert("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      alert("Invalid email");
      return;
    }

    if (!validatePassword(password)) {
      alert("Password must be at least 6 characters and contain letters and numbers");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!agree) {
      alert("You must agree to the terms");
      return;
    }

    try {
      const data = await register({ fullName, email, password });

      // console.log("success: ", fullName);
      if (!data.success) {
        console.log("Register failed: ", data.message );
      } else {
        clearForm();

        router.push(`/login?email=${email}&password=${password}`);

      }

    } catch (err) {
      alert("Register failed");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2 className="title">Chào mừng bạn đến với TopCV</h2>

        <form className="register-form" onSubmit={handleSubmit}>

          {/* Full name */}
          <div className="form-group">
            <label>Họ và tên</label>
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
            <label>Mật khẩu</label>
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
            <label>Xác nhận mật khẩu</label>
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
              Tôi đã đọc và đồng ý với <span>Điều khoản</span>
            </label>
          </div>

          <button type="submit" className="register-btn">
            Đăng ký
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