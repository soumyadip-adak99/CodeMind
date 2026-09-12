"use client";

import { create } from "zustand";
import { api } from "@/lib/api";
import type { User } from "@/@type/index";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthState {
    user: User | null;
    status: AuthStatus;
    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    status: "loading",

    setUser: (user) =>
        set({
            user,
            status: user ? "authenticated" : "unauthenticated",
        }),

    fetchUser: async () => {
        set({ status: "loading" });
        try {
            const user = await api.me();
            set({ user, status: "authenticated" });
        } catch (err) {
            // Any failure (401, network error, etc.) → treat as unauthenticated
            set({ user: null, status: "unauthenticated" });
        }
    },

    logout: async () => {
        try {
            await api.logout();
        } catch {
            // Even if the backend call fails, clear the local state
            // and redirect — the session may already be gone.
        } finally {
            set({ user: null, status: "unauthenticated" });
            // Hard redirect so the browser discards all React state
            // and the middleware re-evaluates the session cookie.
            window.location.href = "/login";
        }
    },
}));

/** Convenience selectors */
export const useUser = () => useAuthStore((s) => s.user);
export const useAuthStatus = () => useAuthStore((s) => s.status);
