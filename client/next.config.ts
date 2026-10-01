import type { NextConfig } from "next";

/**
 * BACKEND_URL is a SERVER-SIDE-ONLY env var (no NEXT_PUBLIC_ prefix).
 * Set it in Vercel → Settings → Environment Variables for Production.
 *
 * It must NEVER be exposed to the browser bundle. All browser-side code uses
 * relative paths (/api/*, /oauth2/*) which are proxied here at the Edge to
 * the real backend. This gives us:
 *
 *  1. Same-origin cookies — CODEMIND_SESSION is set on codemindai.vercel.app,
 *     not on the backend domain, so the Next.js middleware can read it.
 *
 *  2. No CORS issues — browser only ever talks to codemindai.vercel.app.
 *
 *  3. No NEXT_PUBLIC_BACKEND_URL needed — BACKEND_BASE_URL in api.ts is "".
 *
 * For local development BACKEND_URL defaults to http://localhost:8080.
 */
const BACKEND_URL =
    process.env.BACKEND_URL ||           // set this in Vercel dashboard (server-side only)
    "http://localhost:8080";             // local fallback

const nextConfig: NextConfig = {

    async rewrites() {
        return [
            // All Spring Boot REST API calls
            {
                source: "/api/:path*",
                destination: `${BACKEND_URL}/api/:path*`,
            },
            // OAuth2 initiation — browser hits /oauth2/authorization/github,
            // Vercel proxies it to Spring Boot which redirects to GitHub.
            {
                source: "/oauth2/:path*",
                destination: `${BACKEND_URL}/oauth2/:path*`,
            },
            // GitHub redirects back to the Spring Boot callback at this path;
            // the rewrite ensures it hits Spring, not Vercel's own router.
            {
                source: "/login/oauth2/:path*",
                destination: `${BACKEND_URL}/login/oauth2/:path*`,
            },
        ];
    },
};

export default nextConfig;
