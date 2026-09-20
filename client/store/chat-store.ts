"use client";

import { create } from "zustand";

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
    sidebarCollapsed: false,
    mobileSheetOpen: false,

    setActiveConversation: (id) => set({ activeConversationId: id }),

    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

    toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

    setMobileSheetOpen: (open) => set({ mobileSheetOpen: open }),
}));

/** Convenience selectors */
export const useActiveConversationId = () =>
    useChatStore((s) => s.activeConversationId);
export const useSidebarCollapsed = () =>
    useChatStore((s) => s.sidebarCollapsed);
