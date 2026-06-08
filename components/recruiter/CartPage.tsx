"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft, ShoppingCart, Trash2, CheckCircle2,
    PackageOpen, Copy, Clock, CircleCheck,
    AlertCircle, Loader2, ChevronDown, ChevronUp,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { orderService } from "@/services/order.service";
import { Order, OrderStatus, OrderItem } from "@/types/order";
import { useToast } from "../notification/ToastProvider";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    PENDING: { label: "Awaiting payment", color: "#b45309", bg: "#fef3c7", icon: <Clock size={13} /> },
    WAITING: { label: "Confirming payment", color: "#1d4ed8", bg: "#dbeafe", icon: <Clock size={13} /> },
    // WAITING: { label: "Confirming payment", color: "#1d4ed8", bg: "#dbeafe", icon: <Loader2 size={13} className="animate-spin" /> },
    CONFIRMED: { label: "Confirmed", color: "#15803d", bg: "#dcfce7", icon: <CircleCheck size={13} /> },
    ACTIVE: { label: "Active", color: "#15803d", bg: "#dcfce7", icon: <CircleCheck size={13} /> },
    REJECTED: { label: "Rejected", color: "#b91c1c", bg: "#fee2e2", icon: <AlertCircle size={13} /> },
};

function StatusBadge({ status }: { status: OrderStatus }) {
    const m = STATUS_META[status];
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
            style={{ color: m.color, background: m.bg }}>
            {m.icon} {m.label}
        </span>
    );
}

// ─── Bank Transfer Modal ──────────────────────────────────────────────────────

function BankTransferModal({
    order,
    onPaid,
    onClose,
}: {
    order: Order;
    onPaid: (o: Order) => void;
    onClose: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const copy = (key: string, val: string) => {
        navigator.clipboard.writeText(val).catch(() => { });
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const handlePaid = async () => {
        setLoading(true);
        const updated = await orderService.confirmPayment(order.id);
        setLoading(false);
        onPaid(updated);
    };

    const fields = [
        { key: "bank", label: "Bank", value: order.bankInfo.bankName },
        { key: "acc", label: "Account number", value: order.bankInfo.accountNumber },
        { key: "holder", label: "Account holder", value: order.bankInfo.accountHolder },
        { key: "branch", label: "Branch", value: order.bankInfo.branch },
        {
            key: "amount",
            label: "Amount",
            value: `$${order.totalAmount.toLocaleString()}`,
        },
        {
            key: "content",
            label: "Transfer content",
            value: order.bankInfo.transferContent,
        },
    ];

    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <p className="text-base font-medium text-gray-900">
                        Bank transfer
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                        Order {order.orderCode}
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="px-2 py-1 text-2xl leading-none text-gray-400 transition hover:text-gray-600"
                >
                    ×
                </button>
            </div>

            {/* Bank Info */}
            <div className="mb-4 flex flex-col gap-2">
                {fields.map((f) => (
                    <div
                        key={f.key}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5"
                    >
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] text-gray-400">
                                {f.label}
                            </p>

                            <p
                                className={`mt-0.5 text-sm font-medium break-all ${f.key === "amount"
                                    ? "text-green-600"
                                    : "text-gray-900"
                                    }`}
                            >
                                {f.value}
                            </p>
                        </div>

                        <button
                            onClick={() => copy(f.key, f.value)}
                            className={`ml-3 flex-shrink-0 p-1 transition ${copied === f.key
                                ? "text-green-600"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            {copied === f.key ? (
                                <CheckCircle2 size={14} />
                            ) : (
                                <Copy size={14} />
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* Warning */}
            <div className="mb-4 rounded-lg bg-amber-100 px-3 py-2.5 text-xs leading-relaxed text-amber-700">
                ⚠ Please enter the exact transfer content so your payment can
                be confirmed quickly.
            </div>

            {/* Confirm Button */}
            <button
                onClick={handlePaid}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {loading && <Loader2 size={15} className="animate-spin" />}

                {loading ? "Processing..." : "I have transferred"}
            </button>

            {/* Cancel Button */}
            <button
                onClick={onClose}
                className="mt-2 w-full rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
                Cancel
            </button>
        </div>
    );
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({
    order,
    onPayNow,
}: {
    order: Order;
    onPayNow: (o: Order) => void;
}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                            {order.orderCode}
                        </p>

                        <StatusBadge status={order.status} />
                    </div>

                    <p className="text-[11px] text-gray-400">
                        {new Date(order.createdAt).toLocaleString("en-GB")} ·{" "}
                        {order.items.length} package
                        {order.items.length > 1 ? "s" : ""}
                    </p>
                </div>

                <div className="flex flex-shrink-0 items-center gap-2.5">
                    <p className="text-[15px] font-medium text-green-600">
                        ${order.totalAmount.toLocaleString()}
                    </p>

                    <button
                        onClick={() => setExpanded((v) => !v)}
                        className="flex p-0.5 text-gray-400 hover:text-gray-600"
                    >
                        {expanded ? (
                            <ChevronUp size={16} />
                        ) : (
                            <ChevronDown size={16} />
                        )}
                    </button>
                </div>
            </div>

            {expanded && (
                <div className="flex flex-col gap-2 border-t border-gray-200 px-4 py-3">
                    {order.items.map((item) => (
                        <div
                            key={item.packageId}
                            className="flex justify-between text-sm"
                        >
                            <span className="text-gray-600">
                                {item.packageName}

                                {item.vip && (
                                    <span className="ml-1.5 inline-block rounded-full bg-amber-300 px-1.5 py-0.5 align-middle text-[9px] font-bold text-amber-900">
                                        VIP
                                    </span>
                                )}

                                {item.quantity > 1 && (
                                    <span className="ml-1 text-gray-400">
                                        × {item.quantity}
                                    </span>
                                )}
                            </span>

                            <span className="font-medium text-gray-900">
                                $
                                {(
                                    item.price * item.quantity
                                ).toLocaleString()}
                            </span>
                        </div>
                    ))}

                    {order.status === "PENDING" && (
                        <button
                            onClick={() => onPayNow(order)}
                            className="mt-2 w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
                        >
                            Pay now
                        </button>
                    )}

                    {order.status === "WAITING" && (
                        <p className="mt-2 rounded-lg bg-blue-100 px-3 py-2 text-xs text-blue-700">
                            Payment received — waiting for admin to confirm.
                        </p>
                    )}

                    {(order.status === "CONFIRMED" ||
                        order.status === "ACTIVE") && (
                            <p className="mt-2 rounded-lg bg-green-100 px-3 py-2 text-xs text-green-700">
                                ✓ Payment confirmed. Your package is now active.
                            </p>
                        )}
                </div>
            )}
        </div>
    );
}

// ─── Main CartPage ────────────────────────────────────────────────────────────

export default function CartPage() {
    const router = useRouter();
    const { cartItems, removeItem, updateQty, clearCart } = useCart();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [creatingOrder, setCreatingOrder] = useState(false);
    const [activeOrder, setActiveOrder] = useState<Order | null>(null);
    const toast = useToast();
    const subtotal = cartItems.reduce((s, i) => s + i.packageData.price * i.quantity, 0);

    useEffect(() => {
        orderService.getMyOrders().then((data) => {
            setOrders(data);
            setLoadingOrders(false);
        });
    }, []);

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        try {
            setCreatingOrder(true);

            const orderItems = cartItems.map((c) => ({
                packageId: c.packageData.id,
                packageCode: c.packageData.code,
                packageName: c.packageData.name,
                price: c.packageData.price,
                quantity: c.quantity,
                vip: c.packageData.vip,
            }));

            try {

                const order =
                    await orderService.createOrder(orderItems);

                toast.success("Order created successfully");
                clearCart();
                setOrders((prev) => [order, ...prev]);
                setActiveOrder(order);

                toast.success("Order created successfully");
            } catch (error: any) {

                toast.error(
                    error.message ||
                    "Failed to create order"
                );
            }

        } catch (error: any) {
            toast.error(
                error?.message || "Failed to create order"
            );
        } finally {
            setCreatingOrder(false);
        }
    };

    const handlePaid = (updated: Order) => {
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        setActiveOrder(null);
    };

    return (
        <main className="min-h-screen bg-gray-50">

            {/* Nav */}
            <nav className="sticky top-0 z-30 flex items-center gap-[10px] border-b border-gray-200 bg-white px-5 py-3">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-[6px] text-[13px] text-gray-600"
                >
                    <ArrowLeft size={15} />
                    Continue shopping
                </button>

                <span className="text-gray-300">|</span>

                <span className="flex items-center gap-[6px] text-[13px] font-medium text-gray-600">
                    <ShoppingCart size={15} />
                    Cart

                    {cartItems.length > 0 && (
                        <span className="rounded-full bg-green-100 px-2 py-[1px] text-[11px] font-bold text-green-700">
                            {cartItems.reduce((s, c) => s + c.quantity, 0)} items
                        </span>
                    )}
                </span>
            </nav>

            <div className="mx-auto flex max-w-[860px] flex-col gap-8 px-5 py-6">

                {/* Cart items + summary */}
                <section>
                    <div
                        className={`grid items-start gap-4 ${cartItems.length > 0
                            ? "grid-cols-1 lg:grid-cols-[1fr_280px]"
                            : "grid-cols-1"
                            }`}
                    >

                        {/* items */}
                        <div className="flex flex-col gap-[10px]">
                            {cartItems.length === 0 ? (
                                <div className="rounded-xl border border-gray-200 bg-white px-5 py-12 text-center">
                                    <PackageOpen
                                        size={32}
                                        className="mx-auto mb-3 text-gray-400"
                                    />

                                    <p className="mb-1 text-sm font-medium text-gray-600">
                                        Your cart is empty
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        Browse packages and add them here.
                                    </p>
                                </div>
                            ) : (
                                cartItems.map((item) => {
                                    const enabled =
                                        item.packageData.benefits.filter(
                                            (b) => b.enabled
                                        );

                                    return (
                                        <div
                                            key={item.packageData.id}
                                            className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                                        >
                                            <div
                                                className={`h-[3px] ${item.packageData.vip
                                                    ? "bg-green-700"
                                                    : "bg-green-500"
                                                    }`}
                                            />

                                            <div className="px-4 py-[14px]">
                                                <div className="mb-[6px] flex items-center gap-2">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {item.packageData.name}
                                                    </p>

                                                    {item.packageData.vip && (
                                                        <span className="rounded-full bg-amber-400 px-[7px] py-[2px] text-[9px] font-bold text-amber-900">
                                                            VIP
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mb-[10px] flex flex-wrap gap-1">
                                                    {enabled
                                                        .slice(0, 3)
                                                        .map((b) => (
                                                            <span
                                                                key={b.code}
                                                                className="flex items-center gap-[3px] rounded-full bg-green-100 px-2 py-[2px] text-[10px] font-medium text-green-700"
                                                            >
                                                                <CheckCircle2 size={9} />
                                                                {b.title}
                                                            </span>
                                                        ))}

                                                    {enabled.length > 3 && (
                                                        <span className="px-1 text-[10px] text-gray-400">
                                                            +
                                                            {enabled.length - 3}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                                                        <button
                                                            onClick={() =>
                                                                updateQty(
                                                                    item.packageData.id,
                                                                    item.quantity - 1
                                                                )
                                                            }
                                                            disabled={
                                                                item.quantity <= 1
                                                            }
                                                            className="px-[10px] py-[5px] text-sm font-bold text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            −
                                                        </button>

                                                        <span className="border-x border-gray-200 px-3 py-[5px] text-[13px] font-medium">
                                                            {item.quantity}
                                                        </span>

                                                        <button
                                                            onClick={() =>
                                                                updateQty(
                                                                    item.packageData.id,
                                                                    item.quantity + 1
                                                                )
                                                            }
                                                            className="px-[10px] py-[5px] text-sm font-bold text-gray-600"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <p className="text-[15px] font-medium text-green-600">
                                                            $
                                                            {(
                                                                item.packageData
                                                                    .price *
                                                                item.quantity
                                                            ).toLocaleString()}
                                                        </p>

                                                        <button
                                                            onClick={() =>
                                                                removeItem(
                                                                    item.packageData
                                                                        .id
                                                                )
                                                            }
                                                            className="flex p-1 text-gray-400"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* order summary */}
                        {cartItems.length > 0 && (
                            <div className="sticky top-[70px] rounded-xl border border-gray-200 bg-white p-4">
                                <p className="mb-[14px] border-l-[3px] border-green-600 pl-[10px] text-[13px] font-medium text-gray-900">
                                    Order summary
                                </p>

                                {cartItems.map((item) => (
                                    <div
                                        key={item.packageData.id}
                                        className="mb-[6px] flex justify-between text-xs"
                                    >
                                        <span className="text-gray-600">
                                            {item.packageData.name} ×{" "}
                                            {item.quantity}
                                        </span>

                                        <span className="font-medium text-gray-900">
                                            $
                                            {(
                                                item.packageData.price *
                                                item.quantity
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                ))}

                                <div className="my-3 flex items-baseline justify-between border-t border-dashed border-gray-200 pt-3">
                                    <span className="text-[13px] font-medium text-gray-900">
                                        Total
                                    </span>

                                    <span className="text-[20px] font-medium text-green-600">
                                        ${subtotal.toLocaleString()}
                                    </span>
                                </div>

                                <p className="mb-[14px] text-right text-[10px] text-gray-400">
                                    * Excluding VAT
                                </p>

                                <button
                                    onClick={handleCheckout}
                                    disabled={creatingOrder}
                                    className="flex w-full items-center justify-center gap-[6px] rounded-lg bg-green-600 py-[11px] text-[13px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {creatingOrder && (
                                        <Loader2
                                            size={14}
                                            className="animate-spin"
                                        />
                                    )}

                                    {creatingOrder
                                        ? "Creating order..."
                                        : "Checkout & get bank info"}
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* My Orders */}
                <section>
                    <p className="mb-3 border-l-[3px] border-green-600 pl-[10px] text-[15px] font-medium text-gray-900">
                        My orders
                    </p>

                    {loadingOrders ? (
                        <div className="p-8 text-center text-[13px] text-gray-400">
                            Loading orders...
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="rounded-xl border border-gray-200 bg-white px-5 py-8 text-center">
                            <p className="text-[13px] text-gray-400">
                                No orders yet. Checkout to create your first order.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {orders.map((order) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onPayNow={setActiveOrder}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Bank Transfer Modal overlay */}
            {activeOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
                    <div className="w-full max-w-[500px]">
                        <BankTransferModal
                            order={activeOrder}
                            onPaid={handlePaid}
                            onClose={() => setActiveOrder(null)}
                        />
                    </div>
                </div>
            )}
        </main>
    );
}