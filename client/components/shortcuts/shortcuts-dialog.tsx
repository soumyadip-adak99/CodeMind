"use client";

import React, { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useUIStore } from "@/store/ui-store";
import { Kbd } from "@/components/ui/kbd";
import { Command, Keyboard } from "lucide-react";

interface ShortcutItem {
    keys: string[];
    description: string;
}

interface ShortcutCategory {
    title: string;
    shortcuts: ShortcutItem[];
}

const SHORTCUT_CATEGORIES: ShortcutCategory[] = [
    {
        title: "Global & Navigation",
        shortcuts: [
            { keys: ["⌘ / Ctrl", "K"], description: "Open Command Palette" },
            { keys: ["⌘ / Ctrl", "B"], description: "Toggle Sidebar navigation" },
            { keys: ["?"], description: "Show Keyboard Shortcuts reference" },
            { keys: ["Esc"], description: "Close open dialog, palette, or menu" },
        ],
    },
    {
        title: "Quick Navigation Chords",
        shortcuts: [
            { keys: ["G", "D"], description: "Go to Repositories Dashboard" },
            { keys: ["G", "O"], description: "Go to Overview" },
            { keys: ["G", "S"], description: "Go to Settings" },
        ],
    },
    {
        title: "Repositories & Data Table",
        shortcuts: [
            { keys: ["⌘ / Ctrl", "Shift", "R"], description: "Sync repositories from GitHub" },
            { keys: ["/"], description: "Focus repository search field" },
            { keys: ["Tab"], description: "Navigate between filters and records" },
            { keys: ["Space"], description: "Select / Deselect focused row" },
        ],
    },
    {
        title: "Chat & AI Queries",
        shortcuts: [
            { keys: ["Enter"], description: "Send message" },
            { keys: ["Shift", "Enter"], description: "Insert new line in composer" },
            { keys: ["⌘ / Ctrl", "Enter"], description: "Submit multiline query" },
        ],
    },
];

export function ShortcutsDialog() {
    const { shortcutsDialogOpen, setShortcutsDialogOpen, toggleShortcutsDialog } = useUIStore();

    // Listen for ? key when not focused in input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            const isInput =
                target?.tagName === "INPUT" ||
                target?.tagName === "TEXTAREA" ||
                target?.isContentEditable;

            if (isInput) return;

            if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                toggleShortcutsDialog();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleShortcutsDialog]);

    return (
        <Dialog open={shortcutsDialogOpen} onOpenChange={setShortcutsDialogOpen}>
            <DialogContent className="max-w-lg p-6">
                <DialogHeader className="flex flex-row items-center gap-3 space-y-0 pb-4 border-b">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Keyboard className="size-5" />
                    </div>
                    <div>
                        <DialogTitle className="text-lg font-semibold">Keyboard Shortcuts</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Supercharge your CodeMind workflow with quick keyboard actions
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="flex flex-col gap-5 py-4 max-h-[60vh] overflow-y-auto pr-1">
                    {SHORTCUT_CATEGORIES.map((category) => (
                        <div key={category.title} className="space-y-2">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {category.title}
                            </h4>
                            <div className="rounded-xl border border-border/60 bg-muted/20 divide-y divide-border/40">
                                {category.shortcuts.map((shortcut, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between px-3.5 py-2.5 text-xs"
                                    >
                                        <span className="text-foreground/90 font-medium">
                                            {shortcut.description}
                                        </span>
                                        <div className="flex items-center gap-1 shrink-0">
                                            {shortcut.keys.map((k, kIdx) => (
                                                <React.Fragment key={kIdx}>
                                                    <kbd className="inline-flex h-5 items-center justify-center gap-1 rounded border border-border/80 bg-background px-1.5 font-mono text-[11px] font-semibold text-foreground shadow-xs">
                                                        {k === "⌘ / Ctrl" ? (
                                                            <span className="inline-flex items-center gap-1">
                                                                <Command className="size-3 shrink-0" />
                                                                <span className="text-[10px] text-muted-foreground">/</span>
                                                                <span>Ctrl</span>
                                                            </span>
                                                        ) : (
                                                            k
                                                        )}
                                                    </kbd>
                                                    {kIdx < shortcut.keys.length - 1 && (
                                                        <span className="text-[10px] text-muted-foreground">
                                                            +
                                                        </span>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

