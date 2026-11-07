"use client";

import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "destructive" | "default";
    isPending?: boolean;
    onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = "Continue",
    cancelText = "Cancel",
    variant = "destructive",
    isPending = false,
    onConfirm,
}: ConfirmDialogProps) {
    const handleConfirm = async (e: React.MouseEvent) => {
        e.preventDefault();
        await onConfirm();
        if (!isPending) {
            onOpenChange(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        {variant === "destructive" && (
                            <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive shrink-0">
                                <AlertTriangle className="size-5" />
                            </div>
                        )}
                        <AlertDialogTitle className="text-lg font-semibold">{title}</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
                    <AlertDialogCancel disabled={isPending}>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isPending}
                        className={cn(
                            variant === "destructive" &&
                                "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive"
                        )}
                    >
                        {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

