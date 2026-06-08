"use client";

import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useLocation } from "@/context/LocationContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/notification/ToastProvider";

export default function RecruitmentRegisterForm() {
  const { recruiterRegister } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const { provinces, wardsMap, getWards } = useLocation();

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    agree: false,
  });

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;

      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "province" && value) {
      try {
        await getWards(value);

        setFormData((prev) => ({
          ...prev,
          ward: "",
        }));
      } catch (err) {
        console.error("Failed to fetch wards", err);
      }
    }
  };

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
      agree: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      toast.warning(validationError);
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
          phone: formData.phone,
        },
        companyInfor: {
          name: formData.name,
          province: formData.province,
          ward: formData.ward,
        },
      };

      const res = await recruiterRegister(data);

      if (res.success) {
        clearForm();

        toast.success("Registration successful. Please log in.");

        router.push(
          `/recruiter/login?email=${encodeURIComponent(formData.email)}`
        );
      } else {
        toast.error(res.message || "Registration failed");
        setError(res.message || "Registration failed");
      }
    } catch (err: any) {
      toast.error("Register failed.");
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* LEFT */}
      <div className="w-full lg:w-3/5 overflow-y-auto flex justify-center">
        <div className="w-full max-w-2xl px-6 py-10">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h1 className="text-3xl font-bold mb-2">
              Create Recruiter Account
            </h1>

            <p className="text-gray-500 mb-8">
              Register to start posting jobs
            </p>

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-red-600">
                {error}
              </div>
            )}

            <button
              type="button"
              className="w-full rounded-xl border border-gray-300 py-3 font-medium hover:bg-gray-50 transition"
            >
              Sign up with Google
            </button>

            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-200" />

              <span className="px-3 text-sm text-gray-500">
                Or sign up using email
              </span>

              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* ACCOUNT */}
            <h2 className="text-xl font-semibold mb-5">Account</h2>

            {/* EMAIL */}
            <div className="mb-5">
              <label className="block mb-2 font-medium">
                Email *
              </label>

              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  name="email"
                  type="email"
                  placeholder="example@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-green-500"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="mb-5">
              <label className="block mb-2 font-medium">
                Password *
              </label>

              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

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
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-8">
              <label className="block mb-2 font-medium">
                Confirm Password *
              </label>

              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  name="confirmPassword"
                  type={
                    showConfirmPassword ? "text" : "password"
                  }
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-12 outline-none focus:border-green-500"
                />

                <i
                  className={`fa-solid ${showConfirmPassword
                      ? "fa-eye-slash"
                      : "fa-eye"
                    } absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500`}
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                />
              </div>
            </div>

            {/* RECRUITER INFO */}
            <h2 className="text-xl font-semibold mb-5">
              Recruiter Information
            </h2>

            {/* FULL NAME */}
            <div className="mb-5">
              <label className="block mb-2 font-medium">
                Full Name *
              </label>

              <div className="relative">
                <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  name="fullName"
                  type="text"
                  placeholder="Your name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-green-500"
                />
              </div>
            </div>

            {/* GENDER */}
            <div className="mb-5">
              <label className="block mb-2 font-medium">
                Gender *
              </label>

              <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                  />
                  Male
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
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
            </div>

            {/* PHONE */}
            <div className="mb-5">
              <label className="block mb-2 font-medium">
                Phone Number *
              </label>

              <div className="relative">
                <i className="fa-solid fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  name="phone"
                  type="text"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-green-500"
                />
              </div>
            </div>

            {/* COMPANY */}
            <div className="mb-5">
              <label className="block mb-2 font-medium">
                Company *
              </label>

              <div className="relative">
                <i className="fa-solid fa-building absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  name="name"
                  type="text"
                  placeholder="Company name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-green-500"
                />
              </div>
            </div>

            {/* LOCATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">
                  Province *
                </label>

                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-green-500"
                >
                  <option value="">Select province</option>

                  {provinces.map((province) => (
                    <option
                      key={province.code}
                      value={province.code}
                    >
                      {province.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Ward *
                </label>

                <select
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  disabled={!formData.province}
                  className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-green-500 disabled:bg-gray-100"
                >
                  <option value="">Select ward</option>

                  {(
                    (formData.province &&
                      wardsMap[formData.province]) ||
                    []
                  ).map((ward) => (
                    <option
                      key={ward.code}
                      value={ward.code}
                    >
                      {ward.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* AGREE */}
            <label className="flex items-start gap-3 mt-6 cursor-pointer">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mt-1"
              />

              <span className="text-sm text-gray-600">
                I agree to the Terms of Service and Privacy
                Policy
              </span>
            </label>

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Complete Registration
            </button>

            <p className="text-center mt-6 text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() =>
                  router.push("/login")
                }
                className="text-green-600 font-medium cursor-pointer hover:underline"
              >
                Login now
              </span>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hidden lg:block lg:w-2/5 h-screen relative">
        <img
          src="/images/recruiter-register-bg.webp"
          alt="Register Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute bottom-12 left-12 text-white max-w-lg">
          <h2 className="text-4xl font-bold mb-4">
            Start Hiring Top Talent
          </h2>

          <p className="text-lg text-gray-100">
            Create your recruiter account and connect with thousands
            of qualified candidates.
          </p>
        </div>
      </div>
    </div>
  );
}