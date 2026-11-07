/**
 * Safe local storage utility with SSR support, JSON parsing, and fallbacks.
 */

export const STORAGE_KEYS = {
    SIDEBAR_EXPANDED: "codemind_sidebar_expanded",
    ONBOARDING_COMPLETED: "codemind_onboarding_completed",
    REPO_VIEW_MODE: "codemind_repo_view_mode",
    REPO_FILTER_PREFERENCES: "codemind_repo_filters",
    WORKSPACE_SETTINGS: "codemind_workspace_settings",
    CHAT_DRAFTS_PREFIX: "codemind_chat_draft_",
} as const;

export function safeLocalStorageGet<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") {
        return defaultValue;
    }
    try {
        const item = window.localStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item) as T;
    } catch {
        return defaultValue;
    }
}

export function safeLocalStorageSet<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Storage might be disabled or full
    }
}

export function safeLocalStorageRemove(key: string): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.removeItem(key);
    } catch {
        // Ignore
    }
}

