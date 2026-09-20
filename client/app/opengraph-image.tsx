import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "CodeMind | Ask your codebase anything";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#09090b", // Dark background
                    backgroundImage: "linear-gradient(to bottom right, #09090b, #18181b)",
                    padding: "80px",
                }}
            >
                {/* Simulated Grid Background */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* Logo and Wordmark */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m18 16 4-4-4-4" />
                        <path d="m6 8-4 4 4 4" />
                        <path d="m14.5 4-5 16" />
                    </svg>
                    <span style={{ fontSize: "64px", fontWeight: 700, color: "white", fontFamily: "sans-serif" }}>CodeMind</span>
                </div>

                {/* Headline */}
                <div style={{ display: "flex", textAlign: "center", fontSize: "72px", fontWeight: 800, color: "white", letterSpacing: "-0.05em", lineHeight: 1.1, fontFamily: "sans-serif" }}>
                    Ask your codebase anything.
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
