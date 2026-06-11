"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Home,
    ChevronRight,
    ArrowLeft,
    Check,
    X,
    RotateCcw,
    Building2,
    CreditCard,
    ShoppingCart,
    Clock,
    AlertCircle,
    RefreshCw,
    Banknote,
    Star,
    Package,
    CalendarCheck,
    FileText, CheckCircle,
    User
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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


function StatusBadge({ status }: { status: OrderStatus }) {
    const cfg = STATUS_CONFIG[status];
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.classes}`}
        >
            {cfg.icon}
            {cfg.label}
        </span>
    );
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}

function formatDateTime(dateStr: string) {
    return new Date(dateStr).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function InfoRow({
    label,
    value,
    mono,
}: {
    label: string;
    value?: string | null;
    mono?: boolean;
}) {
    if (!value) return null;
    return (
        <div className="flex items-start justify-between gap-4 py-2.5 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-400 shrink-0 w-44">{label}</span>
            <span
                className={`text-sm text-gray-800 text-right ${mono ? "font-mono font-medium" : ""}`}
            >
                {value}
            </span>
        </div>
    );
}

function ConfirmDialog({
    action,
    onConfirm,
    onCancel,
    loading,
}: {
    action: "activate" | "reject";
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
}) {
    const isActivate = action === "activate";
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 border border-gray-100">
                <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center mb-4 ${isActivate ? "bg-emerald-50" : "bg-red-50"
                        }`}
                >
                    {isActivate ? (
                        <Check size={20} className="text-emerald-600" />
                    ) : (
                        <X size={20} className="text-red-500" />
                    )}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {isActivate ? "Confirm activate the order" : "Confirm reject the order"}
                </h3>
                <p className="text-sm text-gray-500 mb-5">
                    {isActivate
                        ? "Hành động này sẽ kích hoạt gói dịch vụ cho khách hàng. Bạn có chắc chắn không?"
                        : "Đơn hàng sẽ bị từ chối và không thể hoàn tác. Bạn có chắc chắn không?"}
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5 ${isActivate
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-red-500 hover:bg-red-600"
                            }`}
                    >
                        {loading && <RefreshCw size={13} className="animate-spin" />}
                        {isActivate ? "Activate" : "Reject"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params?.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [confirmAction, setConfirmAction] = useState<"activate" | "reject" | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchOrder = useCallback(async () => {
        if (!orderId) return;
        setLoading(true);
        setError(null);
        try {
            // NOTE: Nếu BE có endpoint GET /orders/:id thì dùng trực tiếp.
            // Hiện tại fallback: lấy tất cả rồi tìm theo id.
            const data = await adminOrderService.getAllOrders(0, 100);
            const found = data.content.find((o) => String(o.id) === String(orderId));
            if (!found) throw new Error("Không tìm thấy đơn hàng");
            setOrder(found);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Không thể tải đơn hàng");
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const handleConfirm = async () => {
        if (!confirmAction || !order) return;
        setActionLoading(true);
        try {
            const updated =
                confirmAction === "activate"
                    ? await adminOrderService.activateOrder(Number(order.id))
                    : await adminOrderService.rejectOrder(Number(order.id));
            setOrder(updated);
            showToast(
                "success",
                confirmAction === "activate"
                    ? "Đơn hàng đã được kích hoạt thành công"
                    : "Đã từ chối đơn hàng"
            );
        } catch (err: unknown) {
            showToast("error", err instanceof Error ? err.message : "Có lỗi xảy ra");
        } finally {
            setActionLoading(false);
            setConfirmAction(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <RefreshCw size={22} className="animate-spin text-[#0b77da]" />
                <span className="ml-2 text-sm text-gray-400">Loading...</span>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-3">
                <AlertCircle size={36} className="text-red-400" />
                <p className="text-sm text-gray-500">{error || "Không tìm thấy đơn hàng"}</p>
                <button
                    onClick={() => router.back()}
                    className="text-sm text-[#0b77da] hover:underline flex items-center gap-1"
                >
                    <ArrowLeft size={13} /> Back
                </button>
            </div>
        );
    }

    const isPending = order.status === "WAITING";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast */}
            {toast && (
                <div
                    className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${toast.type === "success"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                        }`}
                >
                    {toast.type === "success" ? <Check size={15} /> : <AlertCircle size={15} />}
                    {toast.msg}
                </div>
            )}

            {/* Confirm dialog */}
            {confirmAction && (
                <ConfirmDialog
                    action={confirmAction}
                    onConfirm={handleConfirm}
                    onCancel={() => setConfirmAction(null)}
                    loading={actionLoading}
                />
            )}

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 px-6 pt-5 text-sm text-gray-400">
                <Home size={13} />
                <ChevronRight size={12} />
                <Link href="/admin/dashboard" className="hover:text-[#0b77da] transition-colors">
                    Dashboard
                </Link>
                <ChevronRight size={12} />
                <Link href="/admin/services/orders" className="hover:text-[#0b77da] transition-colors">
                    Order
                </Link>
                <ChevronRight size={12} />
                <span className="text-gray-700 font-medium font-mono">{order.orderCode}</span>
            </div>

            {/* Page header */}
            <div className="flex items-center justify-between px-6 pt-4 pb-5">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-xl font-semibold text-gray-900 font-mono">
                                {order.orderCode}
                            </h1>
                            <StatusBadge status={order.status} />
                        </div>
                        <p className="text-sm text-gray-400 mt-0.5">
                            Create at {formatDateTime(order.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Action buttons — chỉ hiện khi PENDING */}
                {isPending && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setConfirmAction("reject")}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <X size={14} />
                            Reject
                        </button>
                        <button
                            onClick={() => setConfirmAction("activate")}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#0b77da] rounded-lg hover:bg-[#0960b8] transition-colors shadow-sm"
                        >
                            <Check size={14} />
                            Activate
                        </button>
                    </div>
                )}
            </div>

            {/* Content grid */}
            <div className="px-6 pb-8 grid grid-cols-3 gap-4">
                {/* Left column: order items + note */}
                <div className="col-span-2 flex flex-col gap-4">
                    {/* Order items */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                            <ShoppingCart size={15} className="text-[#0b77da]" />
                            <h2 className="text-sm font-semibold text-gray-800">Ordered Packages</h2>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="py-2.5 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Packages
                                    </th>
                                    <th className="py-2.5 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Quantity
                                    </th>
                                    <th className="py-2.5 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Price
                                    </th>
                                    <th className="py-2.5 px-5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {order.items.map((item) => (
                                    <tr key={item.packageId} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-2.5">
                                                <div
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.vip ? "bg-amber-50" : "bg-blue-50"
                                                        }`}
                                                >
                                                    {item.vip ? (
                                                        <Star size={14} className="text-amber-500" />
                                                    ) : (
                                                        <Package size={14} className="text-[#0b77da]" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{item.packageName}</div>
                                                    <div className="text-xs text-gray-400 font-mono">{item.packageCode}</div>
                                                </div>
                                                {item.vip && (
                                                    <span className="ml-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                                                        VIP
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-center text-gray-600">{item.quantity}</td>
                                        <td className="py-3.5 px-4 text-right text-gray-600">
                                            $ {item.price}
                                        </td>
                                        <td className="py-3.5 px-5 text-right font-semibold text-gray-900">
                                            ${item.price * item.quantity}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-gray-100 bg-gray-50/50">
                                    <td colSpan={3} className="py-3 px-5 text-sm font-semibold text-gray-700 text-right">
                                        Total
                                    </td>
                                    <td className="py-3 px-5 text-right text-base font-bold text-[#0b77da]">
                                        ${order.totalAmount}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    {/* Customer Info */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                            <User size={15} className="text-[#0b77da]" />
                            <h2 className="text-sm font-semibold text-gray-800">Customer Information</h2>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="py-2.5 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Company
                                    </th>
                                    <th className="py-2.5 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Name
                                    </th>
                                    <th className="py-2.5 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Email
                                    </th>
                                    <th className="py-2.5 px-5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Phone
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                
                                    <tr key={order.companyId} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-2.5">
                                                <div>
                                                    <div className="font-medium text-gray-900">{order.companyName}</div>
                                                    <div className="text-xs text-gray-400 font-mono">ID: {order.companyId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-center text-gray-600">{order.memberName}</td>
                                        <td className="py-3.5 px-4 text-right text-gray-600">
                                            {order.email}
                                        </td>
                                        <td className="py-3.5 px-5 text-right font-semibold text-gray-900">
                                           {order.phone}
                                        </td>
                                    </tr>
                               
                            </tbody>
                            
                        </table>
                    </div>

                    {/* Note */}
                    {order.note && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                                <FileText size={15} className="text-[#0b77da]" />
                                <h2 className="text-sm font-semibold text-gray-800">Note</h2>
                            </div>
                            <p className="px-5 py-4 text-sm text-gray-600 leading-relaxed">{order.note}</p>
                        </div>
                    )}
                </div>

                {/* Right column: status timeline + bank info */}
                <div className="col-span-1 flex flex-col gap-4">
                    {/* Status timeline */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                            <Clock size={15} className="text-[#0b77da]" />

                            <h2 className="text-sm font-semibold text-gray-800">
                                Order Progress
                            </h2>
                        </div>


                        <div className="px-5 py-4">
                            <div className="flex flex-col gap-0">


                                {/* Pending */}
                                <TimelineStep
                                    icon={<Clock size={13} />}
                                    label="Order pending"
                                    date={formatDateTime(order.createdAt)}
                                    done={[
                                        "PENDING",
                                        "WAITING",
                                        "ACTIVE",
                                        "REJECTED"
                                    ].includes(order.status)}
                                />


                                {/* Waiting */}
                                <TimelineStep
                                    icon={<ShoppingCart size={13} />}
                                    label="Waiting for confirmation"
                                    date={
                                        order.createdAt
                                            ? formatDateTime(order.createdAt)
                                            : undefined
                                    }
                                    done={[
                                        "WAITING",
                                        "ACTIVE"
                                    ].includes(order.status)}
                                />


                                {/* Active / Rejected */}
                                {order.status === "REJECTED" ? (

                                    <TimelineStep
                                        icon={<X size={13} />}
                                        label="Order rejected"
                                        date={
                                            order.createdAt
                                                ? formatDateTime(order.createdAt)
                                                : undefined
                                        }
                                        done
                                        error
                                        last
                                    />

                                ) : (

                                    <TimelineStep
                                        icon={<CheckCircle size={13} />}
                                        label="Service activated"
                                        date={
                                            order.createdAt
                                                ? formatDateTime(order.createdAt)
                                                : undefined
                                        }
                                        done={order.status === "ACTIVE"}
                                        last
                                    />

                                )}

                            </div>
                        </div>

                    </div>

                    {/* Bank info */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                            <CreditCard size={15} className="text-[#0b77da]" />
                            <h2 className="text-sm font-semibold text-gray-800">Tranfer Infomation</h2>
                        </div>
                        <div className="px-5 py-3 pb-4">
                            <InfoRow label="Bank" value={order.bankInfo.bankName} />
                            <InfoRow label="Account Number" value={order.bankInfo.accountNumber} mono />
                            <InfoRow label="Account Holder" value={order.bankInfo.accountHolder} />
                            <InfoRow label="Branch" value={order.bankInfo.branch} />
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-xs text-gray-400 mb-1">Transfer content</p>
                                <p className="text-sm font-mono font-semibold text-[#0b77da]">
                                    {order.bankInfo.transferContent}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick info */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                            <Building2 size={15} className="text-[#0b77da]" />
                            <h2 className="text-sm font-semibold text-gray-800">Order Information</h2>
                        </div>
                        <div className="px-5 py-3 pb-4">
                            <InfoRow label="Order code" value={order.orderCode} mono />
                            <InfoRow label="Total amount" value={formatCurrency(order.totalAmount)} />
                            <InfoRow label="Status" value={STATUS_CONFIG[order.status]?.label} />
                            <InfoRow label="Created at" value={formatDateTime(order.createdAt)} />
                            {order.paidAt && (
                                <InfoRow label="Paied at" value={formatDateTime(order.paidAt)} />
                            )}
                            {order.confirmedAt && (
                                <InfoRow label="Confirmed at" value={formatDateTime(order.confirmedAt)} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

// Timeline step component
function TimelineStep({
    icon,
    label,
    date,
    done,
    error,
    last,
}: {
    icon: React.ReactNode;
    label: string;
    date?: string;
    done?: boolean;
    error?: boolean;
    last?: boolean;
}) {
    return (
        <div className="flex gap-3">
            <div className="flex flex-col items-center">
                <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${done
                        ? error
                            ? "bg-red-100 text-red-500"
                            : "bg-[#0b77da] text-white"
                        : "bg-gray-100 text-gray-400"
                        }`}
                >
                    {icon}
                </div>
                {!last && (
                    <div className={`w-px flex-1 my-1 ${done ? "bg-[#0b77da]/30" : "bg-gray-100"}`} style={{ minHeight: 20 }} />
                )}
            </div>
            <div className="pb-4">
                <p className={`text-sm font-medium ${done ? "text-gray-800" : "text-gray-400"}`}>
                    {label}
                </p>
                {date && <p className="text-xs text-gray-400 mt-0.5">{date}</p>}
                {!done && !date && <p className="text-xs text-gray-300 mt-0.5">Chưa thực hiện</p>}
            </div>
        </div>
    );
}