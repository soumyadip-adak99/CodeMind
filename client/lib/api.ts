import { User } from "@/@type/index";

export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const BACKEND_GITHUB_LOGIN_URL = `${BACKEND_BASE_URL}/oauth2/authorization/github`;

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

const parseError = async (res: Response): Promise<string> => {
    try {
        const data = await res.json();
        return data.message ?? data.error ?? res.statusText;
    } catch (error) {
        console.error("Error parsing response:", error);
        return res.statusText || "Request failed";
    }
};

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BACKEND_BASE_URL}/${path}`, {
        ...init,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
    });

    if (!res.ok) {
        throw new ApiError(res.status, await parseError(res));
    }

    if (res.status === 204) {
        return undefined as T;
    }

    return res.json() as Promise<T>;
}

export const api = {
    me: () => apiFetch<User>("/api/auth/me"),
    logout: () =>
        apiFetch<void>("/api/auth/logout", {
            method: "POST",
        }),
};
