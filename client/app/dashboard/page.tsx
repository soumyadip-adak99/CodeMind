"use client"

import { RequiredAuth } from "@/components/provider/required-auth"
import { AppShell } from "@/components/layout/app-shell"
import { CodeMindIcon } from "@/components/icons/code-mind"

export default function Dashboard() {
    return (
        <RequiredAuth>
            <AppShell hideHeader>
                <div className="flex h-full flex-col items-center justify-center space-y-6 text-center px-4 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex aspect-square size-20 md:size-28 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-xl">
                        <CodeMindIcon className="size-12 md:size-16" />
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            Welcome to <span className="text-primary">CodeMind</span>
                        </h1>
                        <p className="mx-auto max-w-[600px] text-base sm:text-lg md:text-xl text-muted-foreground font-medium">
                            Your intelligent coding companion. Upload your repositories, chat with your code, and build faster than ever.
                        </p>
                    </div>
                </div>
            </AppShell>
        </RequiredAuth>
    )
}