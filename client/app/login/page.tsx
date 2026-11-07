"use client";

import { useAuthStatus } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";

import { CodeMindIcon } from "@/components/icons/code-mind";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Spinner } from "@/components/ui/spinner";
import { BACKEND_GITHUB_LOGIN_URL } from "@/lib/api";
import { cn } from "@/lib/utils";

function getErrorMessage(error: string): string {
    switch (error) {
        case "github_cancelled":
            return "Sign-in was cancelled. Please try again.";
        case "access_denied":
            return "Access was denied. Please allow read access to sign in.";
        case "oauth2_error":
        case "oauth2_state_lost":
        case "oauth2_token_error":
        case "invalid_token":
            return "Sign-in session timed out. Please click below to try again.";
        case "oauth2_server_error":
            return "GitHub is temporarily busy. Please try again in a few moments.";
        default:
            return "Unable to complete sign-in. Please try again.";
    }
}

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const errorParam = searchParams.get("error");

    const status = useAuthStatus();
    const [oauthError, setOauthError] = useState<string | null>(errorParam);
    const shouldReduceMotion = useReducedMotion();

    if (errorParam && errorParam !== oauthError) {
        setOauthError(errorParam);
    }

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

    const loginMutation = useMutation({
        mutationFn: async () => {
            window.location.href = BACKEND_GITHUB_LOGIN_URL;
            await new Promise(() => {});
        },
    });

    if (status === "authenticated") {
        return (
            <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-[400px] mx-auto px-4"
            >
                <div className="relative rounded-3xl border border-border/80 bg-card/85 backdrop-blur-2xl p-8 sm:p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary/50 before:to-transparent">
                    <div className="flex flex-col items-center">
                        <div className="size-12 rounded-2xl bg-gradient-to-b from-primary/20 via-primary/10 to-transparent border border-primary/25 flex items-center justify-center text-primary mb-4 shadow-sm">
                            <CodeMindIcon className="size-6 text-primary animate-pulse" />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-foreground">Welcome back</h2>
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-3">
                            <Spinner className="size-3.5 text-primary" />
                            <span>Taking you to your dashboard&hellip;</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[400px] mx-auto px-4"
        >
            {/* Elegant Card matching landing page aesthetic */}
            <div className="relative rounded-3xl border border-border/80 bg-card/85 backdrop-blur-2xl p-7 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden text-center before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary/50 before:to-transparent">
                {/* 1. Logo */}
                <div className="flex flex-col items-center mb-6">
                    <Link
                        href="/"
                        className="group relative flex items-center justify-center size-12 rounded-2xl bg-gradient-to-b from-primary/20 via-primary/10 to-transparent border border-primary/25 shadow-sm hover:border-primary/50 hover:scale-105 transition-all duration-300 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        aria-label="CodeMind Home"
                    >
                        <div
                            className="absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            aria-hidden="true"
                        />
                        <CodeMindIcon className="size-6 text-primary group-hover:scale-110 transition-transform duration-300 relative z-10" />
                    </Link>

                    {/* 2. Heading */}
                    <h1 className="text-2xl sm:text-[25px] font-bold tracking-tight text-foreground font-sans">
                        Welcome to CodeMind
                    </h1>

                    {/* 3. Description */}
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed max-w-[310px] mx-auto text-balance font-normal">
                        Connect your GitHub account and bring your repositories into CodeMind.
                    </p>
                </div>

                {/* Smooth Error Message Appearance */}
                <AnimatePresence>
                    {oauthError && (
                        <motion.div
                            initial={shouldReduceMotion ? false : { opacity: 0, y: -6, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -6, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mb-5 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-left flex items-start gap-2.5 overflow-hidden"
                            role="alert"
                        >
                            <AlertCircle className="size-4 shrink-0 text-destructive mt-0.5" aria-hidden="true" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-destructive">Unable to sign in</p>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                    {getErrorMessage(oauthError)}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 4. GitHub Authentication Button */}
                <div className="space-y-4">
                    <div className="relative group w-full">
                        {/* Landing Page Gradient Glow */}
                        <div
                            className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/40 via-indigo-500/40 to-purple-500/40 rounded-2xl blur-md opacity-40 group-hover:opacity-80 transition duration-300 pointer-events-none"
                            aria-hidden="true"
                        />
                        <motion.button
                            type="button"
                            whileTap={!loginMutation.isPending && !shouldReduceMotion ? { scale: 0.985 } : undefined}
                            onClick={() => loginMutation.mutate()}
                            disabled={loginMutation.isPending}
                            className="relative z-10 w-full h-11 sm:h-12 rounded-xl bg-foreground text-background font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2.5 shadow-xl hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-70 disabled:cursor-wait select-none cursor-pointer"
                        >
                            {loginMutation.isPending ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Spinner className="size-4 text-background" />
                                    <span>Connecting to GitHub&hellip;</span>
                                </div>
                            ) : (
                                <>
                                    <FaGithub className="size-[18px] shrink-0" aria-hidden="true" />
                                    <span>Continue with GitHub</span>
                                    <ArrowRight
                                        className="size-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
                                        aria-hidden="true"
                                    />
                                </>
                            )}
                        </motion.button>
                    </div>

                    {/* 5. Security Information */}
                    <div className="pt-1 flex items-center justify-center gap-1.5 text-center px-1">
                        <ShieldCheck className="size-4 text-emerald-400 shrink-0" aria-hidden="true" />
                        <p className="text-xs text-muted-foreground leading-normal font-normal">
                            Your code stays yours. CodeMind only accesses the permissions you approve.
                        </p>
                    </div>
                </div>

                {/* 6. Bottom Information */}
                <div className="mt-7 pt-5 border-t border-border/60">
                    <p className="text-xs text-muted-foreground/80 leading-relaxed font-normal">
                        Built for developers who want a better way to understand their code.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

function LoginFallback() {
    return (
        <div className="w-full max-w-[400px] mx-auto px-4">
            <div className="rounded-3xl border border-border/80 bg-card/85 backdrop-blur-2xl p-8 sm:p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)] before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary/50 before:to-transparent relative overflow-hidden">
                <div className="flex flex-col items-center justify-center space-y-3 py-6">
                    <Spinner className="size-6 text-primary" />
                    <p className="text-xs text-muted-foreground font-mono tracking-tight animate-pulse">
                        Loading sign-in&hellip;
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="dark min-h-screen flex flex-col justify-between bg-background text-foreground relative overflow-hidden p-4 sm:p-6 md:p-8 selection:bg-primary/30">
            {/* Subtle Landing Page Grid Pattern */}
            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800f_1px,transparent_1px),linear-gradient(to_bottom,#8080800f_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
                aria-hidden="true"
            />

            {/* Ambient Radial Lighting Matching Landing Page (Hero + Final CTA) */}
            <div
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-r from-blue-500/12 via-purple-500/12 to-emerald-500/10 blur-[140px] rounded-full"
                aria-hidden="true"
            />

            {/* Header: Minimal Back Link & Theme Controls */}
            <header className="w-full max-w-5xl mx-auto flex items-center justify-between z-20 relative px-2">
                <Link
                    href="/"
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "group h-9 rounded-xl px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all flex items-center gap-1.5 cursor-pointer"
                    )}
                >
                    <ArrowLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
                    <span>Back to home</span>
                </Link>

                <div className="flex items-center gap-2">
                    <ModeToggle />
                </div>
            </header>

            {/* Main Centered Content */}
            <main className="flex-1 flex items-center justify-center relative z-10 py-10">
                <Suspense fallback={<LoginFallback />}>
                    <LoginContent />
                </Suspense>
            </main>

            {/* Minimal Clean Footer */}
            <footer className="w-full max-w-5xl mx-auto flex items-center justify-center text-xs text-muted-foreground/80 relative z-20 py-2">
                <p>&copy; {new Date().getFullYear()} CodeMind. All rights reserved.</p>
            </footer>
        </div>
    );
}
