"use client";

import { memo, useState, useCallback } from "react";
import { Check, Copy, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "cn";
import { ChatMessage } from "@/@type";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CodeMindIcon } from "@/components/icons/code-mind";
import { ChatMarkdown } from "./chat-markdown";
import { CitationChips } from "./citation-chips";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Skeleton placeholder ─────────────────────────────────────────────────────

export function MessageSkeleton() {
    return (
        <div className="flex gap-3 px-4 py-2">
            <Skeleton className="w-8 h-8 rounded-full shrink-0 mt-0.5" />
            <div className="flex flex-col gap-2 flex-1 max-w-lg">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
                <Skeleton className="h-4 w-4/6 rounded" />
            </div>
        </div>
    );
}

// ─── Action button with tooltip ───────────────────────────────────────────────

function ActionButton({
    label,
    onClick,
    children,
    className,
}: {
    label: string;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Tooltip>
            <TooltipTrigger
                aria-label={label}
                onClick={onClick}
                className={cn(
                    "p-1.5 rounded-lg transition-all duration-150",
                    "text-muted-foreground hover:text-foreground hover:bg-muted",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    className
                )}
            >
                {children}
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
                {label}
            </TooltipContent>
        </Tooltip>
    );
}

// ─── ThinkingIndicator ────────────────────────────────────────────────────────

export function ThinkingIndicator() {
    return (
        <div className="flex items-start gap-3 px-4 py-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white shadow-sm flex items-center justify-center shrink-0">
                <CodeMindIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-1 pt-1">
                <div className="flex items-center gap-1.5 py-1">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                            style={{ animationDelay: `${i * 150}ms` }}
                        />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">Thinking…</span>
                </div>
            </div>
        </div>
    );
}

// ─── MessageItem ──────────────────────────────────────────────────────────────

type PartialMessage =
    | ChatMessage
    | { role: "user" | "assistant"; content: string; citations?: never; createdAt?: never; id?: never; sessionId?: never };

interface MessageItemProps {
    message: PartialMessage;
    isStreamingMessage?: boolean;
    isLastAssistant?: boolean;
    onRegenerate?: () => void;
    repoHtmlUrl?: string | null;
    defaultBranch?: string;
}

export const MessageItem = memo(function MessageItem({
    message,
    isStreamingMessage,
    isLastAssistant,
    onRegenerate,
    repoHtmlUrl,
    defaultBranch,
}: MessageItemProps) {
    const isUser = message.role === "user";
    const [copied, setCopied] = useState(false);
    const [thumbed, setThumbed] = useState<"up" | "down" | null>(null);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* silently fail */
        }
    }, [message.content]);

    if (isUser) {
        return (
            <div className="flex justify-end px-4 py-2 group animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex flex-col items-end gap-1 max-w-[80%]">
                    <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm">
                        {message.content}
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150">
                        <ActionButton label={copied ? "Copied!" : "Copy message"} onClick={handleCopy}>
                            {copied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                                <Copy className="w-3.5 h-3.5" />
                            )}
                        </ActionButton>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Assistant message ───────────────────────────────────────────────────
    return (
        <div className="flex items-start gap-3 px-4 py-4 group animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Avatar */}
            <Avatar className="shrink-0 mt-0.5 w-8 h-8 shadow-sm">
                <AvatarFallback className="bg-blue-600 text-white">
                    <CodeMindIcon className="w-4 h-4" />
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1 flex-1 min-w-0 pt-1">
                {/* Content */}
                <div
                    aria-live={isStreamingMessage ? "polite" : undefined}
                    aria-atomic={isStreamingMessage ? "false" : undefined}
                    className="text-sm leading-relaxed text-foreground"
                >
                    <ChatMarkdown content={message.content} isStreaming={isStreamingMessage} />
                </div>

                {/* Sources */}
                {"citations" in message &&
                    message.citations &&
                    message.citations.length > 0 && (
                        <CitationChips
                            citations={message.citations}
                            repoHtmlUrl={repoHtmlUrl}
                            defaultBranch={defaultBranch}
                        />
                    )}

                {/* Actions row */}
                {!isStreamingMessage && (
                    <div className="flex items-center gap-0.5 mt-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150">
                        <ActionButton label={copied ? "Copied!" : "Copy response"} onClick={handleCopy}>
                            {copied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                                <Copy className="w-3.5 h-3.5" />
                            )}
                        </ActionButton>
                        {isLastAssistant && onRegenerate && (
                            <ActionButton label="Regenerate response" onClick={onRegenerate}>
                                <RotateCcw className="w-3.5 h-3.5" />
                            </ActionButton>
                        )}
                        <ActionButton
                            label="Helpful"
                            onClick={() => setThumbed((t) => (t === "up" ? null : "up"))}
                            className={thumbed === "up" ? "text-emerald-500" : ""}
                        >
                            <ThumbsUp className="w-3.5 h-3.5" />
                        </ActionButton>
                        <ActionButton
                            label="Not helpful"
                            onClick={() => setThumbed((t) => (t === "down" ? null : "down"))}
                            className={thumbed === "down" ? "text-destructive" : ""}
                        >
                            <ThumbsDown className="w-3.5 h-3.5" />
                        </ActionButton>
                    </div>
                )}
            </div>
        </div>
    );
});
