"use client";

import React, { useMemo, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ChevronUp,
    ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTableSkeleton } from "@/components/skeletons/data-table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { FolderSearch } from "lucide-react";

export type SortDirection = "asc" | "desc" | null;

export interface ColumnDef<T> {
    id: string;
    header: string | React.ReactNode;
    cell: (item: T) => React.ReactNode;
    sortable?: boolean;
    sortKey?: (item: T) => string | number | boolean;
    className?: string;
    headerClassName?: string;
}

export interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    keyExtractor: (item: T) => string;
    isLoading?: boolean;
    selectable?: boolean;
    selectedIds?: Set<string>;
    onSelectionChange?: (selectedIds: Set<string>) => void;
    pageSize?: number;
    pageSizeOptions?: number[];
    emptyTitle?: string;
    emptyDescription?: string;
    onEmptyAction?: () => void;
    emptyActionLabel?: string;
    className?: string;
}

export function DataTable<T>({
    data,
    columns,
    keyExtractor,
    isLoading = false,
    selectable = false,
    selectedIds = new Set<string>(),
    onSelectionChange,
    pageSize: initialPageSize = 10,
    pageSizeOptions = [10, 20, 50],
    emptyTitle = "No records found",
    emptyDescription = "There are no items to display matching your criteria.",
    onEmptyAction,
    emptyActionLabel,
    className,
}: DataTableProps<T>) {
    const [sortColumnId, setSortColumnId] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);

    // Sorting logic
    const handleSort = (column: ColumnDef<T>) => {
        if (!column.sortable) return;

        if (sortColumnId !== column.id) {
            setSortColumnId(column.id);
            setSortDirection("asc");
        } else if (sortDirection === "asc") {
            setSortDirection("desc");
        } else if (sortDirection === "desc") {
            setSortColumnId(null);
            setSortDirection(null);
        } else {
            setSortDirection("asc");
        }
    };

    const sortedData = useMemo(() => {
        if (!sortColumnId || !sortDirection) return data;
        const column = columns.find((col) => col.id === sortColumnId);
        if (!column) return data;

        const sortFn =
            column.sortKey ||
            ((item: T) => {
                const val = (item as any)[column.id];
                return val != null ? val : "";
            });

        return [...data].sort((a, b) => {
            const valA = sortFn(a);
            const valB = sortFn(b);

            if (valA == null && valB == null) return 0;
            if (valA == null) return sortDirection === "asc" ? -1 : 1;
            if (valB == null) return sortDirection === "asc" ? 1 : -1;

            if (typeof valA === "string" && typeof valB === "string") {
                const cmp = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: "base" });
                return sortDirection === "asc" ? cmp : -cmp;
            }

            if (valA < valB) return sortDirection === "asc" ? -1 : 1;
            if (valA > valB) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [data, sortColumnId, sortDirection, columns]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, currentPage, pageSize]);

    // Selection logic
    const currentPageKeys = useMemo(
        () => paginatedData.map(keyExtractor),
        [paginatedData, keyExtractor]
    );

    const isAllCurrentSelected =
        currentPageKeys.length > 0 &&
        currentPageKeys.every((key) => selectedIds.has(key));

    const isSomeCurrentSelected =
        currentPageKeys.some((key) => selectedIds.has(key)) && !isAllCurrentSelected;

    const handleSelectAll = (checked: boolean) => {
        if (!onSelectionChange) return;
        const newSelected = new Set(selectedIds);
        if (checked) {
            currentPageKeys.forEach((key) => newSelected.add(key));
        } else {
            currentPageKeys.forEach((key) => newSelected.delete(key));
        }
        onSelectionChange(newSelected);
    };

    const handleSelectRow = (key: string, checked: boolean) => {
        if (!onSelectionChange) return;
        const newSelected = new Set(selectedIds);
        if (checked) {
            newSelected.add(key);
        } else {
            newSelected.delete(key);
        }
        onSelectionChange(newSelected);
    };

    if (isLoading) {
        return (
            <DataTableSkeleton
                columns={columns.length}
                rows={pageSize > 10 ? 10 : pageSize}
                showCheckbox={selectable}
            />
        );
    }

    if (data.length === 0) {
        return (
            <EmptyState
                icon={FolderSearch}
                title={emptyTitle}
                description={emptyDescription}
                actionLabel={emptyActionLabel}
                onAction={onEmptyAction}
            />
        );
    }

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40 border-b">
                            {selectable && (
                                <TableHead className="w-12 px-4 text-center">
                                    <Checkbox
                                        checked={isAllCurrentSelected}
                                        indeterminate={isSomeCurrentSelected}
                                        onCheckedChange={(checked) =>
                                            handleSelectAll(Boolean(checked))
                                        }
                                        aria-label="Select all on this page"
                                    />
                                </TableHead>
                            )}
                            {columns.map((column) => {
                                const isSorted = sortColumnId === column.id;
                                return (
                                    <TableHead
                                        key={column.id}
                                        className={cn(
                                            "py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider",
                                            column.sortable &&
                                                "cursor-pointer select-none hover:text-foreground transition-colors",
                                            column.headerClassName
                                        )}
                                        onClick={() => handleSort(column)}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <span>{column.header}</span>
                                            {column.sortable && (
                                                <span className="shrink-0 text-muted-foreground/60">
                                                    {isSorted ? (
                                                        sortDirection === "asc" ? (
                                                            <ChevronUp className="size-3.5 text-foreground" />
                                                        ) : (
                                                            <ChevronDown className="size-3.5 text-foreground" />
                                                        )
                                                    ) : (
                                                        <ChevronsUpDown className="size-3.5 opacity-40 hover:opacity-100" />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((item) => {
                            const key = keyExtractor(item);
                            const isSelected = selectedIds.has(key);

                            return (
                                <TableRow
                                    key={key}
                                    data-state={isSelected ? "selected" : undefined}
                                    className={cn(
                                        "group border-b border-border/50 transition-colors hover:bg-muted/30",
                                        isSelected && "bg-muted/40"
                                    )}
                                >
                                    {selectable && (
                                        <TableCell className="w-12 px-4 text-center">
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={(checked) =>
                                                    handleSelectRow(key, Boolean(checked))
                                                }
                                                aria-label={`Select row ${key}`}
                                            />
                                        </TableCell>
                                    )}
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            className={cn("px-4 py-3 text-sm", column.className)}
                                        >
                                            {column.cell(item)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {data.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <span>
                            Showing{" "}
                            <span className="font-medium text-foreground">
                                {(currentPage - 1) * pageSize + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium text-foreground">
                                {Math.min(currentPage * pageSize, sortedData.length)}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium text-foreground">{sortedData.length}</span>{" "}
                            records
                        </span>

                        <div className="flex items-center gap-1.5 ml-2">
                            <span>Per page:</span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="h-7 rounded-md border border-input bg-background px-2 text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-ring"
                            >
                                {pageSizeOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="size-7 p-0"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            aria-label="First page"
                        >
                            <ChevronsLeft className="size-3.5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="size-7 p-0"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="size-3.5" />
                        </Button>
                        <span className="px-2 text-xs font-medium text-foreground">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="size-7 p-0"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage >= totalPages}
                            aria-label="Next page"
                        >
                            <ChevronRight className="size-3.5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="size-7 p-0"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage >= totalPages}
                            aria-label="Last page"
                        >
                            <ChevronsRight className="size-3.5" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
