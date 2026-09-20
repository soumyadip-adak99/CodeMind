"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderGit2, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AppShell } from "@/components/layout/app-shell";
import { RepoCard } from "./repo-card";
import { useRepos, useRefreshRepos, useStartIndexing } from "@/hooks/use-repo";
import { cn } from "@/lib/utils";
import type { IndexStatus, Repository } from "@/@type";

// ─── Types ─────────────────────────────────────────────────────────────────────

type VisibilityFilter = "all" | "public" | "private";
type StatusFilter = "all" | "ready" | "indexing" | "new" | "failed";

// ─── Filter pill ───────────────────────────────────────────────────────────────

function FilterPill({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "inline-flex h-7 items-center rounded-full px-3 text-xs font-medium transition-colors",
                active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
        >
            {label}
        </button>
    );
}

// ─── Skeleton grid ─────────────────────────────────────────────────────────────

function RepoCardSkeleton() {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-5">
            <div className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-40" />
            </div>
            <div className="flex gap-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-14" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-8 w-full rounded-xl" />
        </div>
    );
}

// ─── Empty state ───────────────────────────────────────────────────────────────

function EmptyRepos({ onRefresh, isLoading, filtered }: { onRefresh: () => void; isLoading: boolean; filtered?: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
                <FolderGit2 className="size-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
                <p className="font-semibold">
                    {filtered ? "No repositories match your filters" : "No repositories found"}
                </p>
                <p className="text-sm text-muted-foreground">
                    {filtered
                        ? "Try adjusting your search or filter options."
                        : "Sync your GitHub repositories to get started."}
                </p>
            </div>
            {!filtered && (
                <Button size="sm" onClick={onRefresh} disabled={isLoading}>
                    <RefreshCw className={isLoading ? "animate-spin" : ""} />
                    Sync repositories
                </Button>
            )}
        </div>
    );
}

// ─── Filter logic ──────────────────────────────────────────────────────────────

const STATUS_FILTER_MAP: Record<StatusFilter, IndexStatus | null> = {
    all: null,
    ready: "READY",
    indexing: "INDEXING",
    new: "PENDING",
    failed: "FAILED",
};

function applyFilters(
    repos: Repository[],
    search: string,
    visibility: VisibilityFilter,
    status: StatusFilter
): Repository[] {
    let result = repos;

    if (search.trim()) {
        const q = search.toLowerCase();
        result = result.filter(
            (r) =>
                r.name.toLowerCase().includes(q) ||
                r.owner.toLowerCase().includes(q) ||
                r.fullName.toLowerCase().includes(q)
        );
    }

    if (visibility !== "all") {
        result = result.filter((r) =>
            visibility === "private" ? r.isPrivate : !r.isPrivate
        );
    }

    const targetStatus = STATUS_FILTER_MAP[status];
    if (targetStatus) {
        result = result.filter((r) => r.indexStatus === targetStatus);
    }

    return result;
}

// ─── Main component ────────────────────────────────────────────────────────────

export function RepoDashboard() {
    const { data: repos, isLoading, isError } = useRepos();
    const refreshRepos = useRefreshRepos();
    const startIndexing = useStartIndexing();

    const router = useRouter();

    const [search, setSearch] = useState("");
    const [visibility, setVisibility] = useState<VisibilityFilter>("all");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const handleRefresh = () => refreshRepos.mutate();
    const handleStartIndexing = (repoId: string) => {
        startIndexing.mutate(repoId, {
            onSuccess: () => {
                router.push(`/dashboard/repos/${repoId}/indexing`);
            }
        });
    };

    const filtered = useMemo(
        () => (repos ? applyFilters(repos, search, visibility, statusFilter) : []),
        [repos, search, visibility, statusFilter]
    );

    const readyCount = useMemo(
        () => repos?.filter((r) => r.indexStatus === "READY").length ?? 0,
        [repos]
    );

    const headerDescription = repos
        ? `${repos.length} connected · ${readyCount} ready`
        : undefined;

    return (
        <AppShell
            title="Repositories"
            description={headerDescription}
            actions={
                <>
                    {/* Search */}
                    <div className="relative hidden sm:flex items-center">
                        <Search className="pointer-events-none absolute left-3 size-3.5 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Search repositories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={cn(
                                "h-8 w-52 rounded-xl border bg-transparent pl-8 pr-3 text-sm outline-none",
                                "placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40 transition-all"
                            )}
                        />
                    </div>

                    {/* Sync */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={refreshRepos.isPending}
                    >
                        <RefreshCw className={cn("size-3.5", refreshRepos.isPending && "animate-spin")} />
                        Sync
                    </Button>
                </>
            }
        >
            <div className="flex flex-col flex-1 min-h-0">
                {/* ── Fixed Filters & Search ─────────────────────────────────── */}
                <div className="flex flex-col gap-5 shrink-0 pb-5">
                    {/* Mobile search */}
                    <div className="relative flex items-center sm:hidden">
                        <Search className="pointer-events-none absolute left-3 size-3.5 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Search repositories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={cn(
                                "h-9 w-full rounded-xl border bg-transparent pl-9 pr-3 text-sm outline-none",
                                "placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40 transition-all"
                            )}
                        />
                    </div>

                    {/* ── Filter bar ─────────────────────────────────────────────── */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                    {/* Visibility */}
                    <div className="flex items-center gap-1">
                        <span className="mr-1.5 text-xs text-muted-foreground font-medium">Visibility</span>
                        {(["all", "public", "private"] as VisibilityFilter[]).map((v) => (
                            <FilterPill
                                key={v}
                                label={v.charAt(0).toUpperCase() + v.slice(1)}
                                active={visibility === v}
                                onClick={() => setVisibility(v)}
                            />
                        ))}
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-1">
                        <span className="mr-1.5 text-xs text-muted-foreground font-medium">Status</span>
                        {(["all", "ready", "indexing", "new", "failed"] as StatusFilter[]).map((s) => (
                            <FilterPill
                                key={s}
                                label={s.charAt(0).toUpperCase() + s.slice(1)}
                                active={statusFilter === s}
                                onClick={() => setStatusFilter(s)}
                            />
                        ))}
                    </div>
                    </div>
                </div>

                {/* ── Scrollable Grid Area ───────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto min-h-0 pb-8 pr-1 -mr-1">
                    <div className="flex flex-col gap-5">
                        {/* Error state */}
                        {isError && !isLoading && (
                            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                                Failed to load repositories. Please try refreshing.
                            </div>
                        )}

                        {/* Loading skeletons */}
                        {isLoading && (
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <RepoCardSkeleton key={i} />
                                ))}
                            </div>
                        )}

                        {/* Empty — no repos at all */}
                        {!isLoading && repos && repos.length === 0 && (
                            <EmptyRepos onRefresh={handleRefresh} isLoading={refreshRepos.isPending} />
                        )}

                        {/* Empty — filters returned nothing */}
                        {!isLoading && repos && repos.length > 0 && filtered.length === 0 && (
                            <EmptyRepos onRefresh={handleRefresh} isLoading={refreshRepos.isPending} filtered />
                        )}

                        {/* Repo grid */}
                        {!isLoading && filtered.length > 0 && (
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {filtered.map((repo) => (
                                    <RepoCard
                                        key={repo.id}
                                        repo={repo}
                                        onStartIndexing={handleStartIndexing}
                                        isIndexingLoading={
                                            startIndexing.isPending && startIndexing.variables === repo.id
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
