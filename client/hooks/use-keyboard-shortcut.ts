"use client";

import { useEffect } from "react";

export interface ShortcutConfig {
    key: string;
    ctrlOrCmd?: boolean;
    shift?: boolean;
    alt?: boolean;
    description: string;
    category?: "General" | "Navigation" | "Actions";
    action: () => void;
    allowInInputs?: boolean;
}

export function useKeyboardShortcut(
    shortcuts: ShortcutConfig[],
    enabled = true
) {
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const isInput =
                target?.tagName === "INPUT" ||
                target?.tagName === "TEXTAREA" ||
                target?.isContentEditable;

            for (const shortcut of shortcuts) {
                if (isInput && !shortcut.allowInInputs) {
                    continue;
                }

                const matchesKey =
                    event.key.toLowerCase() === shortcut.key.toLowerCase();
                const matchesModifier =
                    shortcut.ctrlOrCmd ? event.metaKey || event.ctrlKey : true;
                const matchesShift =
                    shortcut.shift ? event.shiftKey : !event.shiftKey;
                const matchesAlt = shortcut.alt ? event.altKey : !event.altKey;

                if (shortcut.ctrlOrCmd && !(event.metaKey || event.ctrlKey)) {
                    continue;
                }

                if (matchesKey && matchesModifier && matchesShift && matchesAlt) {
                    event.preventDefault();
                    shortcut.action();
                    break;
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [shortcuts, enabled]);
}

