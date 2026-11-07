"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function RepoCardSkeleton() {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-xs">
            {/* Header: avatar, title, status */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="size-9 rounded-full" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>

            {/* Meta row: language, branch, visibility */}
            <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-3 w-14" />
            </div>

            {/* Bottom action row */}
            <div className="mt-auto flex items-center justify-between pt-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-28 rounded-lg" />
            </div>
        </div>
    );
}

export function RepoGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <RepoCardSkeleton key={i} />
            ))}
        </div>
    );
}

