"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PanelLeft, Menu, AlertCircle, Loader2, ChevronLeft } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { cn } from "cn";
import { Repository, IndexStatusResponse } from "@/@type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatHeaderProps {
    repo: Repository;
    indexStatus?: IndexStatusResponse;
    sidebarCollapsed: boolean;
    onToggleSidebar: () => void;
    onOpenMobileSheet: () => void;
}

function IndexBadge({ status }: { status: string }) {
    if (status === "READY") {
        return (
            <Badge
                variant="outline"
                className="text-xs border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 gap-1.5"
            >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                Indexed
            </Badge>
        );
    }
    if (status === "INDEXING") {
        return (
            <Badge
                variant="outline"
                className="text-xs border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 gap-1.5"
            >
                <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                Indexing…
            </Badge>
        );
    }
    if (status === "FAILED") {
        return (
            <Badge
                variant="outline"
                className="text-xs border-destructive/30 bg-destructive/10 text-destructive gap-1.5"
            >
                <AlertCircle className="w-3 h-3 shrink-0" />
                Failed
            </Badge>
        );
    }
    return (
        <Badge variant="outline" className="text-xs text-muted-foreground">
            Pending
        </Badge>
    );
}

export function ChatHeader({
    repo,
    indexStatus,
    sidebarCollapsed,
    onToggleSidebar,
    onOpenMobileSheet,
}: ChatHeaderProps) {
    const router = useRouter();
    const currentStatus = indexStatus?.indexStatus ?? repo.indexStatus;
    const chunkCount = indexStatus?.chunkCount ?? repo.chunkCount;
    const filesTotal = indexStatus?.filesTotal ?? repo.filesTotal;
    const isNotReady = currentStatus !== "READY";

    return (
        <div className="shrink-0 relative z-10 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm">
            {/* Main header bar */}
            <header className="flex items-center gap-3 px-4 min-h-[3.5rem] py-2">
                {/* Sidebar toggle – desktop */}
                <div className="hidden md:flex items-center shrink-0">
                    {sidebarCollapsed && (
                        <Tooltip>
                            <TooltipTrigger
                                aria-label="Open sidebar"
                                className="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                onClick={onToggleSidebar}
                            >
                                <PanelLeft className="w-4 h-4" />
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">
                                Open sidebar
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>

                {/* Mobile hamburger */}
                <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Open navigation"
                    className="md:hidden w-8 h-8 shrink-0"
                    onClick={onOpenMobileSheet}
                >
                    <Menu className="w-4 h-4" />
                </Button>

                {/* Back to repositories button */}
                <button
                    onClick={() => router.push("/dashboard")}
                    className="hidden md:flex items-center gap-1.5 px-2 h-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </button>

                {/* Divider */}
                <div className="hidden md:block w-px h-5 bg-border mx-1 shrink-0" />

                {/* Repo info */}
                <div className="flex flex-col min-w-0 flex-1 justify-center">
                    <div className="flex items-center gap-2 flex-wrap leading-none">
                        {repo.htmlUrl ? (
                            <a
                                href={repo.htmlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "text-sm font-semibold truncate flex items-center gap-1.5",
                                    "hover:text-primary transition-colors duration-150",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                                )}
                            >
                                {repo.fullName}
                            </a>
                        ) : (
                            <span className="text-sm font-semibold truncate">{repo.fullName}</span>
                        )}
                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5 font-medium rounded-sm leading-none flex items-center">
                            {repo.isPrivate ? "Private" : "Public"}
                        </Badge>
                        <IndexBadge status={currentStatus} />
                    </div>
                    {(filesTotal > 0 || chunkCount > 0) && (
                        <p className="text-xs text-muted-foreground truncate mt-1">
                            {filesTotal > 0 && `${filesTotal} files`}
                            {filesTotal > 0 && chunkCount > 0 && " · "}
                            {chunkCount > 0 && `${chunkCount} chunks`}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                    {repo.htmlUrl && (
                        <Tooltip>
                            <TooltipTrigger render={
                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-md" nativeButton={false} render={
                                    <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer" />
                                } />
                            }>
                                <FiGithub className="w-4 h-4" />
                                <span className="sr-only">View on GitHub</span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">
                                View on GitHub
                            </TooltipContent>
                        </Tooltip>
                    )}
                    <ModeToggle />
                </div>
            </header>

            {/* Inline alert when repo is not ready */}
            {isNotReady && (
                <Alert className="rounded-none border-x-0 border-t-0 border-b-0 bg-amber-500/5 py-2 px-4 shadow-inner">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className="text-xs text-amber-800 dark:text-amber-300 ml-2 flex items-center gap-1">
                        Chat is unavailable until the repository is indexed.{" "}
                        <Link
                            href="/dashboard"
                            className="underline font-medium underline-offset-2 hover:opacity-80 transition-opacity"
                        >
                            Go to repositories
                        </Link>{" "}
                        to check the status.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
