"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Search, SlidersHorizontal, X, LayoutGrid, TableProperties } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { IndexStatus } from "@/@type";

export type VisibilityFilter = "all" | "public" | "private";
export type StatusFilter = "all" | "ready" | "indexing" | "new" | "failed";
export type SortOption = "name-asc" | "name-desc" | "chunks-desc" | "files-desc";
export type ViewMode = "grid" | "table";

export interface RepoFilterState {
    search: string;
    visibility: VisibilityFilter;
    status: StatusFilter;
    language: string;
    sort: SortOption;
    viewMode: ViewMode;
}

interface RepoFiltersProps {
    filters: RepoFilterState;
    onFilterChange: (filters: Partial<RepoFilterState>) => void;
    availableLanguages: string[];
    onReset: () => void;
    hasActiveFilters: boolean;
}

function FilterPill({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "inline-flex h-7 items-center rounded-full px-3 text-xs font-medium transition-colors select-none",
                active
                    ? "bg-foreground text-background shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
        >
            {label}
        </button>
    );
}

export function RepoFilters({
    filters,
    onFilterChange,
    availableLanguages,
    onReset,
    hasActiveFilters,
}: RepoFiltersProps) {
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Keyboard shortcut: Press "/" to focus search input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            const isInput =
                target?.tagName === "INPUT" ||
                target?.tagName === "TEXTAREA" ||
                target?.isContentEditable;

            if (!isInput && e.key === "/") {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="flex flex-col gap-4 pb-4">
            {/* ── Top Bar: Search, Language, Sort, View Toggle ────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Search input */}
                <div className="relative flex-1 min-w-[220px] max-w-md">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <input
                        ref={searchInputRef}
                        type="search"
                        placeholder="Search repositories... (press '/' to focus)"
                        value={filters.search}
                        onChange={(e) => onFilterChange({ search: e.target.value })}
                        className={cn(
                            "h-9 w-full rounded-xl border border-input bg-card/60 pl-9 pr-8 text-xs sm:text-sm outline-none",
                            "placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40 transition-all shadow-2xs"
                        )}
                    />
                    {filters.search && (
                        <button
                            type="button"
                            onClick={() => onFilterChange({ search: "" })}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>

                {/* Right controls: Language, Sort & View Mode */}
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Language Dropdown */}
                    {availableLanguages.length > 0 && (
                        <select
                            value={filters.language}
                            onChange={(e) => onFilterChange({ language: e.target.value })}
                            className="h-8 rounded-xl border border-input bg-card px-2.5 text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-ring"
                            aria-label="Filter by programming language"
                        >
                            <option value="all">All Languages</option>
                            {availableLanguages.map((lang) => (
                                <option key={lang} value={lang}>
                                    {lang}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Sort Dropdown */}
                    <select
                        value={filters.sort}
                        onChange={(e) => onFilterChange({ sort: e.target.value as SortOption })}
                        className="h-8 rounded-xl border border-input bg-card px-2.5 text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-ring"
                        aria-label="Sort repositories"
                    >
                        <option value="name-asc">Name (A → Z)</option>
                        <option value="name-desc">Name (Z → A)</option>
                        <option value="chunks-desc">Most Chunks</option>
                        <option value="files-desc">Most Files</option>
                    </select>

                    {/* View Switcher: Grid vs Table */}
                    <div className="flex items-center rounded-xl border border-input bg-card p-0.5">
                        <button
                            type="button"
                            onClick={() => onFilterChange({ viewMode: "grid" })}
                            className={cn(
                                "flex size-7 items-center justify-center rounded-lg transition-colors",
                                filters.viewMode === "grid"
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                            title="Grid view"
                            aria-label="Grid view"
                        >
                            <LayoutGrid className="size-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onFilterChange({ viewMode: "table" })}
                            className={cn(
                                "flex size-7 items-center justify-center rounded-lg transition-colors",
                                filters.viewMode === "table"
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                            title="Table view"
                            aria-label="Table view"
                        >
                            <TableProperties className="size-3.5" />
                        </button>
                    </div>

                    {/* Reset Filters button */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onReset}
                            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                        >
                            <X className="mr-1 size-3" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* ── Filter Pills: Visibility and Status ──────────────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
                {/* Visibility pills */}
                <div className="flex items-center gap-1">
                    <span className="mr-1 text-xs text-muted-foreground font-medium">Visibility:</span>
                    {(["all", "public", "private"] as VisibilityFilter[]).map((v) => (
                        <FilterPill
                            key={v}
                            label={v.charAt(0).toUpperCase() + v.slice(1)}
                            active={filters.visibility === v}
                            onClick={() => onFilterChange({ visibility: v })}
                        />
                    ))}
                </div>

                {/* Status pills */}
                <div className="flex items-center gap-1 flex-wrap">
                    <span className="mr-1 text-xs text-muted-foreground font-medium">Status:</span>
                    {(["all", "ready", "indexing", "new", "failed"] as StatusFilter[]).map((s) => (
                        <FilterPill
                            key={s}
                            label={s.charAt(0).toUpperCase() + s.slice(1)}
                            active={filters.status === s}
                            onClick={() => onFilterChange({ status: s })}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

