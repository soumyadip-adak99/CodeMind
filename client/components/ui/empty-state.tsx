"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface EmptyStateProps {
    icon: React.ElementType;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    actionLoading?: boolean;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
    className?: string;
    children?: React.ReactNode;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    actionLoading = false,
    secondaryActionLabel,
    onSecondaryAction,
    className,
    children,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/80 bg-card/30 p-8 text-center sm:p-12 transition-all",
                className
            )}
        >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/80 ring-8 ring-muted/30 shadow-xs">
                <Icon className="size-7 text-muted-foreground" />
            </div>

            <div className="max-w-md space-y-1.5">
                <h3 className="font-semibold text-base sm:text-lg tracking-tight text-foreground">{title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>

            {(actionLabel || secondaryActionLabel || children) && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    {actionLabel && onAction && (
                        <Button
                            size="sm"
                            onClick={onAction}
                            disabled={actionLoading}
                            className="rounded-xl px-4 font-medium"
                        >
                            {actionLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                            {actionLabel}
                        </Button>
                    )}

                    {secondaryActionLabel && onSecondaryAction && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onSecondaryAction}
                            disabled={actionLoading}
                            className="rounded-xl px-4"
                        >
                            {secondaryActionLabel}
                        </Button>
                    )}

                    {children}
                </div>
            )}
        </div>
    );
}

