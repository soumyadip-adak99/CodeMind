"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { useUIStore } from "@/store/ui-store";
import { useRepos, useRefreshRepos, useStartIndexing } from "@/hooks/use-repo";
import { useLogout } from "@/hooks/use-auth";
import {
    FolderGit2,
    LayoutDashboard,
    PieChart,
    Settings,
    RefreshCw,
    Sun,
    Moon,
    LogOut,
    HelpCircle,
    Compass,
    MessageSquare,
    Zap,
} from "lucide-react";

export function CommandPalette() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const {
        commandPaletteOpen,
        setCommandPaletteOpen,
        toggleCommandPalette,
        setShortcutsDialogOpen,
        setOnboardingWizardOpen,
    } = useUIStore();

    const { data: repos } = useRepos();
    const refreshRepos = useRefreshRepos();
    const startIndexing = useStartIndexing();
    const logout = useLogout();

    // Listen for Ctrl+K / Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                toggleCommandPalette();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleCommandPalette]);

    const runCommand = (command: () => void) => {
        setCommandPaletteOpen(false);
        command();
    };

    return (
        <CommandDialog
            open={commandPaletteOpen}
            onOpenChange={setCommandPaletteOpen}
            title="Command Palette"
            description="Search repositories, pages, and actions..."
        >
            <CommandInput placeholder="Type a command or search repositories..." />
            <CommandList className="max-h-[380px] p-2">
                <CommandEmpty>No matching results found.</CommandEmpty>

                {/* ── Navigation ────────────────────────────── */}
                <CommandGroup heading="Navigation">
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/dashboard"))}
                    >
                        <FolderGit2 className="mr-2 size-4 text-blue-500" />
                        <span>Repositories</span>
                        <CommandShortcut>G D</CommandShortcut>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/dashboard/overview"))}
                    >
                        <PieChart className="mr-2 size-4 text-purple-500" />
                        <span>Overview</span>
                        <CommandShortcut>G O</CommandShortcut>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/dashboard/settings"))}
                    >
                        <Settings className="mr-2 size-4 text-zinc-500" />
                        <span>Settings</span>
                        <CommandShortcut>G S</CommandShortcut>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                {/* ── Repositories ─────────────────────────── */}
                {repos && repos.length > 0 && (
                    <CommandGroup heading="Repositories">
                        {repos.slice(0, 8).map((repo) => (
                            <CommandItem
                                key={repo.id}
                                onSelect={() =>
                                    runCommand(() => {
                                        if (repo.indexStatus === "READY") {
                                            router.push(`/chat/${repo.id}`);
                                        } else if (repo.indexStatus === "INDEXING") {
                                            router.push(`/dashboard/repos/${repo.id}/indexing`);
                                        } else {
                                            startIndexing.mutate(repo.id);
                                            router.push(`/dashboard/repos/${repo.id}/indexing`);
                                        }
                                    })
                                }
                            >
                                <div className="flex size-6 items-center justify-center rounded-md bg-muted text-xs font-semibold mr-2 shrink-0">
                                    {repo.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="truncate">{repo.fullName}</span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {repo.language ?? "Code"} · {repo.indexStatus}
                                    </span>
                                </div>
                                <div className="ml-auto shrink-0 flex items-center">
                                    {repo.indexStatus === "READY" ? (
                                        <MessageSquare className="size-3.5 text-emerald-500" />
                                    ) : (
                                        <Zap className="size-3.5 text-amber-500" />
                                    )}
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                <CommandSeparator />

                {/* ── Actions ──────────────────────────────── */}
                <CommandGroup heading="Actions">
                    <CommandItem
                        onSelect={() =>
                            runCommand(() => {
                                refreshRepos.mutate();
                            })
                        }
                    >
                        <RefreshCw className="mr-2 size-4 text-emerald-500" />
                        <span>Sync Repositories from GitHub</span>
                    </CommandItem>

                    <CommandItem
                        onSelect={() =>
                            runCommand(() => {
                                setTheme(theme === "dark" ? "light" : "dark");
                            })
                        }
                    >
                        {theme === "dark" ? (
                            <Sun className="mr-2 size-4 text-amber-500" />
                        ) : (
                            <Moon className="mr-2 size-4 text-indigo-500" />
                        )}
                        <span>Toggle Theme ({theme === "dark" ? "Light" : "Dark"})</span>
                    </CommandItem>

                    <CommandItem
                        onSelect={() =>
                            runCommand(() => {
                                setShortcutsDialogOpen(true);
                            })
                        }
                    >
                        <HelpCircle className="mr-2 size-4 text-sky-500" />
                        <span>Keyboard Shortcuts Reference</span>
                        <CommandShortcut>?</CommandShortcut>
                    </CommandItem>

                    <CommandItem
                        onSelect={() =>
                            runCommand(() => {
                                setOnboardingWizardOpen(true);
                            })
                        }
                    >
                        <Compass className="mr-2 size-4 text-orange-500" />
                        <span>Launch Onboarding Walkthrough</span>
                    </CommandItem>

                    <CommandItem
                        onSelect={() =>
                            runCommand(() => {
                                void logout();
                            })
                        }
                        className="text-destructive data-selected:bg-destructive/10 data-selected:text-destructive"
                    >
                        <LogOut className="mr-2 size-4" />
                        <span>Sign Out</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}

