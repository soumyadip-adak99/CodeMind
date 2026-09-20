"use client";
// Triggering Next.js HMR

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ChevronRight, FileCode2, Loader2, Sparkles, XCircle, Code2, Cpu, Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { useIndexStatus, useRepo, useStartIndexing } from "@/hooks/use-repo";
import { cn } from "@/lib/utils";
import { IndexErrorAlert } from "@/components/dashboard/index-error-alert";
import Link from "next/link";

export default function IndexingPage() {
    const params = useParams();
    const router = useRouter();
    const repoId = typeof params?.id === "string" ? params.id : "";

    const { data: repo, isLoading: isRepoLoading } = useRepo(repoId);
    const startIndexing = useStartIndexing();
    
    // Always poll status if we are on this page
    const { data: statusResponse } = useIndexStatus(repoId, true);

    const [progressValue, setProgressValue] = useState(0);

    // Derived values
    const status = statusResponse?.indexStatus || repo?.indexStatus;
    const isIndexing = status === "INDEXING";
    const isReady = status === "READY";
    const isFailed = status === "FAILED";
    const isPending = status === "PENDING";
    
    const filesProcessed = statusResponse?.filesProcessed ?? repo?.filesProcessed ?? 0;
    const filesTotal = statusResponse?.filesTotal ?? repo?.filesTotal ?? 0;
    const errorMessage = repo?.errorMessage;

    // Smoothly animate progress
    useEffect(() => {
        if (filesTotal > 0) {
            const currentProgress = Math.min(100, Math.round((filesProcessed / filesTotal) * 100));
            setProgressValue(currentProgress);
        } else if (isReady) {
            setProgressValue(100);
        }
    }, [filesProcessed, filesTotal, isReady]);

    // Header actions (Back button)
    const headerActions = (
        <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")} className="group rounded-full px-4 border-white/10 hover:bg-white/5">
            <ArrowLeft className="mr-2 size-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
        </Button>
    );

    if (isRepoLoading) {
        return (
            <AppShell title="Indexing Status" actions={headerActions}>
                <div className="flex h-full items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="size-8 animate-spin text-primary/80" />
                        <p className="text-sm text-muted-foreground animate-pulse">Loading repository details...</p>
                    </div>
                </div>
            </AppShell>
        );
    }

    if (!repo) {
        return (
            <AppShell title="Repository Not Found" actions={headerActions}>
                <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
                    <XCircle className="size-12 text-destructive/80 mb-2" />
                    <h3 className="text-xl font-semibold">Not Found</h3>
                    <p className="text-muted-foreground">The requested repository could not be found or you don't have access.</p>
                    <Button variant="secondary" onClick={() => router.push("/dashboard")} className="mt-4">
                        Return to Dashboard
                    </Button>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell
            title="Repository Indexing"
            description="Neural analysis and semantic embedding generation"
            actions={headerActions}
        >
            <div className="mx-auto mt-12 flex w-full max-w-3xl flex-col items-center justify-center gap-10 text-center relative">
                
                {/* Background ambient glow effect */}
                <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30 pointer-events-none">
                    <div className={cn(
                        "w-64 h-64 rounded-full blur-[100px] transition-all duration-1000",
                        isIndexing && "bg-blue-500/40",
                        isReady && "bg-emerald-500/30",
                        isFailed && "bg-red-500/30",
                        isPending && "bg-zinc-500/30"
                    )} />
                </div>

                {/* ── Status Icon ── */}
                <div className="relative flex size-40 items-center justify-center">
                    {isIndexing && (
                        <>
                            <div className="absolute inset-0 animate-ping rounded-full border border-primary/40 opacity-75 duration-1000" />
                            <div className="absolute inset-2 animate-ping rounded-full border border-primary/20 opacity-50 duration-1000 delay-150" />
                            <svg className="absolute inset-0 size-full animate-spin text-primary/20 duration-[3000ms]" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5 5 5" />
                            </svg>
                        </>
                    )}
                    
                    <div
                        className={cn(
                            "relative z-10 flex size-28 items-center justify-center rounded-2xl shadow-2xl transition-all duration-700 backdrop-blur-md border",
                            isIndexing && "border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-blue-500/20",
                            isReady && "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-emerald-500/20",
                            isFailed && "border-red-500/30 bg-red-500/10 text-red-400 shadow-red-500/20",
                            isPending && "border-zinc-500/30 bg-zinc-500/10 text-zinc-400 shadow-zinc-500/10"
                        )}
                    >
                        {isIndexing ? (
                            <Database className="size-12 animate-pulse" />
                        ) : isReady ? (
                            <CheckCircle2 className="size-12" />
                        ) : isFailed ? (
                            <XCircle className="size-12" />
                        ) : (
                            <Cpu className="size-12" />
                        )}
                    </div>
                </div>

                {/* ── Text Content ── */}
                <div className="space-y-3 px-4">
                    <h2 className="text-3xl font-semibold tracking-tight">
                        {isIndexing && "Analyzing codebase..."}
                        {isReady && "Repository Indexed successfully"}
                        {isFailed && "Indexing failed"}
                        {isPending && "Ready to start indexing"}
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-[450px] mx-auto leading-relaxed">
                        {isIndexing && (
                            <>
                                <span className="font-medium text-foreground">{repo.fullName}</span> is currently being processed. CodeMind is generating semantic chunks and creating embeddings.
                            </>
                        )}
                        {isReady && (
                            <>
                                The neural index for <span className="font-medium text-foreground">{repo.fullName}</span> has been built. You can now chat seamlessly with your code.
                            </>
                        )}
                        {isFailed && (
                            <>
                                We encountered a problem while processing <span className="font-medium text-foreground">{repo.fullName}</span>. Please review the error details.
                            </>
                        )}
                        {isPending && (
                            <>
                                <span className="font-medium text-foreground">{repo.fullName}</span> is currently queued for processing.
                            </>
                        )}
                    </p>
                </div>

                {/* ── Progress Section ── */}
                <div className="w-full max-w-md space-y-4 px-4 mt-4">
                    <div className="flex items-end justify-between text-sm px-1 mb-2">
                        <div className="flex flex-col items-start gap-1">
                            <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-semibold">Progress</span>
                            <span className="text-foreground font-mono text-xl font-bold tracking-tight">
                                {isReady ? "100%" : filesTotal > 0 ? `${Math.min(100, Math.round((filesProcessed / filesTotal) * 100))}%` : "0%"}
                            </span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-semibold">Files Indexed</span>
                            <span className="text-foreground font-mono text-sm font-medium">
                                <span className={cn(isReady ? "text-emerald-500" : isFailed ? "text-red-500" : "text-blue-500")}>
                                    {filesProcessed}
                                </span> 
                                <span className="text-muted-foreground/50 mx-1">/</span> 
                                {filesTotal > 0 ? filesTotal : "-"}
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary/80 shadow-inner border border-white/5">
                        <div 
                            className={cn(
                                "absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out",
                                isReady ? "bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : 
                                isFailed ? "bg-gradient-to-r from-red-400 to-red-500" : 
                                "bg-gradient-to-r from-blue-400 to-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                            )}
                            style={{ width: `${Math.max(2, progressValue)}%` }}
                        >
                            {/* Shimmer effect inside the bar */}
                            {isIndexing && (
                                <div className="absolute inset-0 w-full h-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%]" />
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Error State ── */}
                {isFailed && errorMessage && (
                    <div className="w-full max-w-xl text-left mt-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                        <IndexErrorAlert errorMessage={errorMessage} repoName={repo.name} />
                    </div>
                )}

                {/* ── Action Buttons ── */}
                <div className="pt-8 h-20">
                    {isReady && (
                        <Button 
                            size="lg" 
                            className="rounded-full shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1 bg-primary text-primary-foreground font-medium px-8" 
                            nativeButton={false}
                            render={<Link href={`/chat/${repo.id}`} />}
                        >
                            <Code2 className="mr-2 size-5" />
                            Chat with codebase
                            <ChevronRight className="ml-1 size-4 opacity-70" />
                        </Button>
                    )}
                    {isFailed && (
                        <Button 
                            size="lg" 
                            variant="destructive"
                            className="rounded-full hover:shadow-destructive/40 transition-all duration-300 hover:-translate-y-1 font-medium px-8" 
                            onClick={() => startIndexing.mutate(repoId)}
                            disabled={startIndexing.isPending}
                        >
                            <RefreshCw className={cn("mr-2 size-5", startIndexing.isPending && "animate-spin")} />
                            {startIndexing.isPending ? "Retrying..." : "Retry Indexing"}
                        </Button>
                    )}
                </div>
            </div>
        </AppShell>
    );
}
