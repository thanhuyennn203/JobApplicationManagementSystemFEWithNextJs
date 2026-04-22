"use client";

import { useRouter } from "next/navigation";

const verifySteps = [
  { title: "Verify phone number", path: "/verify/phone" },
  { title: "Update company info", path: "/verify/company" },
  { title: "Upload business license", path: "/verify/license" },
  { title: "Accept data processing agreement", path: "/verify/data" },
  { title: "Post your first job", path: "/jobs/create" },
];

export function VerifySection({ companyVerified = false }) {
  const router = useRouter();

  return (
    <div className="bg-gray-100 p-4 rounded-2xl">
      <div className="grid grid-cols-5 gap-4">
        {verifySteps.map((step, i) => {
          const isLast = i === verifySteps.length - 1;
          const isLocked = isLast && !companyVerified;

          return (
            <div
              key={i}
              onClick={() => {
                if (!isLocked) router.push(step.path);
              }}
              className={`
                flex items-center justify-between
                px-4 py-3 rounded-2xl border
                transition-all duration-200
                ${isLocked
                  ? "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border-gray-300 hover:border-black cursor-pointer"}
                group
              `}
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 flex-shrink-0 rounded-full border border-gray-400"></div>
                <span className="text-sm leading-tight">
                  {step.title}
                </span>
              </div>

              {/* RIGHT ICON (SVG) */}
              <div
                className={`
                    w-8 aspect-square flex-shrink-0
                    flex items-center justify-center 
                    rounded-full border
                    transition-all duration-200
                    ${isLocked
                    ? "border-gray-300 text-gray-300"
                    : "border-gray-300 text-gray-500 group-hover:border-green-500 group-hover:text-green-500"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}