"use client";

import { useMemo } from "react";
import { CheckCircle, Clock, FileCode2, FolderGit2, Layers, XCircle } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardHeader } from "./dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useRepos } from "@/hooks/use-repo";
import { cn } from "@/lib/utils";

function StatCard({
    label,
    value,
    icon: Icon,
    isLoading,
    accent,
}: {
    label: string;
    value: number | string;
    icon: React.ElementType;
    isLoading?: boolean;
    accent?: string;
}) {
    return (
        <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <div className={cn("flex size-8 items-center justify-center rounded-xl bg-muted", accent)}>
                    <Icon className="size-4 text-muted-foreground" />
                </div>
            </div>
            {isLoading ? (
                <Skeleton className="h-8 w-20" />
            ) : (
                <span className="text-3xl font-bold tabular-nums">{value}</span>
            )}
        </div>
    );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function OverviewDashboard() {
    const { data: repos, isLoading } = useRepos();

    const stats = useMemo(() => {
        if (!repos) return null;
        const ready = repos.filter((r) => r.indexStatus === "READY");
        const failed = repos.filter((r) => r.indexStatus === "FAILED");
        const pending = repos.filter((r) => r.indexStatus === "PENDING" || r.indexStatus === "INDEXING");
        const totalChunks = ready.reduce((acc, r) => acc + r.chunkCount, 0);
        const totalFiles = ready.reduce((acc, r) => acc + r.filesTotal, 0);
        return { total: repos.length, ready: ready.length, failed: failed.length, pending: pending.length, totalChunks, totalFiles };
    }, [repos]);

    return (
        <AppShell
            title="Overview"
            description="Your CodeMind workspace at a glance"
        >
            <div className="space-y-6">
                <DashboardHeader
                    title="Overview"
                    description="A snapshot of your indexed codebase"
                />

                {/* Stats grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <StatCard
                        label="Total repositories"
                        value={stats?.total ?? 0}
                        icon={FolderGit2}
                        isLoading={isLoading}
                    />
                    <StatCard
                        label="Indexed & ready"
                        value={stats?.ready ?? 0}
                        icon={CheckCircle}
                        isLoading={isLoading}
                        accent="bg-emerald-500/10"
                    />
                    <StatCard
                        label="Pending / indexing"
                        value={stats?.pending ?? 0}
                        icon={Clock}
                        isLoading={isLoading}
                        accent="bg-amber-500/10"
                    />
                    <StatCard
                        label="Failed"
                        value={stats?.failed ?? 0}
                        icon={XCircle}
                        isLoading={isLoading}
                        accent="bg-destructive/10"
                    />
                    <StatCard
                        label="Total chunks"
                        value={stats?.totalChunks.toLocaleString() ?? 0}
                        icon={Layers}
                        isLoading={isLoading}
                    />
                    <StatCard
                        label="Files indexed"
                        value={stats?.totalFiles.toLocaleString() ?? 0}
                        icon={FileCode2}
                        isLoading={isLoading}
                    />
                </div>

                {/* Repo breakdown table */}
                {!isLoading && repos && repos.length > 0 && (
                    <div className="rounded-2xl border bg-card overflow-hidden">
                        <div className="border-b px-5 py-3">
                            <h2 className="text-sm font-semibold">Repository breakdown</h2>
                        </div>
                        <div className="divide-y">
                            {repos.map((repo) => (
                                <div key={repo.id} className="flex items-center justify-between px-5 py-3 text-sm">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <FolderGit2 className="size-4 shrink-0 text-muted-foreground" />
                                        <span className="truncate font-medium">{repo.fullName}</span>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0 text-xs text-muted-foreground ml-4">
                                        {repo.indexStatus === "READY" && (
                                            <>
                                                <span>{repo.chunkCount.toLocaleString()} chunks</span>
                                                <span>{repo.filesTotal} files</span>
                                            </>
                                        )}
                                        <span
                                            className={cn(
                                                "font-medium",
                                                repo.indexStatus === "READY" && "text-emerald-600 dark:text-emerald-400",
                                                repo.indexStatus === "FAILED" && "text-destructive",
                                                repo.indexStatus === "INDEXING" && "text-amber-600 dark:text-amber-400"
                                            )}
                                        >
                                            {repo.indexStatus}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
