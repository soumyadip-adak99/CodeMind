import {
    type User,
    type ApiErrorResponse,
    type Repository,
    type IndexStatusResponse,
    type ChatSession,
    type ChatMessage,
} from "@/@type/index";

export const BACKEND_BASE_URL = "";
export const BACKEND_GITHUB_LOGIN_URL = "/oauth2/authorization/github";

export type { ApiErrorResponse };

export function getApiBaseUrl(): string {
    return BACKEND_BASE_URL;
}

function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
    return null;
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

let isRefreshing = false;
let refreshSubscribers: ((error: Error | null) => void)[] = [];

function onRefreshed(error: Error | null = null) {
    refreshSubscribers.forEach((cb) => cb(error));
    refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (error: Error | null) => void) {
    refreshSubscribers.push(cb);
}

export async function apiFetchRaw(path: string, init?: RequestInit): Promise<Response> {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = normalizedPath;
    
    const headers = new Headers(init?.headers);
    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const method = init?.method?.toUpperCase() || "GET";
    if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
        const csrfToken = getCookie("XSRF-TOKEN");
        if (csrfToken) {
            headers.set("X-XSRF-TOKEN", csrfToken);
        }
    }

    const res = await fetch(url, {
        ...init,
        credentials: "include", // Automatically sends and receives cookies
        headers,
    });

    if (!res.ok) {
        if (res.status === 401 && path !== "/api/auth/refresh" && !path.startsWith("/api/auth/exchange")) {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const refreshRes = await fetch("/api/auth/refresh", { method: "POST", credentials: "include" });
                    if (refreshRes.ok) {
                        isRefreshing = false;
                        onRefreshed(null);
                        
                        // Retry original request. The browser will automatically send the new access token cookie
                        return apiFetchRaw(path, { ...init, headers });
                    } else {
                        isRefreshing = false;
                        onRefreshed(new ApiError(await parseErrorResponse(refreshRes)));
                    }
                } catch (e) {
                    isRefreshing = false;
                    onRefreshed(e instanceof Error ? e : new Error(String(e)));
                }
            } else {
                return new Promise((resolve, reject) => {
                    addRefreshSubscriber((error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(apiFetchRaw(path, { ...init, headers }));
                        }
                    });
                });
            }
        }
        const errorResponse = await parseErrorResponse(res);
        throw new ApiError(errorResponse);
    }

    return res;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await apiFetchRaw(path, init);

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
    exchangeToken: (token: string): Promise<User> =>
        apiFetch<User>(`/api/auth/exchange?token=${encodeURIComponent(token)}`, {
            method: "POST",
        }),
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
        const url = `/api/chat/sessions/${sessionId}/messages`;
        return apiFetchRaw(url, {
            method: "POST",
            body: JSON.stringify({ content }),
        });
    },
};
