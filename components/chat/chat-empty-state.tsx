"use client";

import { cn } from "cn";
import {
    Network,
    ShieldAlert,
    List,
    Database,
    GitBranch,
    Lock,
} from "lucide-react";
import { CodeMindIcon } from "@/components/icons/code-mind";

interface SuggestionCard {
    icon: React.ElementType;
    text: string;
}

const SUGGESTIONS: SuggestionCard[] = [
    { icon: Network, text: "Explain the overall architecture" },
    { icon: Lock, text: "How does authentication work?" },
    { icon: List, text: "What are the main API endpoints?" },
    { icon: ShieldAlert, text: "Find potential security issues" },
    { icon: Database, text: "How is the database layer structured?" },
    { icon: GitBranch, text: "Where should I start contributing?" },
];

interface ChatEmptyStateProps {
    repoName: string;
    onSuggestionClick: (text: string) => void;
}

export function ChatEmptyState({ repoName, onSuggestionClick }: ChatEmptyStateProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
            {/* Hero logo tile */}
            <div className="relative mb-8">
                <div
                    className={cn(
                        "w-20 h-20 rounded-2xl flex items-center justify-center",
                        "bg-blue-600 text-white",
                        "shadow-lg shadow-blue-500/20 ring-1 ring-blue-500/50"
                    )}
                >
                    <CodeMindIcon className="w-10 h-10" />
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground max-w-sm mb-10 leading-relaxed">
                Ask me anything about{" "}
                <span className="font-semibold text-foreground">{repoName}</span>.
                I can explain code, trace bugs, and guide you through the architecture.
            </p>

            {/* Suggestion grid */}
            <div className="w-full max-w-2xl">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                    Suggested
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SUGGESTIONS.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <button
                                key={i}
                                onClick={() => onSuggestionClick(s.text)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3.5 rounded-xl text-left",
                                    "border border-border/70 bg-card",
                                    "hover:border-sidebar-primary/40 hover:bg-sidebar-primary/5",
                                    "text-sm text-muted-foreground hover:text-foreground",
                                    "transition-all duration-150 cursor-pointer",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    "group"
                                )}
                            >
                                <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-sidebar-primary/10 transition-colors duration-150">
                                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-sidebar-primary transition-colors duration-150" />
                                </span>
                                <span className="leading-snug">{s.text}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
