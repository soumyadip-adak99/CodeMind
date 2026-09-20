"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { AlertCircle } from "lucide-react";

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

    useEffect(() => {
        if (status === "unauthenticated" || (status !== "loading" && status !== "error" && !user)) {
            window.location.href = "/login?clear=1";
        }
    }, [status, user]);

    if (status === "loading") {
        return (
            <div className="flex h-[100dvh] w-full flex-col items-center justify-center gap-4">
                <Spinner className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading your workspace...</p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex h-[100dvh] w-full flex-col items-center justify-center gap-4">
                <AlertCircle className="size-8 text-destructive" />
                <p className="text-sm text-muted-foreground">Unable to connect to the server.</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                    Retry
                </Button>
            </div>
        );
    }

    if (status === "unauthenticated" || !user) {
        return null;
    }

    return <>{children}</>;
}
