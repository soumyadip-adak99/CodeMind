"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { BrandMark } from "@/components/layout/app-shell";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-auth";

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const errorParam = searchParams.get("error");
    
    // Determine if we should skip fetching user because there's an OAuth error
    const hasError = !!errorParam;

    const { data: user, isLoading, isError, isFetched } = useCurrentUser({
        enabled: !hasError,
    });

    const navigated = useRef(false);

    useEffect(() => {
        if (navigated.current) return;

        if (hasError) {
            navigated.current = true;
            // Map common OAuth errors to our app's error codes
            let loginError = "oauth2_error";
            if (errorParam === "access_denied") {
                loginError = "github_cancelled";
            } else if (errorParam) {
                loginError = errorParam;
            }
            router.replace(`/login?error=${loginError}`);
            return;
        }

        // Wait until the request has settled
        if (isLoading || !isFetched) return;

        if (user) {
            navigated.current = true;
            router.replace("/dashboard");
        } else if (isError) {
            navigated.current = true;
            router.replace("/login?error=oauth2_error");
        }
    }, [user, isLoading, isFetched, isError, router, hasError, errorParam]);

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
