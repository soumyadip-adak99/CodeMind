"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Send, Square } from "lucide-react";
import { cn } from "cn";

const MAX_ROWS = 8;
const LINE_HEIGHT_PX = 24; // approx 1.5rem

interface ChatComposerProps {
    onSend: (message: string) => void;
    isStreaming: boolean;
    onStop: () => void;
    autoFocus?: boolean;
}

export function ChatComposer({ onSend, isStreaming, onStop, autoFocus = true }: ChatComposerProps) {
    const [content, setContent] = useState("");
    const [focused, setFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isComposingRef = useRef(false); // IME composition guard

    const isEmpty = !content.trim();

    // Auto-resize textarea
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "inherit";
        const maxHeight = LINE_HEIGHT_PX * MAX_ROWS + 28; // + padding
        el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    }, [content]);

    // Autofocus on mount and when autoFocus changes
    useEffect(() => {
        if (autoFocus) {
            textareaRef.current?.focus();
        }
    }, [autoFocus]);

    const handleSend = useCallback(() => {
        if (isEmpty || isStreaming) return;
        const trimmed = content.trim();
        setContent("");
        // Reset height
        if (textareaRef.current) textareaRef.current.style.height = "inherit";
        onSend(trimmed);
        // Re-focus after send
        setTimeout(() => textareaRef.current?.focus(), 0);
    }, [content, isEmpty, isStreaming, onSend]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isComposingRef.current) return;

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <nav
            aria-label="Message composer"
            className="shrink-0 px-4 pb-4 pt-2"
        >
            <div
                className={cn(
                    "relative max-w-3xl mx-auto rounded-2xl bg-card border transition-all duration-200",
                    "shadow-sm",
                    focused
                        ? "border-ring/60 shadow-md shadow-ring/5"
                        : "border-border"
                )}
            >
                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    id="chat-composer-textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={() => { isComposingRef.current = true; }}
                    onCompositionEnd={() => { isComposingRef.current = false; }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={isStreaming ? "Generating response…" : "Ask anything about this codebase…"}
                    rows={1}
                    disabled={isStreaming}
                    aria-label="Message input"
                    aria-multiline="true"
                    className={cn(
                        "w-full resize-none bg-transparent px-4 pt-3.5 pb-12",
                        "text-sm outline-none placeholder:text-muted-foreground/60",
                        "leading-relaxed max-h-[220px]",
                        isStreaming && "cursor-wait"
                    )}
                />

                {/* Bottom toolbar */}
                <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-3 pb-2.5 pt-1 border-t border-border/50">
                    <span className="text-xs text-muted-foreground/50 select-none">
                        {content.length > 0 ? `${content.length} chars · ` : ""}
                        Enter to send, Shift+Enter for newline
                    </span>

                    {isStreaming ? (
                        <button
                            onClick={onStop}
                            aria-label="Stop generating"
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                                "bg-destructive/10 text-destructive hover:bg-destructive/20",
                                "transition-colors duration-150",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            )}
                        >
                            <Square className="w-3.5 h-3.5 fill-current" />
                            Stop
                        </button>
                    ) : (
                        <button
                            onClick={handleSend}
                            disabled={isEmpty}
                            aria-label="Send message"
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                                "transition-all duration-150",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                isEmpty
                                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                                    : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 shadow-sm"
                            )}
                        >
                            <Send className="w-3.5 h-3.5" />
                            Send
                        </button>
                    )}
                </div>
            </div>

            {/* Footer note */}
            <p className="text-center text-xs text-muted-foreground/40 mt-2 select-none">
                CodeMind can make mistakes. Verify important code.
            </p>
        </nav>
    );
}
