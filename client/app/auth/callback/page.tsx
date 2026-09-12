"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { BrandMark } from "@/components/layout/app-shell";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/auth-store";

function AuthCallbackContent() {
    const searchParams = useSearchParams();
    const errorParam = searchParams.get("error");
    const hasError = !!errorParam;

    const fetchUser = useAuthStore((s) => s.fetchUser);
    const status = useAuthStore((s) => s.status);
    const user = useAuthStore((s) => s.user);

    const navigated = useRef(false);

    useEffect(() => {
        if (navigated.current) return;

        if (hasError) {
            navigated.current = true;
            let loginError = "oauth2_error";
            if (errorParam === "access_denied") {
                loginError = "github_cancelled";
            } else if (errorParam) {
                loginError = errorParam;
            }
            window.location.href = `/login?error=${loginError}`;
            return;
        }

        // Trigger a fresh fetch from the backend — the backend has just
        // set CODEMIND_SESSION after the OAuth dance, so this will succeed.
        fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (navigated.current) return;
        if (status === "loading") return;

        if (status === "authenticated" && user) {
            navigated.current = true;
            window.location.href = "/dashboard";
        } else if (status === "unauthenticated") {
            navigated.current = true;
            window.location.href = "/login?error=oauth2_error";
        }
    }, [status, user]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background relative z-10">
            {/* Background decorative blobs */}
            <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-[-25%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute top-[60%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
            </div>

            <BrandMark className="h-12 w-12 text-primary animate-pulse" />

            <div className="flex items-center gap-2">
                <Spinner className="size-5 text-primary" />
                <p className="text-sm font-medium text-foreground">
                    Finishing GitHub login&hellip;
                </p>
            </div>

            <p className="text-xs text-muted-foreground">
                Verifying your session, please wait
            </p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background relative z-10">
                    <Spinner className="size-5 text-primary" />
                    <p className="text-sm font-medium text-foreground">
                        Finishing GitHub login&hellip;
                    </p>
                </div>
            }
        >
            <AuthCallbackContent />
        </Suspense>
    );
}
