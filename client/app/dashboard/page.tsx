"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { BrandMark } from "@/components/layout/app-shell";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser, useLogout, setAuthCookie } from "@/hooks/use-auth";

export default function DashboardPage() {
    const router = useRouter();
    const { data: user, isError, isFetched } = useCurrentUser();
    const logout = useLogout();
    const redirected = useRef(false);

    // If the session cookie was stale, api.me() returns 401.
    // Clear the frontend cookie and send back to /login.
    useEffect(() => {
        if (isFetched && isError && !redirected.current) {
            redirected.current = true;
            setAuthCookie(false);
            router.replace("/login");
        }
    }, [isFetched, isError, router]);

    // Loading state while verifying session
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <BrandMark className="h-12 w-12 text-primary animate-pulse" />
                    <Spinner className="h-6 w-6 text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background p-4">
            <BrandMark className="h-14 w-14 text-primary" />

            <div className="text-center space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Welcome, {user.displayName}!
                </h1>
                <p className="text-sm text-muted-foreground">@{user.githubUsername}</p>
            </div>

            <button
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
            >
                {logout.isPending ? "Signing out…" : "Sign out"}
            </button>
        </div>
    );
}
