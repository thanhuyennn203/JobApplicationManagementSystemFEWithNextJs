"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { login, user } = useAuth();

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    password: searchParams.get("password") || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      await login(formData.email, formData.password);

      const roles = user?.roles || [];

      if (roles.includes("RECRUITER")) {
        router.push("/recruiter");
      } else if (roles.includes("ADMIN")) {
        router.push("/admin");
      } else if (roles.includes("CANDIDATE")) {
        router.push("/candidate")
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">
            Welcome Back
          </h1>

          <p className="text-gray-500 mb-8">
            Sign in to continue
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="button"
            className="w-full border border-gray-300 rounded-xl py-3 font-medium hover:bg-gray-50 transition"
          >
            Sign in with Google
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-3 text-sm text-gray-500">
              Or login using email
            </span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium">
                Email
              </label>

              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

                <input
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-green-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">
                Password
              </label>

              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-12 outline-none focus:border-green-500"
                />

                <i
                  className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"
                    } absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500`}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <span
              className="text-green-600 font-medium cursor-pointer hover:underline"
              onClick={() => router.push("/register")}
            >
              Register now
            </span>
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/images/bg-featured-company.jpg"
          alt="Login Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/30"></div>

        <div className="absolute bottom-10 left-10 text-white max-w-md">
          <h2 className="text-4xl font-bold mb-4">
            Find Your Dream Job
          </h2>

          <p className="text-lg text-gray-100">
            Connect with top companies and build your future career.
          </p>
        </div>
      </div>
    </div>
  );
}