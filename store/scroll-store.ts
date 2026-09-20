import { create } from "zustand";

interface ScrollState {
    scrollProgress: number; // 0 to 1
    currentStage: number; // 0: Connect, 1: Index, 2: Ask
    setScrollProgress: (progress: number) => void;
    setCurrentStage: (stage: number) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
    scrollProgress: 0,
    currentStage: 0,
    setScrollProgress: (progress) => set({ scrollProgress: progress }),
    setCurrentStage: (stage) => set({ currentStage: stage }),
}));
