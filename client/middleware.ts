import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * The session cookie set by Spring Boot (HttpOnly).
 * Because ALL API calls go through Next.js rewrites (same-origin from
 * the browser's perspective), this cookie is set on the Vercel domain
 * and the middleware can read it directly.
 */
const SESSION_COOKIE = "CODEMIND_SESSION";

// Routes that do NOT require authentication
const PUBLIC_PATHS = ["/", "/login", "/auth/callback", "/oauth2", "/login/oauth2", "/api"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAuthenticated = request.cookies.has(SESSION_COOKIE);

    const isPublicPath = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/") || (path !== "/" && pathname.startsWith(path)));

    if (isPublicPath) {
        // Authenticated users hitting /login → bounce to dashboard
        if (pathname === "/login" && isAuthenticated) {
            const clear = request.nextUrl.searchParams.get("clear");
            if (clear === "1") {
                // The frontend explicitly requested to clear the cookie (e.g. 401 response).
                // Returning NextResponse.next() here allows the login page to load,
                // and deleting the cookie ensures subsequent requests don't loop.
                const response = NextResponse.next();
                response.cookies.delete(SESSION_COOKIE);
                return response;
            }
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        // All other public paths (e.g. /auth/callback, /) → allow through
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
        "/((?!_next/static|_next/image|favicon.ico|api)(?!.*\\..*).+)",
        "/dashboard/:path*", "/chat/:path*", "/login", "/auth/callback",
        "/oauth2/:path*", "/login/oauth2/:path*",
    ],
};
