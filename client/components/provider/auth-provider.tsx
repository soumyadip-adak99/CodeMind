"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

// Public paths where we must NOT call fetchUser.
// The user is either not logged in or in the middle of an OAuth flow.
const PUBLIC_PATHS = ["/login", "/auth/callback"];

/**
 * AuthProvider
 *
 * Mounts once at the app root (inside app/layout.tsx).
 * Calls fetchUser() a single time to hydrate the Zustand auth store,
 * but only on protected pages — skips public pages like /login so we
 * don't trigger an unauthenticated GET /api/auth/me that could cause
 * Spring Security to create a new empty session cookie.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const fetchUser = useAuthStore((s) => s.fetchUser);
    const setUser = useAuthStore((s) => s.setUser);
    const pathname = usePathname();

    const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

    useEffect(() => {
        if (!isPublicPath) {
            fetchUser();
        } else {
            // We skip fetchUser on /login to avoid creating empty sessions,
            // but we must resolve the initial "loading" state so the UI renders.
            setUser(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPublicPath]);

    return <>{children}</>;
}
