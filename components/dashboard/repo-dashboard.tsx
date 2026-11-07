"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    FolderGit2,
    RefreshCw,
    ExternalLink,
    MessageSquare,
    Zap,
    GitBranch,
    Lock,
    Unlock,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { RepoCard } from "./repo-card";
import { useRepos, useRefreshRepos, useStartIndexing } from "@/hooks/use-repo";
import { useDebounce } from "@/lib/debounce";
import { safeLocalStorageGet, safeLocalStorageSet, STORAGE_KEYS } from "@/lib/storage";
import {
    RepoFilters,
    RepoFilterState,
    VisibilityFilter,
    StatusFilter,
    SortOption,
    ViewMode,
} from "./repo-filters";
import { BulkActionsBar } from "./bulk-actions-bar";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { RepoGridSkeleton } from "@/components/skeletons/repo-card-skeleton";
import { LanguageBadge } from "./language-badge";
import { RepoStatus } from "./repo-status";
import { EmptyState } from "@/components/ui/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { IndexStatus, Repository } from "@/@type";

const STATUS_FILTER_MAP: Record<StatusFilter, IndexStatus | null> = {
    all: null,
    ready: "READY",
    indexing: "INDEXING",
    new: "PENDING",
    failed: "FAILED",
};

const DEFAULT_FILTERS: RepoFilterState = {
    search: "",
    visibility: "all",
    status: "all",
    language: "all",
    sort: "name-asc",
    viewMode: "grid",
};

export function RepoDashboard() {
    const { data: repos, isLoading, isError, refetch } = useRepos();
    const refreshRepos = useRefreshRepos();
    const startIndexing = useStartIndexing();
    const router = useRouter();

    // Filters state
    const [filters, setFilters] = useState<RepoFilterState>(() => {
        const savedView = safeLocalStorageGet<ViewMode>(
            STORAGE_KEYS.REPO_VIEW_MODE,
            "grid"
        );
        return { ...DEFAULT_FILTERS, viewMode: savedView };
    });

    // Bulk selection state
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Debounce the search term to prevent re-filtering on every keystroke
    const debouncedSearch = useDebounce(filters.search, 250);

    // Save view mode preference
    const handleFilterChange = (partial: Partial<RepoFilterState>) => {
        setFilters((prev) => {
            const next = { ...prev, ...partial };
            if (partial.viewMode) {
                safeLocalStorageSet(STORAGE_KEYS.REPO_VIEW_MODE, partial.viewMode);
            }
            return next;
        });
    };

    const handleResetFilters = () => {
        setFilters((prev) => ({
            ...DEFAULT_FILTERS,
            viewMode: prev.viewMode,
        }));
    };

    const handleRefresh = () => refreshRepos.mutate();

    const handleStartIndexing = (repoId: string) => {
        startIndexing.mutate(repoId, {
            onSuccess: () => {
                router.push(`/dashboard/repos/${repoId}/indexing`);
            },
        });
    };

    // Extract dynamic unique list of languages from repositories
    const availableLanguages = useMemo(() => {
        if (!repos) return [];
        const langs = new Set<string>();
        for (const r of repos) {
            if (r.language && r.language.trim()) {
                langs.add(r.language.trim());
            }
        }
        return Array.from(langs).sort();
    }, [repos]);

    // Check if any filter is active
    const hasActiveFilters = Boolean(
        filters.search.trim() ||
            filters.visibility !== "all" ||
            filters.status !== "all" ||
            filters.language !== "all" ||
            filters.sort !== "name-asc"
    );

    // Filter and sort repositories
    const filteredRepos = useMemo(() => {
        if (!repos) return [];

        let result = repos;

        // Search
        if (debouncedSearch.trim()) {
            const q = debouncedSearch.toLowerCase();
            result = result.filter(
                (r) =>
                    r.name.toLowerCase().includes(q) ||
                    r.owner.toLowerCase().includes(q) ||
                    r.fullName.toLowerCase().includes(q) ||
                    (r.description && r.description.toLowerCase().includes(q))
            );
        }

        // Visibility
        if (filters.visibility !== "all") {
            result = result.filter((r) =>
                filters.visibility === "private" ? r.isPrivate : !r.isPrivate
            );
        }

        // Status
        const targetStatus = STATUS_FILTER_MAP[filters.status];
        if (targetStatus) {
            result = result.filter((r) => r.indexStatus === targetStatus);
        }

        // Language
        if (filters.language !== "all") {
            result = result.filter(
                (r) => r.language?.toLowerCase() === filters.language.toLowerCase()
            );
        }

        // Sorting
        return [...result].sort((a, b) => {
            switch (filters.sort) {
                case "name-desc":
                    return b.fullName.localeCompare(a.fullName);
                case "chunks-desc":
                    return b.chunkCount - a.chunkCount;
                case "files-desc":
                    return b.filesTotal - a.filesTotal;
                case "name-asc":
                default:
                    return a.fullName.localeCompare(b.fullName);
            }
        });
    }, [repos, debouncedSearch, filters.visibility, filters.status, filters.language, filters.sort]);

    // Cleanup selection when filteredRepos change
    useEffect(() => {
        if (selectedIds.size > 0 && repos) {
            const validIds = new Set(repos.map((r) => r.id));
            setSelectedIds((prev) => {
                const next = new Set<string>();
                for (const id of prev) {
                    if (validIds.has(id)) next.add(id);
                }
                return next;
            });
        }
    }, [repos]);

    const handleToggleSelectCard = (repoId: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(repoId)) {
                next.delete(repoId);
            } else {
                next.add(repoId);
            }
            return next;
        });
    };

    // Table Column Definitions for Table View
    const tableColumns: ColumnDef<Repository>[] = useMemo(
        () => [
            {
                id: "name",
                header: "Repository",
                sortable: true,
                sortKey: (r) => r.fullName,
                cell: (repo) => (
                    <div className="flex items-center gap-3 min-w-[200px]">
                        <Avatar className="size-8 border bg-muted shrink-0">
                            <AvatarImage
                                src={`https://github.com/${repo.owner}.png`}
                                alt={repo.owner}
                            />
                            <AvatarFallback>
                                <FolderGit2 className="size-4 text-muted-foreground" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <div className="font-semibold text-sm text-foreground truncate">
                                {repo.name}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                                {repo.owner}
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                id: "visibility",
                header: "Visibility",
                sortable: true,
                sortKey: (r) => (r.isPrivate ? 1 : 0),
                cell: (repo) => (
                    <span
                        className={cn(
                            "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium border",
                            repo.isPrivate
                                ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        )}
                    >
                        {repo.isPrivate ? (
                            <>
                                <Lock className="size-3" />
                                Private
                            </>
                        ) : (
                            <>
                                <Unlock className="size-3" />
                                Public
                            </>
                        )}
                    </span>
                ),
            },
            {
                id: "language",
                header: "Language",
                sortable: true,
                sortKey: (r) => r.language ?? "",
                cell: (repo) => <LanguageBadge language={repo.language} />,
            },
            {
                id: "status",
                header: "Index Status",
                sortable: true,
                sortKey: (r) => r.indexStatus,
                cell: (repo) => (
                    <RepoStatus
                        status={repo.indexStatus}
                        filesProcessed={repo.filesProcessed}
                        filesTotal={repo.filesTotal}
                    />
                ),
            },
            {
                id: "stats",
                header: "Chunks / Files",
                sortable: true,
                sortKey: (r) => r.chunkCount,
                cell: (repo) => (
                    <div className="text-xs text-muted-foreground">
                        {repo.indexStatus === "READY" ? (
                            <span className="font-medium text-foreground">
                                {repo.chunkCount.toLocaleString()} chunks{" "}
                                <span className="text-muted-foreground font-normal">
                                    ({repo.filesTotal} files)
                                </span>
                            </span>
                        ) : (
                            <span>—</span>
                        )}
                    </div>
                ),
            },
            {
                id: "actions",
                header: "Actions",
                className: "text-right",
                headerClassName: "text-right",
                cell: (repo) => (
                    <div className="flex items-center justify-end gap-2">
                        {repo.htmlUrl && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="size-8 p-0"
                                nativeButton={false}
                                render={
                                    <a
                                        href={repo.htmlUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="View on GitHub"
                                    />
                                }
                            >
                                <ExternalLink className="size-3.5 text-muted-foreground" />
                            </Button>
                        )}
                        {repo.indexStatus === "READY" ? (
                            <Button
                                size="sm"
                                className="h-8 rounded-xl px-3 text-xs"
                                nativeButton={false}
                                render={<Link href={`/chat/${repo.id}`} />}
                            >
                                <MessageSquare className="mr-1.5 size-3.5" />
                                Chat
                            </Button>
                        ) : repo.indexStatus === "INDEXING" ? (
                            <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 rounded-xl px-3 text-xs"
                                nativeButton={false}
                                render={<Link href={`/dashboard/repos/${repo.id}/indexing`} />}
                            >
                                <RefreshCw className="mr-1.5 size-3.5 animate-spin" />
                                Status
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                variant={repo.indexStatus === "FAILED" ? "outline" : "default"}
                                onClick={() => handleStartIndexing(repo.id)}
                                disabled={
                                    startIndexing.isPending &&
                                    startIndexing.variables === repo.id
                                }
                                className="h-8 rounded-xl px-3 text-xs"
                            >
                                <Zap className="mr-1.5 size-3.5" />
                                {repo.indexStatus === "FAILED" ? "Retry" : "Index"}
                            </Button>
                        )}
                    </div>
                ),
            },
        ],
        [startIndexing, handleStartIndexing]
    );

    const readyCount = useMemo(
        () => repos?.filter((r) => r.indexStatus === "READY").length ?? 0,
        [repos]
    );

    const headerDescription = repos
        ? `${repos.length} connected · ${readyCount} indexed & ready`
        : undefined;

    return (
        <AppShell
            title="Repositories"
            description={headerDescription}
            actions={
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={refreshRepos.isPending}
                    className="rounded-xl shadow-2xs"
                >
                    <RefreshCw
                        className={cn("size-3.5 mr-1.5", refreshRepos.isPending && "animate-spin")}
                    />
                    Sync GitHub
                </Button>
            }
        >
            <div className="flex flex-col flex-1 min-h-0">
                {/* ── Advanced Filters ─────────────────────────────────────── */}
                <RepoFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    availableLanguages={availableLanguages}
                    onReset={handleResetFilters}
                    hasActiveFilters={hasActiveFilters}
                />

                {/* ── Error state ─────────────────────────────────────────── */}
                {isError && !isLoading && (
                    <div className="mb-4 flex items-center justify-between rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="size-4 shrink-0" />
                            <span>Failed to load repositories from server.</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="h-7 text-xs border-destructive/40"
                        >
                            Retry
                        </Button>
                    </div>
                )}

                {/* ── Loading Skeleton ────────────────────────────────────── */}
                {isLoading && (
                    filters.viewMode === "grid" ? (
                        <RepoGridSkeleton count={6} />
                    ) : (
                        <DataTable
                            data={[]}
                            columns={tableColumns}
                            keyExtractor={(r) => r.id}
                            isLoading={true}
                            selectable={true}
                        />
                    )
                )}

                {/* ── Empty State: Zero Repos ─────────────────────────────── */}
                {!isLoading && repos && repos.length === 0 && (
                    <EmptyState
                        icon={FolderGit2}
                        title="No repositories found"
                        description="Connect and sync your GitHub repositories to start building your AI knowledge base."
                        actionLabel="Sync repositories now"
                        onAction={handleRefresh}
                        actionLoading={refreshRepos.isPending}
                    />
                )}

                {/* ── Empty State: Filters matched nothing ────────────────── */}
                {!isLoading && repos && repos.length > 0 && filteredRepos.length === 0 && (
                    <EmptyState
                        icon={FolderGit2}
                        title="No matching repositories"
                        description="No repositories match your active search and filter conditions."
                        actionLabel="Clear all filters"
                        onAction={handleResetFilters}
                    />
                )}

                {/* ── Data Content: Grid View ─────────────────────────────── */}
                {!isLoading && filteredRepos.length > 0 && filters.viewMode === "grid" && (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 pb-20">
                        {filteredRepos.map((repo) => (
                            <RepoCard
                                key={repo.id}
                                repo={repo}
                                onStartIndexing={handleStartIndexing}
                                isIndexingLoading={
                                    startIndexing.isPending &&
                                    startIndexing.variables === repo.id
                                }
                                isSelected={selectedIds.has(repo.id)}
                                onToggleSelect={handleToggleSelectCard}
                            />
                        ))}
                    </div>
                )}

                {/* ── Data Content: Reusable Data Table View ──────────────── */}
                {!isLoading && filteredRepos.length > 0 && filters.viewMode === "table" && (
                    <div className="pb-20">
                        <DataTable
                            data={filteredRepos}
                            columns={tableColumns}
                            keyExtractor={(r) => r.id}
                            selectable={true}
                            selectedIds={selectedIds}
                            onSelectionChange={setSelectedIds}
                            pageSize={10}
                        />
                    </div>
                )}

                {/* ── Bulk Actions Floating Toolbar ───────────────────────── */}
                <BulkActionsBar
                    selectedIds={selectedIds}
                    onClearSelection={() => setSelectedIds(new Set())}
                    repos={repos ?? []}
                />
            </div>
        </AppShell>
    );
}
