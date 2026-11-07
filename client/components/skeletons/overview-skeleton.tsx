"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function OverviewSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-4 w-60" />
            </div>

            {/* Stat cards grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-3 rounded-2xl border bg-card p-5">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="size-8 rounded-xl" />
                        </div>
                        <Skeleton className="h-8 w-16" />
                    </div>
                ))}
            </div>

            {/* Table skeleton */}
            <div className="rounded-2xl border bg-card p-5 space-y-4">
                <Skeleton className="h-5 w-40" />
                <div className="divide-y">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-5 rounded" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                            <Skeleton className="h-4 w-28" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

