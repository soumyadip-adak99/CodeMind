import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * The real session cookie set by Spring Boot (HttpOnly).
 * The middleware runs on the Edge and CAN read HttpOnly cookies,
 * so we use this as the single source of truth for authentication state.
 * The frontend never reads or writes this cookie directly.
 */
const SESSION_COOKIE = "CODEMIND_SESSION";

// Routes that do NOT require authentication
const PUBLIC_PATHS = ["/login", "/auth/callback"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAuthenticated = request.cookies.has(SESSION_COOKIE);

    // Root "/" → redirect based on auth state
    if (pathname === "/") {
        const dest = isAuthenticated ? "/dashboard" : "/login";
        return NextResponse.redirect(new URL(dest, request.url));
    }

    const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

    if (isPublicPath) {
        // Authenticated users hitting /login → bounce to dashboard
        if (pathname === "/login" && isAuthenticated) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        // All other public paths (e.g. /auth/callback) → allow through
        return NextResponse.next();
    }

    // Protected path: no session cookie → redirect to /login
    if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all paths EXCEPT:
         * - _next/static  (Next.js static assets)
         * - _next/image   (Next.js image optimisation)
         * - favicon.ico
         * - Any file with an extension (images, fonts, etc.)
         */
        "/((?!_next/static|_next/image|favicon.ico)(?!.*\\..*).+)",
        "/dashboard/:path*", "/chat/:path*", "/login", "/auth/callback",
    ],
};
