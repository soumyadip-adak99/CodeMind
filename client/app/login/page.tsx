"use client";
import { useAuthStatus } from "@/hooks/use-auth";

import { useMutation } from "@tanstack/react-query";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GitHubIcon } from "@/components/icons/github-icon";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Spinner } from "@/components/ui/spinner";
import { BACKEND_GITHUB_LOGIN_URL } from "@/lib/api";
import { cn } from "@/lib/utils";
import { CodeMindIcon } from "@/components/icons/code-mind";

function getErrorMessage(error: string): string {
    switch (error) {
        case "github_cancelled":
            return "GitHub sign-in was cancelled. Please try again.";
        case "access_denied":
            return "You denied access to your GitHub account. Please allow access to sign in.";
        case "oauth2_error":
            return "An OAuth2 error occurred while communicating with GitHub. Please try again.";
        case "invalid_token":
            return "The authentication token was invalid or expired. Please try again.";
        case "user_info_error":
            return "Could not retrieve your GitHub profile information. Please try again.";
        case "registration_error":
            return "There was a problem creating your account. Please try again later.";
        default:
            return "An unexpected error occurred during sign-in. Please try again.";
    }
}
function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const errorParam = searchParams.get("error");

    const status = useAuthStatus();

    // Store the error in state so it persists after clearing the URL
    const [oauthError, setOauthError] = useState<string | null>(errorParam);

    // Update state during render if the URL error param changes
    if (errorParam && errorParam !== oauthError) {
        setOauthError(errorParam);
    }

    // Strip ?error=... cleanly via Next.js router
    useEffect(() => {
        if (errorParam) {
            router.replace("/login", { scroll: false });
        }
    }, [errorParam, router]);

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [status, router]);

    // Trigger GitHub OAuth flow
    const loginMutation = useMutation({
        mutationFn: async () => {
            window.location.href = BACKEND_GITHUB_LOGIN_URL;
            // Never resolve to keep the button in loading state until the page unloads
            await new Promise(() => {});
        },
    });

    if (status === "loading" || status === "authenticated") {
        return (
            <div className="flex flex-col space-y-6 w-full max-w-md mx-auto relative z-10 items-center justify-center py-20">
                <Spinner className="h-10 w-10 text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse font-medium">
                    {status === "loading" ? "Checking authentication..." : "Redirecting to dashboard..."}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-6 w-full max-w-md mx-auto relative z-10">
            <div className="flex flex-col space-y-2 text-center items-center">
                <CodeMindIcon className="h-12 w-12 mb-2 text-primary" />
                <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
                <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
            </div>

            <Card className="border-border shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Sign In</CardTitle>
                    <CardDescription>Use your GitHub account to authenticate.</CardDescription>
                </CardHeader>
                <CardContent>
                    {oauthError && (
                        <Alert variant="destructive" className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Authentication Failed</AlertTitle>
                            <AlertDescription className="mt-1 space-y-2">
                                <p>{getErrorMessage(oauthError)}</p>
                                <p className="text-xs opacity-80 flex items-center gap-1">
                                    <RefreshCw className="h-3 w-3" />
                                    Click &ldquo;Sign in with GitHub&rdquo; below to try again.
                                </p>
                            </AlertDescription>
                        </Alert>
                    )}

                    <button
                        type="button"
                        onClick={() => loginMutation.mutate()}
                        disabled={loginMutation.isPending}
                        className={cn(
                            buttonVariants({ variant: "default" }),
                            "w-full flex items-center justify-center h-11 transition-all duration-300"
                        )}
                    >
                        {loginMutation.isPending ? (
                            <>
                                <Spinner className="mr-2 h-4 w-4 text-primary-foreground" />
                                Connecting to GitHub...
                            </>
                        ) : (
                            <>
                                <GitHubIcon className="mr-2 h-5 w-5" />
                                {oauthError ? "Try Again with GitHub" : "Sign in with GitHub"}
                            </>
                        )}
                    </button>
                </CardContent>
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-25%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute top-[60%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
            </div>

            <div className="absolute top-4 left-4 z-50">
                <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground hover:text-foreground")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to home
                </Link>
            </div>

            <div className="absolute top-4 right-4 z-50">
                <ModeToggle />
            </div>

            <Suspense
                fallback={
                    <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
                        <Spinner className="h-8 w-8 text-primary" />
                        <p className="text-sm text-muted-foreground animate-pulse">
                            Loading login...
                        </p>
                    </div>
                }
            >
                <LoginContent />
            </Suspense>
        </div>
    );
}
