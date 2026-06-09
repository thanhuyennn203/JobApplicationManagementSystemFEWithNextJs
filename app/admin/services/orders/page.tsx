"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Home,
  ChevronRight,
  Download,
  Search,
  ChevronDown,
  Check,
  RotateCcw,
  X,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  AlertCircle, Clock
} from "lucide-react";
import Link from "next/link";
import { adminOrderService } from "@/services/order.service";
import { Order, OrderStatus } from "@/types/order";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; icon: React.ReactNode; classes: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    icon: <RotateCcw size={11} />,
    classes: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
  },
  ACTIVE: {
    label: "Activated",
    icon: <Check size={11} />,
    classes: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    icon: <X size={11} />,
    classes: "bg-red-50 text-red-600 border border-red-200",
    dot: "bg-red-400",
  }, WAITING: {
    label: "Waiting",
    icon: <Clock />,
    classes: "bg-gray-100 text-gray-700",
    dot: "bg-gray-400",
  },
};

const ALL_STATUSES: { value: string; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "WAITING", label: "Waiting" },
  { value: "ACTIVE", label: "Activated" },
  { value: "REJECTED", label: "Rejected" },
];

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.classes}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [statusOpen, setStatusOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const PAGE_SIZE = 10;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminOrderService.getAllOrders(page, PAGE_SIZE);
      setOrders(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Can not load. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filtered = orders.filter((o) => {
    const matchSearch =
      search === "" ||
      o.orderCode.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      selectedStatus === "ALL" || o.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const pageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0, 1, 2);
      if (page > 3) pages.push("...");
      if (page > 2 && page < totalPages - 3) pages.push(page);
      if (page < totalPages - 4) pages.push("...");
      pages.push(totalPages - 3, totalPages - 2, totalPages - 1);
    }
    return [...new Set(pages)];
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 px-6 pt-5 text-sm text-gray-400">
        <Home size={13} />
        <ChevronRight size={12} />
        <Link href="/admin/dashboard" className="hover:text-[#0b77da] transition-colors">
          Dashboard
        </Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Order Management</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-4 pb-1">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {totalElements > 0 ? `${totalElements} orders` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Reload
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
            <Download size={14} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Main card */}
      <div className="mx-6 my-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
        {/* Filters */}
        <div className="flex items-end gap-3 px-5 py-4 border-b border-gray-100">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Search</label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white w-60 focus-within:border-[#0b77da] focus-within:ring-1 focus-within:ring-[#0b77da]/20 transition-all">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Enter order code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm outline-none text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Status dropdown */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-xs font-medium text-gray-500">Status</label>
            <button
              onClick={() => setStatusOpen((p) => !p)}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 min-w-[160px] text-sm text-gray-700 transition-colors"
            >
              {selectedStatus !== "ALL" && (
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${STATUS_CONFIG[selectedStatus as OrderStatus]?.dot}`}
                />
              )}
              <span className="flex-1 text-left">
                {ALL_STATUSES.find((s) => s.value === selectedStatus)?.label}
              </span>
              <ChevronDown size={13} className="text-gray-400" />
            </button>
            {statusOpen && (
              <div className="absolute top-full -mt-2 left-0 z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">                {ALL_STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => {
                    setSelectedStatus(s.value);
                    setStatusOpen(false);
                    setPage(0);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-[#e8f1fb] transition-colors text-left"
                >
                  {s.value !== "ALL" && (
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${STATUS_CONFIG[s.value as OrderStatus]?.dot}`}
                    />
                  )}
                  {s.label}
                  {selectedStatus === s.value && (
                    <Check size={13} className="ml-auto text-[#0b77da]" />
                  )}
                </button>
              ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <AlertCircle size={36} className="text-red-400" />
              <p className="text-sm text-gray-500">{error}</p>
              <button
                onClick={fetchOrders}
                className="text-sm text-[#0b77da] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw size={20} className="animate-spin text-[#0b77da]" />
              <span className="ml-2 text-sm text-gray-400">Loading...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <p className="text-sm text-gray-400">Empty</p>
            </div>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <span className="flex items-center gap-1">
                      Order code <ArrowDown size={11} className="text-gray-400" />
                    </span>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Created at
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Service Packages
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Total amount
                  </th>
                  <th className="py-3 px-5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#f0f7ff] transition-colors group"
                  >
                    <td className="py-3.5 px-5">
                      <span className="font-semibold text-[#0b77da] font-mono text-[13px]">
                        {order.orderCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-[13px]">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 text-[13px]">
                      {order.items.length > 0 ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-gray-800">
                            {order.items[0].packageName}
                          </span>
                          {order.items.length > 1 && (
                            <span className="text-xs text-gray-400">
                              +{order.items.length - 1} other packages
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-gray-900 text-[13px]">
                      ${order.totalAmount}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        href={`/admin/services/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#0b77da] hover:text-[#0960b8] transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Details
                        <ChevronRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50">
            <span className="text-xs text-gray-400">
              Trang {page + 1} / {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft size={13} /> Prev
              </button>
              {pageNumbers().map((n, i) =>
                n === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">
                    ...
                  </span>
                ) : (
                  <button
                    key={n}
                    onClick={() => setPage(n as number)}
                    className={`min-w-[30px] h-8 px-2 rounded-lg text-sm transition-colors ${n === page
                        ? "bg-[#0b77da] text-white font-medium"
                        : "text-gray-500 hover:bg-gray-100"
                      }`}
                  >
                    {(n as number) + 1}
                  </button>
                )
              )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}