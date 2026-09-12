"use client";

/**
 * use-auth.ts
 *
 * Thin hook wrappers over the Zustand auth store.
 * Login / logout / session management is fully handled by the Spring Boot
 * backend via the CODEMIND_SESSION HttpOnly cookie — the frontend never
 * reads or writes session cookies directly.
 */

import { useAuthStore } from "@/store/auth-store";

export { useUser, useAuthStatus, useAuthStore } from "@/store/auth-store";

/**
 * Returns a stable `logout` function backed by the auth store.
 * Calling it will:
 *   1. POST /api/auth/logout  (backend invalidates CODEMIND_SESSION)
 *   2. Clear the Zustand store
 *   3. Hard-redirect to /login
 */
export function useLogout() {
    return useAuthStore((s) => s.logout);
}

/**
 * Backward-compatible hook that mirrors the old React Query shape.
 * Components using { data: user, isLoading } don't need to be changed.
 */
export function useCurrentUser() {
    const user = useAuthStore((s) => s.user);
    const status = useAuthStore((s) => s.status);
    return {
        data: user,
        isLoading: status === "loading",
        isError: false,
    };
}
