"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "cn";
import { ChatMessage } from "@/@type";
import { MessageItem, MessageSkeleton, ThinkingIndicator } from "./message-item";
import { Button } from "@/components/ui/button";

interface MessageListProps {
    messages: ChatMessage[];
    isLoading: boolean;
    isStreaming: boolean;
    streamingContent: string;
    onRegenerate?: () => void;
    repoHtmlUrl?: string | null;
    defaultBranch?: string;
}

export function MessageList({
    messages,
    isLoading,
    isStreaming,
    streamingContent,
    onRegenerate,
    repoHtmlUrl,
    defaultBranch,
}: MessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [userScrolledUp, setUserScrolledUp] = useState(false);
    const isAtBottomRef = useRef(true);

    // Detect user scroll-up
    const handleScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        const atBottom = distFromBottom < 80;
        isAtBottomRef.current = atBottom;
        setUserScrolledUp(!atBottom);
    }, []);

    // Auto-scroll when new content arrives
    useEffect(() => {
        if (isAtBottomRef.current) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages.length, streamingContent]);

    const scrollToBottom = useCallback(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        setUserScrolledUp(false);
    }, []);

    // Determine last assistant message index
    const lastAssistantIndex = messages.reduce<number>(
        (acc, msg, i) => (msg.role === "assistant" ? i : acc),
        -1
    );

    if (isLoading) {
        return (
            <div className="flex-1 overflow-y-auto" role="log" aria-live="polite" aria-label="Message list">
                <div className="max-w-3xl mx-auto py-4">
                    <MessageSkeleton />
                    <MessageSkeleton />
                    <MessageSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div
            ref={scrollRef}
            onScroll={handleScroll}
            role="log"
            aria-live="polite"
            aria-label="Conversation messages"
            className="flex-1 overflow-y-auto scroll-smooth"
        >
            <div className="max-w-3xl mx-auto py-6">
                {messages.map((msg, i) => (
                    <MessageItem
                        key={msg.id}
                        message={msg}
                        isLastAssistant={i === lastAssistantIndex && !isStreaming}
                        onRegenerate={i === lastAssistantIndex ? onRegenerate : undefined}
                        repoHtmlUrl={repoHtmlUrl}
                        defaultBranch={defaultBranch}
                    />
                ))}

                {/* Streaming content */}
                {isStreaming && streamingContent && (
                    <MessageItem
                        message={{ role: "assistant", content: streamingContent }}
                        isStreamingMessage
                    />
                )}

                {/* Thinking dots before first token */}
                {isStreaming && !streamingContent && <ThinkingIndicator />}

                <div ref={bottomRef} />
            </div>

            {/* Floating scroll-to-bottom button */}
            {userScrolledUp && (
                <div className="sticky bottom-6 flex justify-center pointer-events-none">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={scrollToBottom}
                        aria-label="Scroll to bottom"
                        className={cn(
                            "pointer-events-auto rounded-full shadow-md gap-1.5",
                            "bg-background/90 backdrop-blur-sm border-border"
                        )}
                    >
                        <ChevronDown className="w-4 h-4" />
                        <span className="text-xs">Scroll to bottom</span>
                    </Button>
                </div>
            )}
        </div>
    );
}
