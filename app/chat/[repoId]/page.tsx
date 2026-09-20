"use client";
import { use } from "react";
import ChatView from "@/components/chat/chat-view";
import { RequiredAuth } from "@/components/provider/required-auth";

export default function ChatPage({ params }: { params: Promise<{ repoId: string }> }) {
    const { repoId } = use(params);
    return (
        <RequiredAuth>
            <ChatView repoId={repoId} />
        </RequiredAuth>
    );
}
