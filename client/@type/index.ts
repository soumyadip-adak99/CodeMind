import { LucideIcon } from "lucide-react";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export type User = {
    id: string;
    githubId: number;
    githubUsername: string;
    displayName: string;
    avatarUrl: string | null;
};

// ─── Navigation ───────────────────────────────────────────────────────────────

export type DashBoardNavItem = {
    title: string;
    href: string;
    icon: LucideIcon;
    exact?: boolean;
};

export type DashboardNavGroup = {
    label: string;
    items: DashBoardNavItem[];
};

// ─── API Error ────────────────────────────────────────────────────────────────

/**
 * Shape returned by the backend GlobalExceptionHandler for every error.
 * {
 *   "status": 401,
 *   "error": "Unauthorized",
 *   "message": "Not authenticated",
 *   "timestamp": "2024-01-01T00:00:00Z"
 * }
 */
export interface ApiErrorResponse {
    status: number;
    error: string;
    message: string ;
    timestamp: string;
}

export type IndexStatus = "PENDING" | "INDEXING" | "READY" | "FAILED";

export type Repository = {
    id: string;
    githubRepoId: number;
    owner: string;
    name: string;
    fullName: string;
    isPrivate: boolean;
    defaultBranch: string;
    language: string | null;
    htmlUrl: string | null;
    indexStatus: IndexStatus;
    indexedAt: string | null;
    chunkCount: number;
    filesTotal: number;
    filesProcessed: number;
    errorMessage: string | null;
};

export type IndexStatusResponse = {
    repositoryId: string;
    indexStatus: IndexStatus;
    filesTotal: number;
    filesProcessed: number;
    chunkCount: number;
    indexedAt: string | null;
    errorMessage: string | null;
};

// ─── Chat ─────────────────────────────────────────────────────────────────────

export type ChatSession = {
    id: string;
    repositoryId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
};

export type Citation = {
    filePath: string;
    startLine: number | null;
    endLine: number | null;
    language: string | null;
};

export type ChatMessage = {
    id: string;
    sessionId: string;
    role: "user" | "assistant";
    content: string;
    citations: Citation[];
    createdAt: string;
};

// stream
export type StreamChatHandlers = {
    onUserMessage?: (message: ChatMessage) => void;
    onToken?: (token: string) => void;
    onAssistantMessage?: (message: ChatMessage) => void;
    onDone?: () => void;
    onError?: (error: Error) => void;
    signal?: AbortSignal;
};
