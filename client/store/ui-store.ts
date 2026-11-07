"use client";

import { create } from "zustand";

interface UIState {
    commandPaletteOpen: boolean;
    setCommandPaletteOpen: (open: boolean) => void;
    toggleCommandPalette: () => void;

    shortcutsDialogOpen: boolean;
    setShortcutsDialogOpen: (open: boolean) => void;
    toggleShortcutsDialog: () => void;

    onboardingWizardOpen: boolean;
    setOnboardingWizardOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    commandPaletteOpen: false,
    setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    toggleCommandPalette: () =>
        set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

    shortcutsDialogOpen: false,
    setShortcutsDialogOpen: (open) => set({ shortcutsDialogOpen: open }),
    toggleShortcutsDialog: () =>
        set((state) => ({ shortcutsDialogOpen: !state.shortcutsDialogOpen })),

    onboardingWizardOpen: false,
    setOnboardingWizardOpen: (open) => set({ onboardingWizardOpen: open }),
}));

