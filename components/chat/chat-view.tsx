"use client";

import { useEffect, useCallback } from "react";
import { ChatSidebar, ChatSidebarContent } from "./chat-sidebar";
import { ChatHeader } from "./chat-header";
import { ChatEmptyState } from "./chat-empty-state";
import { MessageList } from "./message-list";
import { ChatComposer } from "./chat-composer";
import { IndexingState } from "./indexing-state";
import { useRepos, useIndexStatus } from "@/hooks/use-repo";
import { useChat } from "@/hooks/use-chat";
import { useChatStore } from "@/store/chat-store";
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";

// ─── Main ChatView ─────────────────────────────────────────────────────────────

function ChatView({ repoId }: { repoId: string }) {
    const { data: repos } = useRepos();
    const { data: indexStatus } = useIndexStatus(repoId, true);

    const {
        activeConversationId,
        setActiveConversation,
        sidebarCollapsed,
        toggleSidebar,
        setSidebarCollapsed,
        mobileSheetOpen,
        setMobileSheetOpen,
    } = useChatStore();

    const repo = repos?.find((r) => r.id === repoId);

    const {
        messages,
        isLoading: isMessagesLoading,
        sendMessage,
        stopStreaming,
        regenerate,
        isStreaming,
        streamingContent,
        error,
    } = useChat({
        sessionId: activeConversationId,
        repositoryId: repoId,
        onSessionCreated: (sid) => {
            setActiveConversation(sid);
        },
    });

    // Reset active conversation when repo changes
    useEffect(() => {
        setActiveConversation(null);
    }, [repoId, setActiveConversation]);

    const currentStatus = indexStatus?.indexStatus ?? repo?.indexStatus;
    const isNotReady = currentStatus !== "READY";

    const handleSend = useCallback(
        async (content: string) => {
            if (isNotReady) return;
            await sendMessage(content);
        },
        [isNotReady, sendMessage]
    );

    // ── Loading state while repo data loads ──
    if (!repo) {
        return (
            <div className="flex h-dvh items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
                    <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                </div>
            </div>
        );
    }

    // Sidebar content is shared between desktop and mobile Sheet
    const sidebarProps = {
        repoId,
        repoName: repo.name,
        activeSessionId: activeConversationId,
        onSelectSession: (id: string) => {
            setActiveConversation(id);
            setMobileSheetOpen(false);
        },
        collapsed: sidebarCollapsed,
        onToggle: toggleSidebar,
    };

    return (
        <div className="flex h-dvh w-full overflow-hidden bg-background">
            {/* Desktop sidebar */}
            <ChatSidebar {...sidebarProps} />

            {/* Mobile sidebar sheet */}
            <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
                <SheetContent side="left" className="w-72 p-0">
                    <ChatSidebarContent {...sidebarProps} collapsed={false} />
                </SheetContent>
            </Sheet>

            {/* Main content */}
            <main className="flex flex-col flex-1 h-dvh min-w-0 overflow-hidden">
                {/* Header */}
                <ChatHeader
                    repo={repo}
                    indexStatus={indexStatus}
                    sidebarCollapsed={sidebarCollapsed}
                    onToggleSidebar={() => setSidebarCollapsed(false)}
                    onOpenMobileSheet={() => setMobileSheetOpen(true)}
                />

                {/* If indexing and no ready state, show full indexing overlay in the content area */}
                {isNotReady ? (
                    <div className="flex-1 overflow-auto">
                        <IndexingState repo={repo} status={indexStatus} />
                    </div>
                ) : (
                    <>
                        {/* Message area */}
                        {!activeConversationId || messages.length === 0 && !isStreaming ? (
                            <div className="flex-1 overflow-y-auto">
                                <ChatEmptyState
                                    repoName={repo.name}
                                    onSuggestionClick={handleSend}
                                />
                            </div>
                        ) : (
                            <MessageList
                                messages={messages}
                                isLoading={isMessagesLoading}
                                isStreaming={isStreaming}
                                streamingContent={streamingContent}
                                onRegenerate={regenerate}
                                repoHtmlUrl={repo.htmlUrl}
                                defaultBranch={repo.defaultBranch}
                            />
                        )}

                        {/* Error display */}
                        {error && (
                            <div className="shrink-0 px-4 pb-1">
                                <div className="max-w-3xl mx-auto">
                                    <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                                        {error.message}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Composer */}
                        <ChatComposer
                            onSend={handleSend}
                            isStreaming={isStreaming}
                            onStop={stopStreaming}
                            autoFocus
                        />
                    </>
                )}
            </main>
        </div>
    );
}

export default ChatView;
