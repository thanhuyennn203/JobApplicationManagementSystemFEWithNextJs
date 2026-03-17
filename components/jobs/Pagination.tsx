"use client";

export default function Pagination({ page, totalPages, setPage }: any) {

  return (
    <div className="pagination">

      <button
        disabled={page === 0}
        onClick={() => setPage(page - 1)}
      >
        ‹
      </button>

      <span>
        {page + 1} / {totalPages} trang
      </span>

      <button
        disabled={page === totalPages - 1}
        onClick={() => setPage(page + 1)}
      >
        ›
      </button>

    </div>
  );
}