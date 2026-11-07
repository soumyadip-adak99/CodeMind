import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/provider/theme-provider";
import QueryProvider from "@/components/provider/query-provider";
import { AuthProvider } from "@/components/provider/auth-provider";
import { CommandPalette } from "@/components/command-palette/command-palette";
import { ShortcutsDialog } from "@/components/shortcuts/shortcuts-dialog";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const metadata: Metadata = {
    title: "CodeMind — Understand any repository in minutes",
    description: "Turn your GitHub repositories into an intelligent, conversational codebase. Ask questions about architecture or logic and get plain-English explanations backed by verified file and line citations.",
    openGraph: {
        title: "CodeMind — Understand any repository in minutes",
        description: "Turn your GitHub repositories into an intelligent, conversational codebase backed by verified line citations.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "CodeMind — Understand any repository in minutes",
        description: "Turn your GitHub repositories into an intelligent, conversational codebase backed by verified line citations.",
    },
};

export const viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en"
            className="h-full antialiased"
            suppressHydrationWarning
        >
            <body className="min-h-full flex flex-col font-sans">
                <QueryProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <AuthProvider>
                            {children}
                            <CommandPalette />
                            <ShortcutsDialog />
                            <OnboardingWizard />
                        </AuthProvider>
                    </ThemeProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
