"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Tag,
  Megaphone,
  Headset,
  Briefcase,
  Laptop,
  Landmark,
  Building2,
  Calculator,
  Settings,
  GraduationCap,
  Stethoscope,
  Palette,
  Loader2,
} from "lucide-react";
import { fetchTopJobCategories } from "@/services/jobs/categoryService";

// Map tên icon (string từ API) -> component lucide-react
const ICON_MAP = {
  Tag,
  Megaphone,
  Headset,
  Briefcase,
  Laptop,
  Landmark,
  Building2,
  Calculator,
  Settings,
  GraduationCap,
  Stethoscope,
  Palette,
};

const ITEMS_PER_PAGE = 8; // 4 cột x 2 dòng

export default function TopJobCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const res = await fetchTopJobCategories();
        if (isMounted) {
          setCategories(res.data || []);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const start = page * ITEMS_PER_PAGE;
  const currentItems = categories.slice(start, start + ITEMS_PER_PAGE);

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <section className="top-company-page-wrapper">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-600">
          Top prominent professions
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={page === 0}
            aria-label="Previous page"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-green-500 hover:text-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            disabled={page >= totalPages - 1}
            aria-label="Next page"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-green-500 text-green-600 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-green-500" size={32} />
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="text-center py-10 text-red-500">
          Error occuring...: {error}
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentItems.map((item) => {
              const IconComponent = ICON_MAP[item.icon] || Briefcase;
              return (
                <div
                  key={item.id}
                  className="bg-gray-100 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center mb-4">
                    <IconComponent className="text-white" size={26} />
                  </div>
                  <h3
                    className="font-semibold text-gray-800 mb-1 truncate w-full"
                    title={item.name}
                  >
                    {item.name}
                  </h3>
                  <p className="text-green-600 font-medium">
                    {item.jobCount.toLocaleString("en-US")} jobs
                  </p>
                </div>
              );
            })}
          </div>

          {/* Pagination dots (optional) */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx)}
                  aria-label={`Go to page ${idx + 1}`}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    idx === page ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}