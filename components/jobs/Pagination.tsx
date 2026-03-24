"use client";

import "@/styles/Pagination.css";
export default function Pagination({ page, totalPages, setPage }: any) {
  return (
    <div className="pagination">

      {/* Prev */}
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        ‹
      </button>

      {/* Page info */}
      <span>
        {page} / {totalPages} page
      </span>

      {/* Next */}
      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        ›
      </button>

    </div>
  );
}