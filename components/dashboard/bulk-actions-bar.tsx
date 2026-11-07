"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useBulkIndexRepos } from "@/hooks/use-repo";
import { Repository } from "@/@type";
import { CheckSquare, Loader2, Sparkles, X, Zap } from "lucide-react";

interface BulkActionsBarProps {
    selectedIds: Set<string>;
    onClearSelection: () => void;
    repos: Repository[];
}

export function BulkActionsBar({
    selectedIds,
    onClearSelection,
    repos,
}: BulkActionsBarProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const bulkIndex = useBulkIndexRepos();

    if (selectedIds.size === 0) return null;

    const selectedRepos = repos.filter((r) => selectedIds.has(r.id));
    const alreadyReadyOrIndexing = selectedRepos.filter(
        (r) => r.indexStatus === "READY" || r.indexStatus === "INDEXING"
    );

    const handleIndexClick = () => {
        // If some repositories are already indexed, require confirmation before clearing and re-indexing
        if (alreadyReadyOrIndexing.length > 0) {
            setConfirmOpen(true);
        } else {
            executeBulkIndex();
        }
    };

    const executeBulkIndex = () => {
        bulkIndex.mutate(Array.from(selectedIds), {
            onSettled: () => {
                onClearSelection();
                setConfirmOpen(false);
            },
        });
    };

    return (
        <>
            <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 flex items-center gap-3 rounded-2xl border border-border/80 bg-background/95 px-4 py-2.5 shadow-2xl backdrop-blur-md ring-1 ring-black/5 dark:ring-white/10 animate-in fade-in slide-in-from-bottom-4 duration-200">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px]">
                        {selectedIds.size}
                    </span>
                    <span>selected</span>
                </div>

                <div className="h-4 w-px bg-border" />

                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        onClick={handleIndexClick}
                        disabled={bulkIndex.isPending}
                        className="rounded-xl h-8 px-3 text-xs"
                    >
                        {bulkIndex.isPending ? (
                            <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                        ) : (
                            <Zap className="mr-1.5 size-3.5" />
                        )}
                        Index {selectedIds.size} {selectedIds.size === 1 ? "Repo" : "Repos"}
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearSelection}
                        disabled={bulkIndex.isPending}
                        className="rounded-xl h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                        <X className="mr-1 size-3.5" />
                        Deselect
                    </Button>
                </div>
            </div>

            {/* Confirmation Dialog for Destructive Action Protection */}
            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Re-index selected repositories?"
                description={`${alreadyReadyOrIndexing.length} of the ${selectedIds.size} selected repositories are already indexed or currently indexing. Re-indexing will clear their existing vector embeddings and re-process all files from scratch.`}
                confirmText="Yes, re-index all"
                variant="destructive"
                isPending={bulkIndex.isPending}
                onConfirm={executeBulkIndex}
            />
        </>
    );
}

