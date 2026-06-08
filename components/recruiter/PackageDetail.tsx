"use client";

import { useState } from "react";
import {
    ArrowLeft,
    ShoppingCart,
    Zap,
    Star,
    Clock,
    Shield,
    TrendingUp,
    Bell,
    Award,
    Eye,
    Layers,
    CheckCircle2,
    Crown,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PackageBenefit, PackageData } from "@/types/package";


interface CartItem {
    packageData: PackageData;
    quantity: number;
}

// ─── Benefit icon map ─────────────────────────────────────────────────────────

const BENEFIT_ICONS: Record<string, React.ReactNode> = {
    TOP_GOLDEN_HOUR: <Zap size={18} />,
    AI_CV_RECOMMENDATION: <Star size={18} />,
    JOB_MATCH_NOTIFICATION: <Bell size={18} />,
    SERVICE_GUARANTEE: <Shield size={18} />,
    RELATED_JOB_PRIORITY: <TrendingUp size={18} />,
    IMPRESSION_PRIORITY: <Eye size={18} />,
    HIGHLIGHT_LEVEL: <Layers size={18} />,
    TOP_JOB_QUOTA: <Award size={18} />,
    BEST_JOB_BOX: <Crown size={18} />,
    PRIORITY_ALL_JOB_LIST: <TrendingUp size={18} />,
    REPUTATION_POINTS: <Star size={18} />,
};

function benefitDisplayValue(benefit: PackageBenefit): string {
    if (benefit.value === "true") return benefit.title;
    if (benefit.value === "false") return benefit.title;
    if (!isNaN(Number(benefit.value))) {
        // numeric values
        if (benefit.code === "IMPRESSION_PRIORITY") return `${benefit.value}x Impression Priority`;
        if (benefit.code === "TOP_GOLDEN_HOUR") return `${benefit.value}× Golden Hour Boost`;
        if (benefit.code === "REPUTATION_POINTS") return `${benefit.value} Reputation Points`;
        if (benefit.code === "TOP_JOB_QUOTA") return `${benefit.value} Top Job Slots`;
    }
    return `${benefit.title}: ${benefit.value}`;
}

// ─── PackageDetailPage ────────────────────────────────────────────────────────

interface PackageDetailPageProps {
    packageData: PackageData;
    onBack?: () => void;
    onAddToCart?: (item: CartItem) => void;
}

export default function PackageDetailPage({
    packageData,
    onBack,
    onAddToCart,
}: PackageDetailPageProps) {
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const { addItem } = useCart();

    const handleAddToCart = () => {
        onAddToCart?.({ packageData, quantity });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    console.log(packageData);

    const accentColor = packageData.vip ? "#16a34a" : "#22c55e";
    const highlightBg = packageData.vip
        ? "linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%)"
        : "linear-gradient(135deg, #166534 0%, #15803d 60%, #16a34a 100%)";

    return (
        <div className="min-h-screen bg-[#f4f6f9] font-sans">
            {/* Top nav */}
            <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                    <ArrowLeft size={16} />
                    Come back
                </button>
                <span className="text-gray-300">|</span>
                <span className="text-gray-700 font-semibold text-sm">Service details</span>
            </nav>

            {/* Hero banner */}
            <div
                className="relative overflow-hidden px-8 py-12"
                style={{ background: highlightBg }}
            >
                {/* decorative circles */}
                <div className="absolute right-0 top-0 w-72 h-72 rounded-full opacity-10"
                    style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
                <div className="absolute right-16 bottom-0 w-48 h-48 rounded-full opacity-10"
                    style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)", transform: "translateY(40%)" }} />

                <div className="max-w-5xl mx-auto relative z-10">
                    <p className="text-green-200 text-sm font-medium mb-2 uppercase tracking-widest">
                        Post high-performance job advertisements
                    </p>
                    <div className="flex items-center gap-3 mb-4">
                        <h1 className="text-white text-4xl font-extrabold tracking-tight">
                            {packageData.name.toUpperCase()}
                        </h1>
                        {packageData.vip && (
                            <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                                VIP
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-green-100 text-sm">
                        <CheckCircle2 size={16} className="text-green-300" />
                        <span>{packageData.descriptions}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Service details + Benefits */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Service meta */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-gray-800 font-bold text-lg mb-4 border-l-4 border-green-500 pl-3">
                            Service details
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                                <Clock size={18} className="text-green-500" />
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Display period</p>
                                    <p className="text-sm font-bold text-gray-800">{packageData.displayDays} days</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                                <Shield size={18} className="text-orange-400" />
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Service validity</p>
                                    <p className="text-sm font-bold text-gray-800">{packageData.serviceDays} days</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Benefits list */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-gray-800 font-bold text-lg mb-5 border-l-4 border-green-500 pl-3">
                            Package Benefits
                        </h2>
                        <ul className="flex flex-col gap-3">
                            {packageData.benefits
                                .filter((b) => b.enabled)
                                .map((benefit) => (
                                    <li
                                        key={benefit.code}
                                        className="flex items-start gap-3 group"
                                    >
                                        {/* tick */}
                                        <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                            <CheckCircle2 size={14} className="text-green-600" />
                                        </span>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-600">
                                                    {BENEFIT_ICONS[benefit.code] ?? <Award size={18} />}
                                                </span>
                                                <span className="text-gray-800 font-semibold text-sm">
                                                    {benefitDisplayValue(benefit)}
                                                </span>
                                            </div>
                                            {benefit.description && (
                                                <p className="text-gray-500 text-xs mt-1 leading-relaxed pl-6">
                                                    {benefit.description}
                                                </p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>

                {/* Right: Purchase card */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                        <p className="text-gray-500 text-sm mb-1">
                            Post job advertisements ({packageData.name})
                            {packageData.vip && (
                                <span className="ml-2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                    VIP
                                </span>
                            )}
                        </p>

                        <p className="text-green-600 text-2xl font-extrabold mb-1">
                            ${packageData.price.toLocaleString()}
                            <span className="text-red-400 text-sm font-semibold ml-1">*</span>
                        </p>

                        {/* Quantity */}
                        <div className="flex items-center justify-between mb-5 mt-4">
                            <span className="text-gray-600 text-sm font-medium">Quantity</span>
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-bold"
                                >
                                    −
                                </button>
                                <span className="px-4 py-2 text-gray-800 font-semibold text-sm border-x border-gray-200">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-bold"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => addItem(packageData, quantity)}
                                className="flex items-center justify-center gap-2 border-2 border-green-500 text-green-600 rounded-xl py-3 font-semibold hover:bg-green-50 transition-colors text-sm"
                            >
                                <ShoppingCart size={16} />
                                {added ? "Added!" : "Add to cart"}
                            </button>
                            <button
                                style={{ background: accentColor }}
                                className="text-white rounded-xl py-3 font-bold text-sm hover:opacity-90 transition-opacity"
                            >
                                Buy now
                            </button>
                        </div>

                        <p className="text-gray-400 text-xs mt-3">* Service prices do not include VAT.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── CartPage ─────────────────────────────────────────────────────────────────

interface CartPageProps {
    cartItems: CartItem[];
    onBack?: () => void;
    onRemove?: (packageId: number) => void;
    onUpdateQty?: (packageId: number, qty: number) => void;
    onCheckout?: () => void;
}

export function CartPage({
    cartItems,
    onBack,
    onRemove,
    onUpdateQty,
    onCheckout,
}: CartPageProps) {
    const total = cartItems.reduce(
        (sum, item) => sum + item.packageData.price * item.quantity,
        0
    );

    return (
        <div className="min-h-screen bg-[#f4f6f9]">
            {/* Nav */}
            <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                    <ArrowLeft size={16} />
                    Continue shopping
                </button>
                <span className="text-gray-300">|</span>
                <span className="text-gray-700 font-semibold text-sm flex items-center gap-2">
                    <ShoppingCart size={16} />
                    Your Cart
                </span>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Cart items */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {cartItems.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                            <ShoppingCart size={40} className="text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400 font-medium">Your cart is empty.</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div
                                key={item.packageData.id}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4"
                            >
                                {/* color accent */}
                                <div
                                    className="w-1.5 self-stretch rounded-full flex-shrink-0"
                                    style={{
                                        background: item.packageData.vip
                                            ? "linear-gradient(to bottom, #16a34a, #15803d)"
                                            : "#22c55e",
                                    }}
                                />

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-gray-900 text-base">
                                            {item.packageData.name}
                                        </h3>
                                        {item.packageData.vip && (
                                            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                                VIP
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                                        {item.packageData.descriptions}
                                    </p>

                                    {/* benefits mini-list */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {item.packageData.benefits
                                            .filter((b) => b.enabled)
                                            .slice(0, 4)
                                            .map((b) => (
                                                <span
                                                    key={b.code}
                                                    className="flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium"
                                                >
                                                    <CheckCircle2 size={10} />
                                                    {b.title}
                                                </span>
                                            ))}
                                        {item.packageData.benefits.filter((b) => b.enabled).length > 4 && (
                                            <span className="text-gray-400 text-xs px-2 py-0.5">
                                                +{item.packageData.benefits.filter((b) => b.enabled).length - 4} more
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() =>
                                                    item.quantity <= 1
                                                        ? onRemove?.(item.packageData.id)
                                                        : onUpdateQty?.(item.packageData.id, item.quantity - 1)
                                                }
                                                className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-bold"
                                            >
                                                −
                                            </button>
                                            <span className="px-3 py-1.5 text-gray-800 font-semibold text-sm border-x border-gray-200">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    onUpdateQty?.(item.packageData.id, item.quantity + 1)
                                                }
                                                className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-bold"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-green-600 font-extrabold text-base">
                                                ${(item.packageData.price * item.quantity).toLocaleString()}
                                            </p>
                                            {item.quantity > 1 && (
                                                <p className="text-gray-400 text-xs">
                                                    ${item.packageData.price.toLocaleString()} × {item.quantity}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onRemove?.(item.packageData.id)}
                                    className="text-gray-300 hover:text-red-400 transition-colors text-lg font-light mt-0.5 flex-shrink-0"
                                    title="Remove"
                                >
                                    ×
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Order summary */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="font-bold text-gray-800 text-base mb-4 border-l-4 border-green-500 pl-3">
                            Order Summary
                        </h2>

                        <div className="flex flex-col gap-2 mb-4">
                            {cartItems.map((item) => (
                                <div key={item.packageData.id} className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        {item.packageData.name} × {item.quantity}
                                    </span>
                                    <span className="text-gray-700 font-semibold">
                                        ${(item.packageData.price * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 pt-4 mb-5">
                            <div className="flex justify-between">
                                <span className="text-gray-700 font-bold">Total</span>
                                <span className="text-green-600 font-extrabold text-lg">
                                    ${total.toLocaleString()}
                                </span>
                            </div>
                            <p className="text-gray-400 text-xs mt-1">* Excluding VAT</p>
                        </div>

                        <button
                            onClick={onCheckout}
                            disabled={cartItems.length === 0}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-3 font-bold text-sm transition-colors"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}