"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DataTableSkeletonProps {
    columns?: number;
    rows?: number;
    showCheckbox?: boolean;
}

export function DataTableSkeleton({
    columns = 5,
    rows = 6,
    showCheckbox = true,
}: DataTableSkeletonProps) {
    return (
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-xs">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30">
                        {showCheckbox && (
                            <TableHead className="w-12 px-4">
                                <Skeleton className="size-4 rounded" />
                            </TableHead>
                        )}
                        {Array.from({ length: columns }).map((_, i) => (
                            <TableHead key={i} className="py-3 px-4">
                                <Skeleton className="h-4 w-20" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: rows }).map((_, r) => (
                        <TableRow key={r} className="border-b">
                            {showCheckbox && (
                                <TableCell className="px-4 py-3.5">
                                    <Skeleton className="size-4 rounded" />
                                </TableCell>
                            )}
                            {Array.from({ length: columns }).map((_, c) => (
                                <TableCell key={c} className="px-4 py-3.5">
                                    <Skeleton
                                        className="h-4 rounded"
                                        style={{
                                            width: `${Math.max(40, ((c + r * 3) % 4) * 20 + 50)}%`,
                                        }}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

