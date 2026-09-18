"use client";

import Link from "next/link";
import { ExternalLink, GitBranch, Lock, MessageSquare, RefreshCw, Unlock, Zap, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Repository } from "@/@type";
import { LanguageBadge } from "./language-badge";
import { RepoStatus } from "./repo-status";
import { IndexErrorAlert } from "./index-error-alert";

interface RepoCardProps {
    repo: Repository;
    onStartIndexing: (repoId: string) => void;
    isIndexingLoading?: boolean;
    className?: string;
}

export function RepoCard({ repo, onStartIndexing, isIndexingLoading, className }: RepoCardProps) {
    const isReady = repo.indexStatus === "READY";
    const isIndexing = repo.indexStatus === "INDEXING";
    const isFailed = repo.indexStatus === "FAILED";
    const isPending = repo.indexStatus === "PENDING";

    return (
        <div
            className={cn(
                "group relative flex flex-col gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border/80 hover:shadow-md",
                className
            )}
        >
            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-1 items-start gap-3 min-w-0">
                    <Avatar className="size-9 border bg-muted">
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
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <LanguageBadge language={repo.language} />

                <span className="flex items-center gap-1">
                    <GitBranch className="size-3" />
                    {repo.defaultBranch}
                </span>

                <span className="flex items-center gap-1">
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
                {/* GitHub Link Button on Left */}
                {repo.htmlUrl ? (
                    <Button
                        variant="secondary"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground shrink-0"
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
                {/* Primary Action Button on Right */}
                <div className="flex shrink-0">
                    {isReady ? (
                        <Button
                            size="sm"
                            nativeButton={false}
                            render={<Link href={`/chat/${repo.id}`} />}
                        >
                            <MessageSquare className="size-3.5 mr-1.5" />
                            Chat with code
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            variant={isFailed ? "outline" : "default"}
                            disabled={isIndexing || isIndexingLoading}
                            onClick={() => onStartIndexing(repo.id)}
                        >
                            {isIndexing ? (
                                <>
                                    <RefreshCw className="size-3.5 mr-1.5 animate-spin" />
                                    Indexing...
                                </>
                            ) : isFailed ? (
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
        </div>
    );
}
