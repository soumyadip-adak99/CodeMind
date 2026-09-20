"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { streamChatMessage } from "@/lib/stream-chat";
import { ChatMessage } from "@/@type";

// ─── Session queries / mutations ───────────────────────────────────────────────

export function useChatSessions(repositoryId: string, enabled = true) {
    return useQuery({
        queryKey: queryKeys.chat.sessions(repositoryId),
        queryFn: () => api.listSessions(repositoryId),
        enabled: Boolean(repositoryId) && enabled,
    });
}

export function useChatMessages(sessionId: string | null) {
    return useQuery({
        queryKey: queryKeys.chat.message(sessionId ?? ""),
        queryFn: () => api.getMessages(sessionId!),
        enabled: Boolean(sessionId),
    });
}

export function useCreateSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ repositoryId, title }: { repositoryId: string; title?: string }) =>
            api.createSession(repositoryId, title),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.chat.sessions(variables.repositoryId),
            });
        },
    });
}

// ─── useChat – streaming + auto-create ────────────────────────────────────────

interface UseChatOptions {
    sessionId: string | null;
    repositoryId?: string;
    /** Called when auto-create creates a new session so callers can store the id */
    onSessionCreated?: (sessionId: string) => void;
}

interface UseChatReturn {
    messages: ChatMessage[];
    isLoading: boolean;
    isStreaming: boolean;
    streamingContent: string;
    error: Error | null;
    sendMessage: (content: string) => Promise<void>;
    stopStreaming: () => void;
    regenerate: () => Promise<void>;
    clearError: () => void;
}

export function useChat({
    sessionId,
    repositoryId,
    onSessionCreated,
}: UseChatOptions): UseChatReturn {
    const queryClient = useQueryClient();
    const { data: messages = [], isLoading } = useChatMessages(sessionId);

    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingContent, setStreamingContent] = useState("");
    const [error, setError] = useState<Error | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    // keep track of the latest session id when auto-creating
    const resolvedSessionIdRef = useRef<string | null>(sessionId);

    // Keep the ref in sync with the prop (inside effect to satisfy react-hooks/refs)
    useEffect(() => {
        resolvedSessionIdRef.current = sessionId;
    }, [sessionId]);

    const sendToSession = useCallback(
        async (sid: string, content: string) => {
            setIsStreaming(true);
            setStreamingContent("");
            setError(null);
            abortControllerRef.current = new AbortController();

            try {
                await streamChatMessage(sid, content, {
                    signal: abortControllerRef.current.signal,
                    onUserMessage: (msg) => {
                        queryClient.setQueryData(
                            queryKeys.chat.message(sid),
                            (old: ChatMessage[] | undefined) => {
                                const existing = old ?? [];
                                const idx = existing.findIndex((m) => m.id === msg.id);
                                if (idx !== -1) {
                                    const next = [...existing];
                                    next[idx] = msg;
                                    return next;
                                }
                                return [...existing, msg];
                            }
                        );
                    },
                    onToken: (token) => {
                        setStreamingContent((prev) => prev + token);
                    },
                    onAssistantMessage: (msg) => {
                        queryClient.setQueryData(
                            queryKeys.chat.message(sid),
                            (old: ChatMessage[] | undefined) => {
                                const existing = old ?? [];
                                const idx = existing.findIndex((m) => m.id === msg.id);
                                if (idx !== -1) {
                                    const next = [...existing];
                                    next[idx] = msg;
                                    return next;
                                }
                                return [...existing, msg];
                            }
                        );
                        setStreamingContent("");
                    },
                    onError: (err) => {
                        setError(err);
                    },
                    onDone: () => {
                        setIsStreaming(false);
                        abortControllerRef.current = null;
                        queryClient.invalidateQueries({
                            queryKey: queryKeys.chat.message(sid),
                        });
                    },
                });
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    setError(err instanceof Error ? err : new Error("Failed to send message"));
                }
                setIsStreaming(false);
                setStreamingContent("");
                abortControllerRef.current = null;
            }
        },
        [queryClient]
    );

    const sendMessage = useCallback(
        async (content: string) => {
            if (isStreaming) return;

            let sid = resolvedSessionIdRef.current;

            // Auto-create a session if none exists and repositoryId is available
            if (!sid) {
                if (!repositoryId) {
                    setError(new Error("No repository selected"));
                    return;
                }
                try {
                    const session = await api.createSession(repositoryId);
                    sid = session.id;
                    resolvedSessionIdRef.current = sid;
                    queryClient.invalidateQueries({
                        queryKey: queryKeys.chat.sessions(repositoryId),
                    });
                    onSessionCreated?.(sid);
                } catch (err) {
                    setError(err instanceof Error ? err : new Error("Failed to create session"));
                    return;
                }
            }

            await sendToSession(sid, content);
        },
        [isStreaming, repositoryId, queryClient, onSessionCreated, sendToSession]
    );

    const regenerate = useCallback(async () => {
        if (!sessionId || isStreaming) return;

        // Find the last user message to re-send
        const msgs = queryClient.getQueryData<ChatMessage[]>(
            queryKeys.chat.message(sessionId)
        );
        const lastUser = [...(msgs ?? [])].reverse().find((m) => m.role === "user");
        if (!lastUser) return;

        // Optimistically remove the last assistant message
        queryClient.setQueryData<ChatMessage[]>(
            queryKeys.chat.message(sessionId),
            (old) => {
                if (!old) return old;
                const idx = [...old].reverse().findIndex((m) => m.role === "assistant");
                if (idx === -1) return old;
                const realIdx = old.length - 1 - idx;
                return old.slice(0, realIdx);
            }
        );

        await sendToSession(sessionId, lastUser.content);
    }, [sessionId, isStreaming, queryClient, sendToSession]);

    const stopStreaming = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsStreaming(false);
            setStreamingContent("");
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {
        messages,
        isLoading,
        sendMessage,
        stopStreaming,
        regenerate,
        isStreaming,
        streamingContent,
        error,
        clearError,
    };
}
