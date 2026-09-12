"use client";

import React from "react";
import { useAuthStore } from "@/store/auth-store";
import { Spinner } from "../ui/spinner";

/**
 * RequiredAuth
 *
 * Guards protected pages on the client side.
 * The middleware already blocks unauthenticated server requests,
 * but this component provides the loading state and handles the edge
 * case where the Zustand store hasn't hydrated yet.
 */
export function RequiredAuth({ children }: { children: React.ReactNode }) {
    const status = useAuthStore((s) => s.status);
    const user = useAuthStore((s) => s.user);

    if (status === "loading") {
        return (
            <div className="flex h-[100dvh] w-full flex-col items-center justify-center gap-4">
                <Spinner className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading your workspace...</p>
            </div>
        );
    }

    if (status === "unauthenticated" || !user) {
        // Middleware should catch this before the page renders,
        // but as a safety net, hard-redirect from the client too.
        window.location.href = "/login";
        return null;
    }

    return <>{children}</>;
}
