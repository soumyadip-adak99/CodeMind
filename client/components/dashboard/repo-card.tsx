"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, GitBranch, Lock, MessageSquare, RefreshCw, Unlock, Zap, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import type { Repository } from "@/@type";
import { LanguageBadge } from "./language-badge";
import { RepoStatus } from "./repo-status";
import { IndexErrorAlert } from "./index-error-alert";

interface RepoCardProps {
    repo: Repository;
    onStartIndexing: (repoId: string) => void;
    isIndexingLoading?: boolean;
    isSelected?: boolean;
    onToggleSelect?: (repoId: string) => void;
    className?: string;
}

export function RepoCard({
    repo,
    onStartIndexing,
    isIndexingLoading,
    isSelected = false,
    onToggleSelect,
    className,
}: RepoCardProps) {
    const [confirmReindexOpen, setConfirmReindexOpen] = useState(false);

    const isReady = repo.indexStatus === "READY";
    const isIndexing = repo.indexStatus === "INDEXING";
    const isFailed = repo.indexStatus === "FAILED";
    const isPending = repo.indexStatus === "PENDING";

    const handleIndexClick = () => {
        if (isReady) {
            setConfirmReindexOpen(true);
        } else {
            onStartIndexing(repo.id);
        }
    };

    return (
        <div
            className={cn(
                "group relative flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border/80 hover:shadow-md",
                isSelected ? "border-primary ring-2 ring-primary/20 bg-muted/20" : "border-border/50",
                className
            )}
        >
            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-1 items-start gap-3 min-w-0">
                    {onToggleSelect && (
                        <div className="pt-1.5 shrink-0">
                            <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => onToggleSelect(repo.id)}
                                aria-label={`Select ${repo.name}`}
                            />
                        </div>
                    )}
                    <Avatar className="size-9 border bg-muted shrink-0">
                        <AvatarImage src={`https://github.com/${repo.owner}.png`} alt={repo.owner} />
                        <AvatarFallback>
                            <FolderGit2 className="size-4 text-muted-foreground" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="truncate font-medium">{repo.owner}</span>
                        </div>
                        <h3 className="truncate font-semibold text-base leading-tight tracking-tight text-foreground/90 group-hover:text-foreground transition-colors">
                            {repo.name}
                        </h3>
                    </div>
                </div>

                {/* Status Badge in Top Right */}
                <div className="shrink-0 flex justify-end">
                    <RepoStatus
                        status={repo.indexStatus}
                        filesProcessed={repo.filesProcessed}
                        filesTotal={repo.filesTotal}
                        className="items-end"
                    />
                </div>
            </div>

            {/* ── Meta row ───────────────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
                <LanguageBadge language={repo.language} />

                <span className="flex items-center gap-1">
                    <GitBranch className="size-3" />
                    {repo.defaultBranch}
                </span>

                {/* Repository Permission / Visibility Tier Indicator */}
                <span
                    className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium border",
                        repo.isPrivate
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    )}
                >
                    {repo.isPrivate ? (
                        <>
                            <Lock className="size-2.5" />
                            Private
                        </>
                    ) : (
                        <>
                            <Unlock className="size-2.5" />
                            Public
                        </>
                    )}
                </span>

                {isReady && repo.chunkCount > 0 && (
                    <span className="flex items-center gap-1">
                        <Zap className="size-3 text-primary" />
                        {repo.chunkCount.toLocaleString()} chunks
                    </span>
                )}
            </div>

            {/* ── Error alert ────────────────────────────────────────────────── */}
            {isFailed && <IndexErrorAlert errorMessage={repo.errorMessage} repoName={repo.name} />}

            {/* ── Actions ────────────────────────────────────────────────────── */}
            <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                {repo.htmlUrl ? (
                    <Button
                        variant="secondary"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground shrink-0 rounded-xl"
                        nativeButton={false}
                        render={
                            <a
                                href={repo.htmlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            />
                        }
                    >
                        <FolderGit2 className="size-3.5 mr-1.5" />
                        GitHub
                        <ExternalLink className="size-3 ml-1.5 opacity-50" />
                    </Button>
                ) : (
                    <div />
                )}
                <div className="flex shrink-0">
                    {isReady ? (
                        <Button
                            size="sm"
                            className="rounded-xl shadow-xs"
                            nativeButton={false}
                            render={<Link href={`/chat/${repo.id}`} />}
                        >
                            <MessageSquare className="size-3.5 mr-1.5" />
                            Chat with code
                        </Button>
                    ) : isIndexing ? (
                        <Button
                            size="sm"
                            variant="secondary"
                            className="rounded-xl"
                            nativeButton={false}
                            render={<Link href={`/dashboard/repos/${repo.id}/indexing`} />}
                        >
                            <RefreshCw className="size-3.5 mr-1.5 animate-spin" />
                            View indexing status
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            variant={isFailed ? "outline" : "default"}
                            disabled={isIndexingLoading}
                            onClick={handleIndexClick}
                            className="rounded-xl"
                        >
                            {isFailed ? (
                                <>
                                    <RefreshCw className="size-3.5 mr-1.5" />
                                    Retry indexing
                                </>
                            ) : (
                                <>
                                    <Zap className="size-3.5 mr-1.5" />
                                    {isPending ? "Start indexing" : "Index repository"}
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>

            {/* Destructive Action Protection for Re-indexing */}
            <ConfirmDialog
                open={confirmReindexOpen}
                onOpenChange={setConfirmReindexOpen}
                title={`Re-index ${repo.name}?`}
                description="This repository has already been indexed into vectors. Re-indexing will delete all existing vector embeddings and re-embed all files from GitHub from scratch."
                confirmText="Re-index Repository"
                variant="destructive"
                isPending={isIndexingLoading}
                onConfirm={() => {
                    onStartIndexing(repo.id);
                    setConfirmReindexOpen(false);
                }}
            />
        </div>
    );
}
