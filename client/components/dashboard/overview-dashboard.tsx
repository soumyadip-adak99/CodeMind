"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
    CheckCircle,
    Clock,
    FileCode2,
    FolderGit2,
    Layers,
    XCircle,
    MessageSquare,
    Zap,
    ExternalLink,
    RefreshCw,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardHeader } from "./dashboard-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRepos, useRefreshRepos } from "@/hooks/use-repo";
import { OverviewSkeleton } from "@/components/skeletons/overview-skeleton";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { LanguageBadge } from "./language-badge";
import { RepoStatus } from "./repo-status";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Repository } from "@/@type";

function StatCard({
    label,
    value,
    icon: Icon,
    isLoading,
    accent,
    description,
}: {
    label: string;
    value: number | string;
    icon: React.ElementType;
    isLoading?: boolean;
    accent?: string;
    description?: string;
}) {
    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-xs transition-all hover:shadow-sm">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {label}
                </span>
                <div
                    className={cn(
                        "flex size-8 items-center justify-center rounded-xl bg-muted/80",
                        accent
                    )}
                >
                    <Icon className="size-4 text-muted-foreground" />
                </div>
            </div>
            {isLoading ? (
                <Skeleton className="h-8 w-20" />
            ) : (
                <div className="space-y-1">
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-foreground">
                        {value}
                    </span>
                    {description && (
                        <p className="text-[11px] text-muted-foreground font-medium">
                            {description}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export function OverviewDashboard() {
    const { data: repos, isLoading, isError } = useRepos();
    const refreshRepos = useRefreshRepos();

    const stats = useMemo(() => {
        if (!repos) return null;
        const ready = repos.filter((r) => r.indexStatus === "READY");
        const failed = repos.filter((r) => r.indexStatus === "FAILED");
        const pending = repos.filter(
            (r) => r.indexStatus === "PENDING" || r.indexStatus === "INDEXING"
        );
        const totalChunks = ready.reduce((acc, r) => acc + r.chunkCount, 0);
        const totalFiles = ready.reduce((acc, r) => acc + r.filesTotal, 0);
        const readyPercentage =
            repos.length > 0 ? Math.round((ready.length / repos.length) * 100) : 0;

        return {
            total: repos.length,
            ready: ready.length,
            failed: failed.length,
            pending: pending.length,
            totalChunks,
            totalFiles,
            readyPercentage,
        };
    }, [repos]);

    const breakdownColumns: ColumnDef<Repository>[] = useMemo(
        () => [
            {
                id: "repo",
                header: "Repository",
                sortable: true,
                sortKey: (r) => r.fullName,
                cell: (r) => (
                    <div className="flex items-center gap-3">
                        <Avatar className="size-7 border bg-muted shrink-0">
                            <AvatarImage
                                src={`https://github.com/${r.owner}.png`}
                                alt={r.owner}
                            />
                            <AvatarFallback>
                                <FolderGit2 className="size-3.5 text-muted-foreground" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="truncate">
                            <span className="font-semibold text-xs text-foreground truncate block">
                                {r.fullName}
                            </span>
                        </div>
                    </div>
                ),
            },
            {
                id: "language",
                header: "Language",
                sortable: true,
                sortKey: (r) => r.language ?? "",
                cell: (r) => <LanguageBadge language={r.language} />,
            },
            {
                id: "status",
                header: "Status",
                sortable: true,
                sortKey: (r) => r.indexStatus,
                cell: (r) => (
                    <RepoStatus
                        status={r.indexStatus}
                        filesProcessed={r.filesProcessed}
                        filesTotal={r.filesTotal}
                    />
                ),
            },
            {
                id: "chunks",
                header: "Chunks",
                sortable: true,
                sortKey: (r) => r.chunkCount,
                cell: (r) => (
                    <span className="font-mono text-xs tabular-nums">
                        {r.chunkCount > 0 ? r.chunkCount.toLocaleString() : "—"}
                    </span>
                ),
            },
            {
                id: "files",
                header: "Files",
                sortable: true,
                sortKey: (r) => r.filesTotal,
                cell: (r) => (
                    <span className="font-mono text-xs tabular-nums">
                        {r.filesTotal > 0 ? r.filesTotal.toLocaleString() : "—"}
                    </span>
                ),
            },
            {
                id: "actions",
                header: "Action",
                className: "text-right",
                headerClassName: "text-right",
                cell: (r) => (
                    <div className="flex justify-end">
                        {r.indexStatus === "READY" ? (
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs rounded-lg px-2.5"
                                nativeButton={false}
                                render={<Link href={`/chat/${r.id}`} />}
                            >
                                <MessageSquare className="size-3 mr-1 text-emerald-500" />
                                Chat
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs rounded-lg px-2"
                                nativeButton={false}
                                render={<Link href="/dashboard" />}
                            >
                                View in Dashboard
                            </Button>
                        )}
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <AppShell
            title="Overview"
            description="Your CodeMind workspace at a glance"
            actions={
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refreshRepos.mutate()}
                    disabled={refreshRepos.isPending}
                    className="rounded-xl"
                >
                    <RefreshCw
                        className={cn(
                            "size-3.5 mr-1.5",
                            refreshRepos.isPending && "animate-spin"
                        )}
                    />
                    Sync Repositories
                </Button>
            }
        >
            <div className="space-y-8 pb-12">
                <DashboardHeader
                    title="Workspace Overview"
                    description="Real-time analytics and neural indexing coverage across your codebase"
                />

                {/* Skeletons while loading */}
                {isLoading && <OverviewSkeleton />}

                {/* Zero Repositories Empty State */}
                {!isLoading && repos && repos.length === 0 && (
                    <EmptyState
                        icon={FolderGit2}
                        title="No indexed repositories yet"
                        description="Sync your GitHub repositories and start indexing code to populate your overview metrics."
                        actionLabel="Sync Repositories"
                        onAction={() => refreshRepos.mutate()}
                        actionLoading={refreshRepos.isPending}
                    />
                )}

                {/* Loaded Content */}
                {!isLoading && repos && repos.length > 0 && (
                    <>
                        {/* Stats grid */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                            <StatCard
                                label="Total Repos"
                                value={stats?.total ?? 0}
                                icon={FolderGit2}
                                description="Connected via GitHub"
                            />
                            <StatCard
                                label="Ready"
                                value={stats?.ready ?? 0}
                                icon={CheckCircle}
                                accent="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                description={`${stats?.readyPercentage}% coverage`}
                            />
                            <StatCard
                                label="Pending"
                                value={stats?.pending ?? 0}
                                icon={Clock}
                                accent="bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                description="In queue or processing"
                            />
                            <StatCard
                                label="Failed"
                                value={stats?.failed ?? 0}
                                icon={XCircle}
                                accent="bg-destructive/10 text-destructive"
                                description="Errors requiring retry"
                            />
                            <StatCard
                                label="Total Chunks"
                                value={stats?.totalChunks.toLocaleString() ?? 0}
                                icon={Layers}
                                accent="bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                description="pgvector embeddings"
                            />
                            <StatCard
                                label="Indexed Files"
                                value={stats?.totalFiles.toLocaleString() ?? 0}
                                icon={FileCode2}
                                accent="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                description="Source files tokenized"
                            />
                        </div>

                        {/* Breakdown Data Table */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-sm text-foreground">
                                    Repository Breakdown
                                </h3>
                                <span className="text-xs text-muted-foreground">
                                    {repos.length} total repositories
                                </span>
                            </div>

                            <DataTable
                                data={repos}
                                columns={breakdownColumns}
                                keyExtractor={(r) => r.id}
                                pageSize={10}
                            />
                        </div>
                    </>
                )}
            </div>
        </AppShell>
    );
}
