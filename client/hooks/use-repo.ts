"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Repository } from "@/@type";
import { toast } from "@/components/ui/toast";
import { queryKeys } from "@/lib/query-keys";

const INDEXING_POLL_MS = 2000;

function hasIndexingRepos(repos: Repository[] | undefined) {
    return repos?.some((repo) => repo.indexStatus === "INDEXING") ?? false;
}

function updateRepoInListCache(queryClient: ReturnType<typeof useQueryClient>, repo: Repository) {
    queryClient.setQueryData<Repository[]>(queryKeys.repos.list(), (current) => {
        if (!current) return current;
        return current.map((item) => (item.id === repo.id ? repo : item));
    });
}

export function useRepos() {
    return useQuery({
        queryKey: queryKeys.repos.list(),
        queryFn: async () => {
            const repos = await api.listRepos(false);
            if (repos.length <= 0) {
                return api.listRepos(true);
            }
            return repos;
        },

        staleTime: 30_000,
        refetchInterval: (query) => (hasIndexingRepos(query.state.data) ? INDEXING_POLL_MS : false),
    });
}

export function useRepo(id: string) {
    return useQuery({
        queryKey: queryKeys.repos.detail(id),
        queryFn: () => api.getRepo(id),
        enabled: Boolean(id),
    });
}

export function useIndexStatus(repoId: string, enabled = false) {
    return useQuery({
        queryKey: queryKeys.repos.status(repoId),
        queryFn: () => api.indexStatus(repoId),
        enabled: Boolean(repoId) && enabled,
        refetchInterval: (query) => (query.state.data?.indexStatus === "INDEXING" ? 1500 : false),
    });
}

export function useStartIndexing() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (repoId: string) => api.startIndex(repoId),
        // ── 1. Optimistic UI update with rollback snapshot ──
        onMutate: async (repoId: string) => {
            // Cancel outgoing refetches so they don't overwrite our optimistic update
            await queryClient.cancelQueries({ queryKey: queryKeys.repos.list() });
            await queryClient.cancelQueries({ queryKey: queryKeys.repos.detail(repoId) });
            await queryClient.cancelQueries({ queryKey: queryKeys.repos.status(repoId) });

            const previousRepos = queryClient.getQueryData<Repository[]>(queryKeys.repos.list());
            const previousDetail = queryClient.getQueryData<Repository>(queryKeys.repos.detail(repoId));
            const previousStatus = queryClient.getQueryData(queryKeys.repos.status(repoId));

            // Optimistically update list in cache
            if (previousRepos) {
                queryClient.setQueryData<Repository[]>(
                    queryKeys.repos.list(),
                    previousRepos.map((repo) =>
                        repo.id === repoId
                            ? {
                                  ...repo,
                                  indexStatus: "INDEXING",
                                  errorMessage: null,
                              }
                            : repo
                    )
                );
            }

            // Optimistically update detail
            if (previousDetail) {
                queryClient.setQueryData<Repository>(queryKeys.repos.detail(repoId), {
                    ...previousDetail,
                    indexStatus: "INDEXING",
                    errorMessage: null,
                });
            }

            // Optimistically set status
            queryClient.setQueryData(queryKeys.repos.status(repoId), {
                repositoryId: repoId,
                indexStatus: "INDEXING",
                filesProcessed: 0,
                filesTotal: previousDetail?.filesTotal ?? 0,
                chunkCount: 0,
                indexedAt: null,
                errorMessage: null,
            });

            return { previousRepos, previousDetail, previousStatus, repoId };
        },
        onSuccess: (repo) => {
            queryClient.setQueryData(queryKeys.repos.detail(repo.id), repo);
            updateRepoInListCache(queryClient, repo);
            queryClient.setQueryData(queryKeys.repos.status(repo.id), {
                repositoryId: repo.id,
                indexStatus: repo.indexStatus,
                filesProcessed: repo.filesProcessed,
                filesTotal: repo.filesTotal,
                chunkCount: repo.chunkCount,
                indexedAt: repo.indexedAt,
                errorMessage: repo.errorMessage,
            });
            toast.add({
                title: "Indexing started",
                description: `Indexing ${repo.fullName}...`,
                type: "loading",
            });
        },
        onError: (error: Error, repoId, context) => {
            // ── Rollback cache on failure ──
            if (context?.previousRepos) {
                queryClient.setQueryData(queryKeys.repos.list(), context.previousRepos);
            }
            if (context?.previousDetail) {
                queryClient.setQueryData(queryKeys.repos.detail(repoId), context.previousDetail);
            }
            if (context?.previousStatus) {
                queryClient.setQueryData(queryKeys.repos.status(repoId), context.previousStatus);
            }
            toast.add({
                title: "Could not start indexing",
                description: error.message || "Failed to start indexing repository",
                type: "error",
            });
        },
        onSettled: (_, __, repoId) => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.repos.status(repoId) });
            void queryClient.invalidateQueries({ queryKey: queryKeys.repos.list() });
        },
    });
}

export function useBulkIndexRepos() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (repoIds: string[]) => {
            const results = await Promise.allSettled(repoIds.map((id) => api.startIndex(id)));
            const successful = results.filter((r) => r.status === "fulfilled").length;
            const failed = results.filter((r) => r.status === "rejected").length;
            return { total: repoIds.length, successful, failed };
        },
        onMutate: async (repoIds: string[]) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.repos.list() });
            const previousRepos = queryClient.getQueryData<Repository[]>(queryKeys.repos.list());

            if (previousRepos) {
                const idSet = new Set(repoIds);
                queryClient.setQueryData<Repository[]>(
                    queryKeys.repos.list(),
                    previousRepos.map((repo) =>
                        idSet.has(repo.id)
                            ? { ...repo, indexStatus: "INDEXING", errorMessage: null }
                            : repo
                    )
                );
            }

            return { previousRepos };
        },
        onSuccess: (data) => {
            toast.add({
                title: "Bulk indexing initiated",
                description: `Queued ${data.successful} of ${data.total} repositories for indexing`,
                type: data.failed > 0 ? "warning" : "success",
            });
        },
        onError: (err: Error, _, context) => {
            if (context?.previousRepos) {
                queryClient.setQueryData(queryKeys.repos.list(), context.previousRepos);
            }
            toast.add({
                title: "Bulk indexing failed",
                description: err.message,
                type: "error",
            });
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.repos.list() });
        },
    });
}

export function useRefreshRepos() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () =>
            toast.promise(api.listRepos(true), {
                loading: {
                    title: "Syncing repositories",
                    description: "Fetching the latest repos from GitHub...",
                    type: "loading",
                },
                success: (repos) => ({
                    title: "Sync successful",
                    description: `${repos.length} repositories loaded`,
                    type: "success",
                }),
                error: (error: Error) => ({
                    title: "Sync failed",
                    description:
                        error instanceof Error ? error.message : "Could not sync repositories",
                    type: "error",
                }),
            }),
        onSuccess: (repos) => {
            queryClient.setQueryData(queryKeys.repos.list(), repos);
        },
    });
}

export function getRepoProgress(repo: Pick<Repository, "filesProcessed" | "filesTotal">) {
    if (!repo.filesTotal) return 0;
    return Math.min(100, Math.round((repo.filesProcessed / repo.filesTotal) * 100));
}
