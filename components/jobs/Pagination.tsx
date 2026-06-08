"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function Pagination({
  page,
  totalPages,
  setPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-5 mt-[30px]">
      <button
        disabled={page === 1}
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        className="w-9 h-9 rounded-full border border-[#00b14f] bg-white text-[#00b14f] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ‹
      </button>

      <span>
        {page} / {totalPages} page
      </span>

      <button
        disabled={page === totalPages}
        onClick={() =>
          setPage((prev) => Math.min(prev + 1, totalPages))
        }
        className="w-9 h-9 rounded-full border border-[#00b14f] bg-white text-[#00b14f] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ›
      </button>
    </div>
  );
}