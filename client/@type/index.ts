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
    message: string;
    timestamp: string;
}
