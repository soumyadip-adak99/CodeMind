"use client";

import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    className?: string;
}

export function DashboardHeader({ title, description, actions, className }: DashboardHeaderProps) {
    return (
        <div className={cn("flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between", className)}>
            <div className="space-y-0.5">
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </div>
            {actions && (
                <div className="flex shrink-0 items-center gap-2 mt-2 sm:mt-0">{actions}</div>
            )}
        </div>
    );
}
