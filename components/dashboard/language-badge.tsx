"use client";

import { cn } from "@/lib/utils";

const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Java: "#b07219",
    Kotlin: "#A97BFF",
    Rust: "#dea584",
    Go: "#00ADD8",
    "C#": "#178600",
    "C++": "#f34b7d",
    C: "#555555",
    Ruby: "#701516",
    PHP: "#4F5D95",
    Swift: "#F05138",
    Dart: "#00B4AB",
    Scala: "#c22d40",
    Elixir: "#6e4a7e",
    Haskell: "#5e5086",
    Lua: "#000080",
    Shell: "#89e051",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Vue: "#41b883",
    Svelte: "#ff3e00",
};

const DEFAULT_COLOR = "#8b949e"; // GitHub's default muted gray

interface LanguageBadgeProps {
    language: string | null | undefined;
    className?: string;
    dotOnly?: boolean;
}

export function LanguageBadge({ language, className, dotOnly = false }: LanguageBadgeProps) {
    if (!language) return null;

    const hexColor = LANGUAGE_COLORS[language] ?? DEFAULT_COLOR;

    return (
        <span
            className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}
        >
            <span
                className="size-2.5 shrink-0 rounded-full ring-1 ring-border/50"
                style={{ backgroundColor: hexColor }}
                aria-hidden="true"
            />
            {!dotOnly && <span>{language}</span>}
        </span>
    );
}
