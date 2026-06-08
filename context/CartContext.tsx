"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Benefit {
    code: string;
    title: string;
    value: string;
    enabled: boolean;
    description?: string;
}

interface PackageItem {
    id: number;
    code: string;
    name: string;
    price: number;
    displayDays: number;
    serviceDays: number;
    vip: boolean;
    descriptions: string;
    benefits: Benefit[];
}

interface CartEntry {
    packageData: PackageItem;
    quantity: number;
}

interface CartContextValue {
    cartItems: CartEntry[];
    totalItems: number;
    addItem: (packageData: PackageItem, quantity?: number) => void;
    removeItem: (packageId: number) => void;
    updateQty: (packageId: number, quantity: number) => void;
    clearCart: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "recruiter-cart";

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartEntry[]>([]);

    // Load từ localStorage khi mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setCartItems(JSON.parse(stored));
        } catch {
            // ignore
        }
    }, []);

    // Sync vào localStorage mỗi khi cartItems thay đổi
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const addItem = (packageData: PackageItem, quantity = 1) => {
        setCartItems((prev) => {
            const existing = prev.find((c) => c.packageData.id === packageData.id);
            if (existing) {
                return prev.map((c) =>
                    c.packageData.id === packageData.id
                        ? { ...c, quantity: c.quantity + quantity }
                        : c
                );
            }
            return [...prev, { packageData, quantity }];
        });
    };

    const removeItem = (packageId: number) => {
        setCartItems((prev) => prev.filter((c) => c.packageData.id !== packageId));
    };

    const updateQty = (packageId: number, quantity: number) => {
        setCartItems((prev) =>
            prev.map((c) =>
                c.packageData.id === packageId
                    ? { ...c, quantity: Math.max(1, quantity) }
                    : c
            )
        );
    };

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider value={{ cartItems, totalItems, addItem, removeItem, updateQty, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
    return ctx;
}