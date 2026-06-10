"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Briefcase,
    Users,
    CreditCard,
    Settings,
    LogOut,
    HelpCircle,
    Bell,
    BarChart2,
    Star,
    ShoppingCart,
    Flag,
    type LucideIcon,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SubItem {
    name: string;
    path: string;
    description?: string;
}

interface NavItem {
    name: string;
    icon: LucideIcon;
    path: string;
    badge?: number;
    children?: SubItem[];
}

// ─── Nav data ────────────────────────────────────────────────────────────────

const mainNav: NavItem[] = [
    
    {
        name: "Recruitment",
        icon: Briefcase,
        path: "/admin/recruitment",
        children: [
            { name: "Jobs", path: "/admin/recruitment/jobs", description: "Manage job listings" },
            { name: "Applications", path: "/admin/recruitment/applications", description: "Review applicants" },
            // { name: "CV Documents", path: "/admin/recruitment/cv-documents", description: "Uploaded CVs" },
        ],
    },
    {
        name: "Services",
        icon: ShoppingCart,
        path: "/admin/services",
        children: [
            { name: "Packages", path: "/admin/services/packages", description: "Service packages" },
            { name: "Orders", path: "/admin/services/orders", description: "Customer orders" },
            { name: "Consultants", path: "/admin/services/consultants", description: "Consultant roster" },
        ],
    },
    {
        name: "Users",
        icon: Users,
        path: "/admin/users",
        children: [
            { name: "Candidates", path: "/admin/users/candidates", description: "Job seekers" },
            { name: "Recruiters", path: "/admin/users/recruiters", description: "Hiring managers" },
        ],
    },
    // {
    //     name: "Finance",
    //     icon: CreditCard,
    //     path: "/admin/finance",
    //     children: [
    //         { name: "Transactions", path: "/admin/finance/transactions", description: "Payment history" },
    //         { name: "Reports", path: "/admin/finance/reports", description: "Financial summaries" },
    //     ],
    // },
    {
        name: "Analytics",
        icon: BarChart2,
        path: "/admin/analytics",
    },
    {
        name: "Saved Reports",
        icon: Star,
        path: "/admin/saved-reports",
    },
    {
        name: "Flagged",
        icon: Flag,
        path: "/admin/flagged",
    },
];

const bottomNav: NavItem[] = [
    { name: "Settings", icon: Settings, path: "/admin/settings" },
    { name: "Help & support", icon: HelpCircle, path: "/admin/help" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const auth = useAuth();
    const user = auth?.user;

    // null = closed, string = open item path
    const [openItem, setOpenItem] = useState<string | null>(null);

    // Close panel on route change
    useEffect(() => {
        setOpenItem(null);
    }, [pathname]);

    // Close on Escape key
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpenItem(null);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const handleItemClick = (item: NavItem) => {
        if (item.children) {
            setOpenItem((prev) => (prev === item.path ? null : item.path));
        } else {
            setOpenItem(null);
            router.push(item.path);
        }
    };

    const handleLogout = () => {
        auth?.logout();
        router.push("/login");
    };

    const isActive = (item: NavItem) => {
        if (item.children) return item.children.some((c) => pathname.startsWith(c.path));
        return pathname === item.path || pathname.startsWith(item.path + "/");
    };

    const openNavItem = [...mainNav, ...bottomNav].find((i) => i.path === openItem);

    return (
        <>
            {/* ── Icon rail ─────────────────────────────────────────────────── */}
            <aside
                className="fixed left-0 top-0 bottom-0 z-40 flex flex-col items-center w-[60px] py-3"
                style={{ background: "linear-gradient(180deg, #1b4d35 0%, #163d2a 100%)" }}
            >
                {/* Logo */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 shrink-0"
                    style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <rect x="1" y="1" width="7" height="7" rx="2" fill="white" />
                        <rect x="10" y="1" width="7" height="7" rx="2" fill="rgba(255,255,255,0.5)" />
                        <rect x="1" y="10" width="7" height="7" rx="2" fill="rgba(255,255,255,0.5)" />
                        <rect x="10" y="10" width="7" height="7" rx="2" fill="rgba(255,255,255,0.3)" />
                    </svg>
                </div>

                {/* Divider */}
                <div className="w-6 h-px mb-2" style={{ background: "rgba(255,255,255,0.12)" }} />

                {/* Main nav icons */}
                <div className="flex flex-col items-center gap-0.5 flex-1 w-full px-2">
                    {mainNav.map((item) => (
                        <RailButton
                            key={item.path}
                            item={item}
                            active={isActive(item)}
                            open={openItem === item.path}
                            onClick={() => handleItemClick(item)}
                        />
                    ))}
                </div>

                {/* Bottom icons */}
                <div className="flex flex-col items-center gap-0.5 w-full px-2 mb-2">
                    {bottomNav.map((item) => (
                        <RailButton
                            key={item.path}
                            item={item}
                            active={isActive(item)}
                            open={openItem === item.path}
                            onClick={() => handleItemClick(item)}
                        />
                    ))}
                </div>

                {/* Divider */}
                <div className="w-6 h-px mb-2" style={{ background: "rgba(255,255,255,0.12)" }} />

                {/* User avatar */}
                <div className="group relative">
                    <button
                        onClick={handleLogout}
                        aria-label="Sign out"
                        className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center
              text-white text-[11px] font-semibold transition-all
              hover:ring-2 hover:ring-white/40"
                        style={{ background: "rgba(255,255,255,0.15)" }}
                    >
                        {user?.avatar
                            ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                            : user?.name?.slice(0, 2).toUpperCase() || "OR"
                        }
                    </button>
                    {/* Tooltip */}
                    <Tooltip label="Sign out" icon={<LogOut size={10} />} />
                </div>
            </aside>

            {/* ── Flyout panel ──────────────────────────────────────────────── */}
            {/* Backdrop — sits BEHIND the panel, ABOVE main content */}
            {openItem && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setOpenItem(null)}
                />
            )}

            {/* Panel itself */}
            <div
                className="fixed top-0 bottom-0 z-40 flex flex-col transition-all duration-200 ease-out"
                style={{
                    left: 60,
                    width: openItem ? 220 : 0,
                    overflow: "hidden",
                    pointerEvents: openItem ? "auto" : "none",
                }}
            >
                {openNavItem && (
                    <div
                        className="flex flex-col h-full w-[220px]"
                        style={{ background: "#1e5c38", borderRight: "1px solid rgba(255,255,255,0.07)" }}
                    >
                        {/* Panel header */}
                        <div className="px-4 pt-5 pb-3 shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ background: "rgba(255,255,255,0.12)" }}>
                                    <openNavItem.icon size={14} color="rgba(255,255,255,0.85)" strokeWidth={1.8} />
                                </div>
                                <span className="text-white font-semibold text-sm tracking-tight">{openNavItem.name}</span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="mx-4 mb-2" style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />

                        {/* Sub-items */}
                        <nav className="flex flex-col gap-0.5 px-2 flex-1">
                            {openNavItem.children?.map((child) => {
                                const active = pathname.startsWith(child.path);
                                return (
                                    <Link
                                        key={child.path}
                                        href={child.path}
                                        className="group/link flex flex-col px-3 py-2.5 rounded-xl transition-all duration-100"
                                        style={{
                                            background: active ? "rgba(255,255,255,0.14)" : "transparent",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
                                        }}
                                    >
                                        <span
                                            className="text-[13px] font-medium leading-tight"
                                            style={{ color: active ? "#ffffff" : "rgba(255,255,255,0.65)" }}
                                        >
                                            {child.name}
                                        </span>
                                        {child.description && (
                                            <span className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                                                {child.description}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Panel footer — mirrors rail user area */}
                        <div
                            className="flex items-center gap-2.5 px-4 py-3 mt-auto shrink-0"
                            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            <div
                                className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center
                  text-white text-[11px] font-semibold shrink-0"
                                style={{ background: "rgba(255,255,255,0.15)" }}
                            >
                                {user?.avatar
                                    ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                    : user?.name?.slice(0, 2).toUpperCase() || "OR"
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-white text-[12px] font-medium truncate">
                                    {user?.name || "Olivia Rhye"}
                                </div>
                                <div className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.45)" }}>
                                    {user?.email || "olivia@untitledui.com"}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="transition-colors"
                                style={{ color: "rgba(255,255,255,0.4)" }}
                                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)")}
                                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)")}
                                aria-label="Sign out"
                            >
                                <LogOut size={15} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

// ─── RailButton ──────────────────────────────────────────────────────────────

function RailButton({
    item,
    active,
    open,
    onClick,
}: {
    item: NavItem;
    active: boolean;
    open: boolean;
    onClick: () => void;
}) {
    const Icon = item.icon;
    const highlighted = active || open;

    return (
        <div className="relative group w-full flex justify-center">
            <button
                onClick={onClick}
                aria-label={item.name}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150"
                style={{
                    background: highlighted ? "rgba(255,255,255,0.18)" : "transparent",
                    color: highlighted ? "#ffffff" : "rgba(255,255,255,0.5)",
                }}
                onMouseEnter={(e) => {
                    if (!highlighted)
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)";
                    if (!highlighted)
                        (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)";
                }}
                onMouseLeave={(e) => {
                    if (!highlighted) {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
                    }
                }}
            >
                <Icon size={18} strokeWidth={1.8} />
                {/* Badge */}
                {item.badge ? (
                    <span
                        className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full flex items-center
              justify-center text-[9px] font-bold"
                        style={{ background: "#34d399", color: "#0f2d1d" }}
                    >
                        {item.badge > 9 ? "9+" : item.badge}
                    </span>
                ) : null}
                {/* Active dot */}
                {active && !item.badge && (
                    <span
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
                        style={{ background: "#34d399" }}
                    />
                )}
            </button>

            {/* Tooltip — hidden when panel is open */}
            {!open && <Tooltip label={item.name} badge={item.badge} />}
        </div>
    );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function Tooltip({
    label,
    badge,
    icon,
}: {
    label: string;
    badge?: number;
    icon?: React.ReactNode;
}) {
    return (
        <div
            className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 z-50
        opacity-0 group-hover:opacity-100 transition-opacity duration-100 delay-300"
        >
            {/* Arrow */}
            <div
                className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent"
                style={{ borderRightColor: "rgba(15,25,20,0.95)" }}
            />
            <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap text-white text-[12px] font-medium shadow-xl"
                style={{
                    background: "rgba(15,25,20,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                }}
            >
                {icon}
                {label}
                {badge ? (
                    <span
                        className="ml-0.5 px-1.5 py-px rounded-full text-[10px] font-semibold"
                        style={{ background: "rgba(52,211,153,0.2)", color: "#34d399" }}
                    >
                        {badge}
                    </span>
                ) : null}
            </div>
        </div>
    );
}