"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

// Routes anyone can access without login
const PUBLIC_ROUTES = [
    "/",
    "/candidate",
    "/candidate/login",
    "/candidate/register",
    "/recruiter/login",
    "/recruiter/register",
    "/admin/login",
    "/jobs",
    "/companies",
];

// Route prefix → required roles
const ROLE_ROUTES: Record<string, string[]> = {
    "/candidate/profile":   ["CANDIDATE"],
    "/candidate/saved":     ["CANDIDATE"],
    "/candidate/applied":   ["CANDIDATE"],
    "/candidate/settings":  ["CANDIDATE"],
    "/recruiter":           ["RECRUITER"],
    "/admin":               ["ADMIN"],
};

export default function AuthGuard({ children }: any) {
    const router = useRouter();
    const pathname = usePathname();
    const auth = useAuth();

   useEffect(() => {
    if (!auth || auth.loading) return;

    const user = auth.user;

    // 1. PUBLIC routes: everyone can access
    const isPublic = PUBLIC_ROUTES.some(route =>
        pathname === route || pathname.startsWith(route + "/")
    );

    if (isPublic) {
        return; // allow guest + any logged-in role
    }

    // 2. Non-public routes require login
    if (!user) {
        router.replace("/");
        return;
    }

    // 3. Check role-based protected routes
    const matchedPrefix = Object.keys(ROLE_ROUTES).find(prefix =>
        pathname.startsWith(prefix)
    );

    if (matchedPrefix) {

        const requiredRoles = ROLE_ROUTES[matchedPrefix];

        const hasRole = requiredRoles.some(role =>
            user.roles?.includes(role)
        );

        if (!hasRole) {

            if (user.roles?.includes("ADMIN")) {
                router.replace("/admin");
            } else if (user.roles?.includes("RECRUITER")) {
                router.replace("/recruiter");
            } else if (user.roles?.includes("CANDIDATE")) {
                router.replace("/candidate");
            } else {
                router.replace("/");
            }
        }
    }

}, [auth, pathname]);

    return children;
}