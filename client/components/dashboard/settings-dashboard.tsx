"use client";

import { ExternalLink, LogOut, Moon, FolderGit2, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardHeader } from "./dashboard-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { BACKEND_GITHUB_LOGIN_URL } from "@/lib/api";

// ─── Section wrapper ───────────────────────────────────────────────────────────

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {title}
            </h2>
            <div className="rounded-2xl border bg-card overflow-hidden">{children}</div>
        </div>
    );
}

function SettingsRow({
    label,
    description,
    action,
}: {
    label: string;
    description?: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="space-y-0.5 min-w-0">
                <p className="text-sm font-medium">{label}</p>
                {description && (
                    <p className="text-xs text-muted-foreground">{description}</p>
                )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function SettingsDashboard() {
    const { data: user } = useCurrentUser();
    const logout = useLogout();
    const { theme, setTheme } = useTheme();

    const isDark = theme === "dark";

    return (
        <AppShell title="Settings" description="Manage your account preferences">
            <div className="max-w-2xl space-y-8">
                <DashboardHeader title="Settings" description="Manage your account and preferences" />

                {/* Profile */}
                <SettingsSection title="Profile">
                    <div className="flex items-center gap-4 px-5 py-4">
                        <Avatar className="size-14 rounded-2xl">
                            <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.displayName ?? ""} />
                            <AvatarFallback className="rounded-2xl text-lg">
                                {user?.displayName?.charAt(0).toUpperCase() ?? "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                            <p className="font-semibold">{user?.displayName ?? "User"}</p>
                            {user?.githubUsername && (
                                <p className="text-sm text-muted-foreground">@{user.githubUsername}</p>
                            )}
                        </div>
                    </div>
                </SettingsSection>

                {/* GitHub */}
                <SettingsSection title="GitHub">
                    <SettingsRow
                        label="GitHub account"
                        description={
                            user?.githubUsername
                                ? `Connected as @${user.githubUsername}`
                                : "Not connected"
                        }
                        action={
                            user?.githubUsername ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    nativeButton={false}
                                    render={
                                        <a
                                            href={`https://github.com/${user.githubUsername}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        />
                                    }
                                >
                                    <FolderGit2 className="size-3.5" />
                                    View profile
                                    <ExternalLink className="size-3 opacity-50" />
                                </Button>
                            ) : (
                                <Button
                                    variant="default"
                                    size="sm"
                                    nativeButton={false}
                                    render={<a href={BACKEND_GITHUB_LOGIN_URL} />}
                                >
                                    <FolderGit2 className="size-3.5" />
                                    Connect GitHub
                                </Button>
                            )
                        }
                    />
                </SettingsSection>

                {/* Appearance */}
                <SettingsSection title="Appearance">
                    <SettingsRow
                        label="Theme"
                        description="Choose between light and dark mode"
                        action={
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setTheme(isDark ? "light" : "dark")}
                            >
                                {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
                                {isDark ? "Light mode" : "Dark mode"}
                            </Button>
                        }
                    />
                </SettingsSection>

                {/* Danger zone */}
                <SettingsSection title="Account">
                    <Separator />
                    <SettingsRow
                        label="Sign out"
                        description="Sign out of your CodeMind account"
                        action={
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => logout()}
                            >
                                <LogOut className="size-3.5" />
                                Sign out
                            </Button>
                        }
                    />
                </SettingsSection>
            </div>
        </AppShell>
    );
}
