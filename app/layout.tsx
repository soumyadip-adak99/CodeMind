import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/provider/theme-provider";
import QueryProvider from "@/components/provider/query-provider";
import { AuthProvider } from "@/components/provider/auth-provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "CodeMind | Ask your codebase anything",
    description: "CodeMind turns GitHub repositories into a searchable AI knowledge base so developers can ask questions about their code. Open-source, secure, and powered by Spring Boot and PostgreSQL.",
    openGraph: {
        title: "CodeMind | Ask your codebase anything",
        description: "Turn your GitHub repositories into a searchable AI knowledge base.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "CodeMind | Ask your codebase anything",
        description: "Turn your GitHub repositories into a searchable AI knowledge base.",
    },
};

export const viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
            suppressHydrationWarning
        >
            <body className="min-h-full flex flex-col">
                <QueryProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                    </ThemeProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
