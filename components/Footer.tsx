"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#f5f7fa] text-sm text-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* COLUMN 1 */}
        <div>
          <img
            src="https://static.topcv.vn/v4/image/logo/topcv-logo-footer-6.png"
            alt="TopCV"
            width={140}
            height={40}
          />

          <div className="flex items-center gap-3 mt-4">
            <img
              src="https://static.topcv.vn/v4/image/footer/google_for_startup.png"
              alt="Google for Startups"
              width={120}
              height={40}
            />
            <img
              src="https://images.dmca.com/Badges/DMCA_badge_grn_60w.png"
              alt="DMCA Protection"
              width={60}
              height={30}
            />
          </div>

          <div className="mt-4">
            <p className="font-semibold">Contact</p>
            <p>Hotline: (024) 6680 5588</p>
            <p>Email: support@topcv.vn</p>
          </div>

          <div className="mt-4">
            <p className="font-semibold">Download App</p>
            <div className="flex gap-2 mt-2">
              <img
                src="https://static.topcv.vn/v4/image/welcome/download/app_store.png"
                alt="App Store"
                width={120}
                height={40}
              />
              <img
                src="https://static.topcv.vn/v4/image/welcome/download/chplay.png"
                alt="Google Play"
                width={120}
                height={40}
              />
            </div>
          </div>
        </div>

        {/* COLUMN 2 */}
        <div>
          <h3 className="font-semibold mb-3">About TopCV</h3>
          <ul className="space-y-2">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>

          <h3 className="font-semibold mt-6 mb-3">Partners</h3>
          <ul className="space-y-2">
            <li><a href="#">TestCenter</a></li>
            <li><a href="#">TopHR</a></li>
            <li><a href="#">ViecNgay</a></li>
            <li><a href="#">HappyTime</a></li>
          </ul>
        </div>

        {/* COLUMN 3 */}
        <div>
          <h3 className="font-semibold mb-3">CV & Profiles</h3>
          <ul className="space-y-2">
            <li><a href="#">Manage Your CV</a></li>
            <li><a href="#">CV Writing Guide</a></li>
            <li><a href="#">CV Templates</a></li>
            <li><a href="#">CV Review</a></li>
          </ul>

          <h3 className="font-semibold mt-6 mb-3">Explore</h3>
          <ul className="space-y-2">
            <li><a href="#">Mobile App</a></li>
            <li><a href="#">Salary Calculator</a></li>
            <li><a href="#">Compound Interest Calculator</a></li>
            <li><a href="#">Savings Planner</a></li>
            <li><a href="#">Unemployment Insurance Calculator</a></li>
            <li><a href="#">Social Insurance Calculator</a></li>
            <li><a href="#">MBTI Test</a></li>
            <li><a href="#">MI Test</a></li>
          </ul>
        </div>

        {/* COLUMN 4 */}
        <div>
          <h3 className="font-semibold mb-3">Career Development</h3>
          <ul className="space-y-2">
            <li><a href="#">Best Jobs</a></li>
            <li><a href="#">High Salary Jobs</a></li>
            <li><a href="#">Management Jobs</a></li>
            <li><a href="#">IT Jobs</a></li>
            <li><a href="#">Senior Jobs</a></li>
            <li><a href="#">Part-time Jobs</a></li>
          </ul>

          <h3 className="font-semibold mt-6 mb-3">Policies</h3>
          <ul className="space-y-2">
            <li><a href="#">General Terms</a></li>
            <li><a href="#">Pricing & Payment</a></li>
            <li><a href="#">Shipping Information</a></li>
          </ul>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t py-6 text-center text-xs text-gray-500">
        © 2014-2026 TopCV Vietnam JSC. All rights reserved.
      </div>
    </footer>
  );
}