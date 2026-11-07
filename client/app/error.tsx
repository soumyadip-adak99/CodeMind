"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to monitoring service (safely without crashing)
        console.error("CodeMind Application Error:", error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
            <div className="max-w-md space-y-6">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-8 ring-destructive/5 shadow-xs">
                    <AlertTriangle className="size-8" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
                        Something Went Wrong
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        An unexpected application error occurred while processing your request.
                        Your saved data remains secure.
                    </p>
                    {error.message && (
                        <div className="mx-auto mt-2 max-w-sm rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive/90 font-mono text-left break-words">
                            {error.message}
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Button onClick={() => reset()} className="rounded-xl px-5">
                        <RefreshCw className="mr-2 size-4" />
                        Try Again
                    </Button>
                    <Button
                        variant="outline"
                        nativeButton={false}
                        render={<Link href="/dashboard" />}
                        className="rounded-xl px-5"
                    >
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}

