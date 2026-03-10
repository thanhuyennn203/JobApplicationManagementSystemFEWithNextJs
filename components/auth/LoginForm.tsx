"use client";

import { useState, useEffect } from "react";
import "@/styles/Register.css";
import useAuth from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const { login, user } = useAuth();
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // auto fill from register page
  useEffect(() => {
    const emailParam = params.get("email");
    const passwordParam = params.get("password");

    if (emailParam) setEmail(emailParam);
    if (passwordParam) setPassword(passwordParam);
  }, [params]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      alert("Invalid email");
      return;
    }

    try {
      const data = await login(email, password);
      // console.log("user: ", data);
      const roles = data.user?.roles || [];

      if (roles.includes("RECRUITER")) {
        router.push("/recruitment");
      } else {
        router.push("/candidate/jobs");
      }

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2 className="title">Welcome back!</h2>

        <form className="register-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="register-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
