"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const PUBLIC_ROUTES = ["/", "/candidate", "/recruiter"];

const ROLE_ROUTES: Record<string, string[]> = {
    "/recruiter/jobs": ["RECRUITER"],
};

export default function AuthGuard({ children }: any) {
    const router = useRouter();
    const pathname = usePathname();
    const auth = useAuth();

    // useEffect(() => {
    //     if (!auth || auth.loading) return;

    //     const user = auth.user;

    //     // 1. Not logged in
    //     if (!user) {
    //         if (!PUBLIC_ROUTES.includes(pathname)) {
    //             router.replace("/");
    //         }
    //         return;
    //     }

    //     // 2. Must complete register
    //     if (
    //         user.roles?.includes("REGISTER") &&
    //         pathname !== "/register"
    //     ) {
    //         router.replace("/register");
    //         return;
    //     }

    //     //  3. Role-based protection
    //     const requiredRoles = ROLE_ROUTES[pathname];
    //     if (requiredRoles) {
    //         const hasRole = requiredRoles.some(role =>
    //             user.roles?.includes(role)
    //         );

    //         if (!hasRole) {
    //             router.replace("/"); // or 403 page
    //             return;
    //         }
    //     }

    // }, [auth, pathname]);

    return children;
}