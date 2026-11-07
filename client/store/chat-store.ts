"use client";

import { create } from "zustand";
import { safeLocalStorageGet, safeLocalStorageSet } from "@/lib/storage";

const CHAT_SIDEBAR_STORAGE_KEY = "codemind_chat_sidebar_collapsed";

interface ChatState {
    activeConversationId: string | null;
    sidebarCollapsed: boolean;
    mobileSheetOpen: boolean;

    setActiveConversation: (id: string | null) => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    toggleSidebar: () => void;
    setMobileSheetOpen: (open: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    activeConversationId: null,
    sidebarCollapsed: safeLocalStorageGet<boolean>(CHAT_SIDEBAR_STORAGE_KEY, false),
    mobileSheetOpen: false,

    setActiveConversation: (id) => set({ activeConversationId: id }),

    setSidebarCollapsed: (collapsed) => {
        safeLocalStorageSet(CHAT_SIDEBAR_STORAGE_KEY, collapsed);
        set({ sidebarCollapsed: collapsed });
    },

    toggleSidebar: () =>
        set((state) => {
            const next = !state.sidebarCollapsed;
            safeLocalStorageSet(CHAT_SIDEBAR_STORAGE_KEY, next);
            return { sidebarCollapsed: next };
        }),

    setMobileSheetOpen: (open) => set({ mobileSheetOpen: open }),
}));

/** Convenience selectors */
export const useActiveConversationId = () =>
    useChatStore((s) => s.activeConversationId);
export const useSidebarCollapsed = () =>
    useChatStore((s) => s.sidebarCollapsed);
