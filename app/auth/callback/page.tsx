"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CodeMindIcon } from "@/components/icons/code-mind";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api";

function AuthCallbackContent() {
    const searchParams = useSearchParams();
    const errorParam = searchParams.get("error");
    const tokenParam = searchParams.get("token");
    const hasError = !!errorParam;

    const setUser = useAuthStore((s) => s.setUser);
    const navigated = useRef(false);

    useEffect(() => {
        if (navigated.current) return;

        // Handle OAuth failure redirects from the backend
        if (hasError) {
            navigated.current = true;
            // Pass through the specific error code from the backend failure handler.
            // The backend maps OAuth2 errors to descriptive codes like
            // oauth2_state_lost, oauth2_config_error, oauth2_token_error, etc.
            // If the backend sends "access_denied", keep it as-is.
            const loginError = errorParam || "oauth2_error";
            window.location.href = `/login?error=${encodeURIComponent(loginError)}`;
            return;
        }

        // No token means the user landed here without going through OAuth
        if (!tokenParam) {
            navigated.current = true;
            window.location.href = "/login?error=oauth2_error";
            return;
        }

        // Mark as navigated BEFORE the async call to prevent React 18
        // StrictMode from firing the effect twice and consuming the
        // single-use token on both calls (second would always get 401).
        navigated.current = true;

        // Exchange the one-time token for a real Spring session.
        // The backend sets the CODEMIND_SESSION cookie in the response to
        // THIS request, which is a direct cross-origin fetch to the backend
        // domain — so the cookie is correctly scoped to the backend domain
        // and the browser will send it on all future API calls.
        api.exchangeToken(tokenParam)
            .then((user) => {
                setUser(user);
                window.location.href = "/dashboard";
            })
            .catch(() => {
                navigated.current = false; // Allow retry
                window.location.href = "/login?error=invalid_token";
            });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background relative z-10">
            {/* Background decorative blobs */}
            <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-[-25%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute top-[60%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
            </div>
            <CodeMindIcon className="h-12 w-12 text-primary animate-pulse" />

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
