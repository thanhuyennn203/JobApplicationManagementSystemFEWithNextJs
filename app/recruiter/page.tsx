"use client";

import AlertCarousel from "@/components/recruiter/AlertCarousel";
import { FeatureSection } from "@/components/recruiter/FeatureSection";
import { VerifySection } from "@/components/recruiter/VerifySection";
import { CheckCircle, Circle, Bell, Search, Plus } from "lucide-react";

export default function Dashboard() {
  const notifications = [
    {
      id: 1,
      message: "Your company profile has been updated successfully.",
      time: "2 minutes ago",
      status: "new",
      icon: "fa-circle-info",
      color: "text-green-500"
    },
    {
      id: 2,
      message: "You received 5 new CV applications.",
      time: "1 hour ago",
      status: "read",
      icon: "fa-briefcase",
      color: "text-blue-500"
    }
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">

      {/* ALERT */}
      <div className="bg-white p-4 rounded-xl border flex gap-3">
        <Bell className="text-blue-500" />
        <div>
          <h3 className="font-semibold">Important Notice</h3>
          <p className="text-sm text-gray-600">
            Password must be updated every 6 months starting Jan 2026.
          </p>
        </div>
      </div>

      {/* BANNER */}
      <AlertCarousel />

      {/* VERIFY SECTION */}
      <VerifySection />

      {/* FEATURES */}
      <FeatureSection />

      {/* AI CV */}
      <div className="bg-white p-6 rounded-xl">

        <div className="flex items-center gap-2 mb-4">
          <i className="fa-solid fa-stars text-green-600"></i>
          <h3 className="font-semibold text-lg">Recommended CVs</h3>
        </div>

        <div className="grid grid-cols-2 gap-6 items-center">

          {/* LEFT SIDE (IMAGE / ILLUSTRATION) */}
          <div className="bg-green-50 rounded-xl p-6 flex items-center justify-center relative">

            {/* Main Robot Image */}
            <img
              src="/images/ai-robot.png"
              alt="AI"
              className="object-contain"
            />

            {/* Floating avatars (optional decoration) */}
            <div className="absolute left-4 top-6 w-10 h-10 bg-white rounded-full shadow"></div>
            <div className="absolute left-10 bottom-6 w-8 h-8 bg-white rounded-full shadow"></div>
            <div className="absolute left-20 top-14 w-6 h-6 bg-white rounded-full shadow"></div>

          </div>

          {/* RIGHT SIDE */}
          <div>

            <h4 className="font-semibold text-gray-800 mb-3">
              Activate CV recommendations powered by{" "}
              <span className="text-green-600">Toppy AI</span> to:
            </h4>

            <ul className="space-y-3 text-sm text-gray-600 mb-4">

              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text-green-500"></i>
                Suggest potential candidates
              </li>

              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text-green-500"></i>
                Pre-filter key candidate highlights
              </li>

              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text-green-500"></i>
                Automatically rank by relevance score
              </li>

            </ul>

            <p className="text-sm text-gray-700 mb-4">
              Purchase{" "}
              <span className="text-green-600 font-medium">
                Top Jobs
              </span>{" "}
              to unlock CV recommendation features.
            </p>

            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition">
              Buy Now
            </button>

          </div>

        </div>
      </div>

      {/* LOYALTY */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl">
          <h3 className="font-semibold">Loyalty Rank</h3>
          <p className="text-gray-500 mt-2">Member - 0 Points</p>
        </div>

        <div className="bg-white p-6 rounded-xl">
          <h3 className="font-semibold">Top Points</h3>
          <p className="text-gray-500 mt-2">0 Points</p>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="bg-white p-5 rounded-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-bell text-green-600"></i>
            <h3 className="font-semibold text-lg">Notifications</h3>
          </div>
        </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {notifications.map((n) => (
              <div key={n.id} className={`flex gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer ${n.status === "new" ? "border-l-4 border-green-500" : ""
                } border`}>

                <i className={`fa-solid ${n.icon} ${n.color}`}></i>

                <div className="flex-1">
                  <p className="text-sm font-medium">{n.message}</p>

                  <div className="text-xs text-gray-500 flex gap-2 mt-1">
                    <span>{n.time}</span>
                    <span className={`px-2 py-0.5 rounded-full ${n.status === "new"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-500"
                      }`}>
                      {n.status === "new" ? "New" : "Read"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
  );
}

function Card({ title, icon }: any) {
  return (
    <div className="bg-white p-5 rounded-xl flex items-center justify-between">
      <span className="font-medium">{title}</span>
      <div className="text-green-600">{icon}</div>
    </div>
  );
}