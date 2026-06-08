"use client";

import { useEffect, useState } from "react";
import Header from "@/components/LandingHeader";
import HeroBanner from "@/components/HeroBanner";
import TopJobsSection from "@/components/TopJobsSection";
import RewardsSection from "@/components/RewardsSection";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <Header />
      <HeroBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <TopJobsSection />
        <RewardsSection />
      </div>
    </main>
  );
}