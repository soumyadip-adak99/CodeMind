import {
    type User,
    type ApiErrorResponse,
    type Repository,
    type IndexStatusResponse,
    type ChatSession,
    type ChatMessage,
} from "@/@type/index";

export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;

export const BACKEND_GITHUB_LOGIN_URL = `${BACKEND_BASE_URL}/oauth2/authorization/github`;

export type { ApiErrorResponse };

export function getApiBaseUrl():string {
    return BACKEND_BASE_URL;
}

export class ApiError extends Error {
    status: number;
    error: string;
    timestamp: string;

    constructor(response: ApiErrorResponse) {
        super(response.message);
        this.name = "ApiError";
        this.status = response.status;
        this.error = response.error;
        this.timestamp = response.timestamp;
    }

    get isUnauthorized() {
        return this.status === 401;
    }

    get isNotFound() {
        return this.status === 404;
    }

    get isBadRequest() {
        return this.status === 400;
    }

    get isServerError() {
        return this.status >= 500;
    }
}

async function parseErrorResponse(res: Response): Promise<ApiErrorResponse> {
    const fallback: ApiErrorResponse = {
        status: res.status,
        error: res.statusText || "Request failed",
        message: res.statusText || "An unexpected error occurred",
        timestamp: new Date().toISOString(),
    };

    try {
        const text = await res.text();
        if (!text) return fallback;
        const data = JSON.parse(text) as Partial<ApiErrorResponse>;
        return {
            status: data.status ?? res.status,
            error: data.error ?? fallback.error,
            message: data.message ?? fallback.message,
            timestamp: data.timestamp ?? fallback.timestamp,
        };
    } catch {
        return fallback;
    }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const url = `${BACKEND_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

    const res = await fetch(url, {
        ...init,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
    });

    if (!res.ok) {
        const errorResponse = await parseErrorResponse(res);
        throw new ApiError(errorResponse);
    }

    // 204 No Content — return undefined
    if (res.status === 204) {
        return undefined as T;
    }

    const text = await res.text();
    if (!text) return undefined as unknown as T;

    return JSON.parse(text) as T;
}

export const api = {
    loginUrl: (): Promise<{ url: string }> => apiFetch<{ url: string }>("/api/auth/login-url"),
    me: (): Promise<User> => apiFetch<User>("/api/auth/me"),
    logout: (): Promise<void> =>
        apiFetch<void>("/api/auth/logout", {
            method: "POST",
        }),
    listRepos: (refresh = true) => apiFetch<Repository[]>(`/api/repos?refresh=${refresh}`),
    getRepo: (id: string) => apiFetch<Repository>(`/api/repos/${id}`),
    startIndex: (id: string) => apiFetch<Repository>(`/api/repos/${id}/index`, { method: "POST" }),
    indexStatus: (id: string) => apiFetch<IndexStatusResponse>(`/api/repos/${id}/status`),
    createSession: (repositoryId: string, title?: string) =>
        apiFetch<ChatSession>("/api/chat/sessions", {
            method: "POST",
            body: JSON.stringify({ repositoryId, title }),
        }),
    listSessions: (repositoryId: string) =>
        apiFetch<ChatSession[]>(
            `/api/chat/sessions?repositoryId=${encodeURIComponent(repositoryId)}`
        ),
    getMessages: (sessionId: string) => apiFetch<ChatMessage[]>(`/api/chat/sessions/${sessionId}`),
    sendMessage: async (sessionId: string, content: string) => {
        const url = `${BACKEND_BASE_URL.replace(/\/$/, "")}/api/chat/sessions/${sessionId}/messages`;
        return fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
        });
    },
};
