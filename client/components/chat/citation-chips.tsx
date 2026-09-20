"use client";

import { useState } from "react";
import { Citation } from "@/@type";
import { FileCode2, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "cn";

interface CitationChipsProps {
    citations: Citation[];
    repoHtmlUrl?: string | null;
    defaultBranch?: string;
}

export function CitationChips({ citations, repoHtmlUrl, defaultBranch = "main" }: CitationChipsProps) {
    const [open, setOpen] = useState(false);

    if (!citations || citations.length === 0) return null;

    const buildUrl = (filePath: string) => {
        if (!repoHtmlUrl) return null;
        return `${repoHtmlUrl}/blob/${defaultBranch}/${filePath}`;
    };

    return (
        <div className="mt-4 pt-3 border-t border-border/50">
            <button
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className={cn(
                    "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground",
                    "transition-colors duration-150 mb-2 group"
                )}
            >
                {open ? (
                    <ChevronDown className="w-3.5 h-3.5 transition-transform" />
                ) : (
                    <ChevronRight className="w-3.5 h-3.5 transition-transform" />
                )}
                <span className="font-medium uppercase tracking-wider">
                    {citations.length} {citations.length === 1 ? "Source" : "Sources"}
                </span>
            </button>

            {open && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                    {citations.map((citation, i) => {
                        const filename = citation.filePath.split("/").pop() ?? citation.filePath;
                        const lineInfo =
                            citation.startLine != null
                                ? citation.endLine != null
                                    ? `:${citation.startLine}-${citation.endLine}`
                                    : `:${citation.startLine}`
                                : "";
                        const githubUrl = buildUrl(citation.filePath);

                        const chip = (
                            <span
                                className={cn(
                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs",
                                    "bg-muted/60 text-muted-foreground border border-border/60",
                                    "hover:bg-muted hover:text-foreground transition-colors"
                                )}
                                title={citation.filePath}
                            >
                                <FileCode2 className="w-3 h-3 shrink-0 text-primary/70" />
                                <span className="font-mono">
                                    {filename}
                                    {lineInfo && (
                                        <span className="text-muted-foreground/60">{lineInfo}</span>
                                    )}
                                </span>
                                {githubUrl && (
                                    <ExternalLink className="w-3 h-3 shrink-0 ml-0.5 opacity-50" />
                                )}
                            </span>
                        );

                        if (githubUrl) {
                            return (
                                <a
                                    key={i}
                                    href={githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Open ${citation.filePath} on GitHub`}
                                    className="cursor-pointer"
                                >
                                    {chip}
                                </a>
                            );
                        }

                        return <div key={i}>{chip}</div>;
                    })}
                </div>
            )}
        </div>
    );
}
