"use client";

import { cn } from "@/lib/utils";
import type { IndexStatus } from "@/@type";
import { CheckCircle, Clock, Loader2, XCircle } from "lucide-react";
import { Progress, ProgressLabel, ProgressTrack, ProgressIndicator, ProgressValue } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// ─── Config ────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
    IndexStatus,
    { label: string; icon: React.ElementType; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
    PENDING: { label: "Pending", icon: Clock, variant: "outline" },
    INDEXING: { label: "Indexing", icon: Loader2, variant: "secondary" },
    READY: { label: "Ready", icon: CheckCircle, variant: "default" },
    FAILED: { label: "Failed", icon: XCircle, variant: "destructive" },
};

// ─── Component ─────────────────────────────────────────────────────────────────

interface RepoStatusProps {
    status: IndexStatus;
    filesProcessed?: number;
    filesTotal?: number;
    /** Show progress bar when INDEXING */
    showProgress?: boolean;
    className?: string;
}

export function RepoStatus({
    status,
    filesProcessed = 0,
    filesTotal = 0,
    showProgress = true,
    className,
}: RepoStatusProps) {
    const { label, icon: Icon, variant } = STATUS_CONFIG[status];
    const isIndexing = status === "INDEXING";
    const progress = filesTotal > 0 ? Math.min(100, Math.round((filesProcessed / filesTotal) * 100)) : 0;

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <Badge
                variant={variant}
                className={cn(
                    "w-fit gap-1.5 px-2 py-0.5",
                    isIndexing && "text-amber-600 border-amber-300 bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:bg-amber-950/40"
                )}
            >
                <Icon className={cn("size-3", isIndexing && "animate-spin")} />
                {label}
            </Badge>

            {showProgress && isIndexing && filesTotal > 0 && (
                <Progress value={progress} className="gap-1">
                    <ProgressLabel className="text-xs text-muted-foreground">
                        {filesProcessed} / {filesTotal} files
                    </ProgressLabel>
                    <ProgressValue />
                    <ProgressTrack className="h-1.5">
                        <ProgressIndicator />
                    </ProgressTrack>
                </Progress>
            )}
        </div>
    );
}
