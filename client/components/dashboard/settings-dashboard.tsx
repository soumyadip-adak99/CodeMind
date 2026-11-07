"use client";

import { useState } from "react";
import {
    ExternalLink,
    LogOut,
    Moon,
    FolderGit2,
    Sun,
    Check,
    Loader2,
    AlertCircle,
    Compass,
    Sliders,
    Shield,
    Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardHeader } from "./dashboard-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { useUIStore } from "@/store/ui-store";
import { useAutosave } from "@/hooks/use-autosave";
import { safeLocalStorageGet, safeLocalStorageSet, STORAGE_KEYS } from "@/lib/storage";
import { BACKEND_GITHUB_LOGIN_URL } from "@/lib/api";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface WorkspaceSettings {
    chunkSize: number;
    maxFileKb: number;
    defaultBranch: string;
    customPrompt: string;
}

const DEFAULT_SETTINGS: WorkspaceSettings = {
    chunkSize: 800,
    maxFileKb: 100,
    defaultBranch: "main",
    customPrompt: "",
};

// ─── Section wrapper ───────────────────────────────────────────────────────────

function SettingsSection({
    title,
    badge,
    children,
}: {
    title: string;
    badge?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {title}
                </h2>
                {badge}
            </div>
            <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs">
                {children}
            </div>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border/40 last:border-b-0">
            <div className="space-y-0.5 min-w-0">
                <p className="text-sm font-medium text-foreground">{label}</p>
                {description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {description}
                    </p>
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
    const { setOnboardingWizardOpen } = useUIStore();

    const [confirmSignoutOpen, setConfirmSignoutOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const [formSettings, setFormSettings] = useState<WorkspaceSettings>(() => {
        return safeLocalStorageGet<WorkspaceSettings>(
            STORAGE_KEYS.WORKSPACE_SETTINGS,
            DEFAULT_SETTINGS
        );
    });

    // ── Smart Client-Side Form Validation ──────────────────────────────────────
    const validateField = (field: keyof WorkspaceSettings, val: any): string | null => {
        if (field === "chunkSize") {
            const num = Number(val);
            if (isNaN(num) || num < 200 || num > 2000) {
                return "Chunk size must be between 200 and 2,000 tokens";
            }
        }
        if (field === "maxFileKb") {
            const num = Number(val);
            if (isNaN(num) || num < 10 || num > 1000) {
                return "File limit must be between 10 KB and 1,000 KB";
            }
        }
        if (field === "defaultBranch") {
            if (!val || typeof val !== "string" || !val.trim()) {
                return "Default branch name cannot be blank";
            }
            if (/\s/.test(val)) {
                return "Branch name cannot contain spaces";
            }
        }
        return null;
    };

    const updateFormSetting = <K extends keyof WorkspaceSettings>(
        field: K,
        value: WorkspaceSettings[K]
    ) => {
        const error = validateField(field, value);
        setValidationErrors((prev) => {
            const next = { ...prev };
            if (error) {
                next[field] = error;
            } else {
                delete next[field];
            }
            return next;
        });

        setFormSettings((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // ── Debounced Autosave Hook ────────────────────────────────────────────────
    const { status: autosaveStatus, lastSavedAt, errorMessage: autosaveError } = useAutosave({
        data: formSettings,
        delayMs: 800,
        enabled: Object.keys(validationErrors).length === 0,
        onSave: async (savedData) => {
            safeLocalStorageSet(STORAGE_KEYS.WORKSPACE_SETTINGS, savedData);
            // Simulate minimal server-bound save delay
            await new Promise((r) => setTimeout(r, 200));
        },
    });

    const isDark = theme === "dark";

    return (
        <AppShell title="Settings" description="Manage your account preferences">
            <div className="max-w-2xl space-y-8 pb-16">
                <div className="flex items-center justify-between">
                    <DashboardHeader
                        title="Settings"
                        description="Configure your workspace preferences and account details"
                    />

                    {/* Autosave Status Indicator */}
                    <div className="flex items-center gap-1.5 text-xs">
                        {autosaveStatus === "saving" && (
                            <span className="flex items-center gap-1.5 text-blue-500 font-medium">
                                <Loader2 className="size-3.5 animate-spin" />
                                Autosaving...
                            </span>
                        )}
                        {autosaveStatus === "saved" && (
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                <Check className="size-3.5" />
                                Saved
                            </span>
                        )}
                        {autosaveStatus === "error" && (
                            <span className="flex items-center gap-1 text-destructive font-medium">
                                <AlertCircle className="size-3.5" />
                                Save error
                            </span>
                        )}
                    </div>
                </div>

                {/* Profile */}
                <SettingsSection title="Profile">
                    <div className="flex items-center gap-4 px-5 py-4">
                        <Avatar className="size-14 rounded-2xl border">
                            <AvatarImage
                                src={user?.avatarUrl ?? undefined}
                                alt={user?.displayName ?? ""}
                            />
                            <AvatarFallback className="rounded-2xl text-lg font-bold">
                                {user?.displayName?.charAt(0).toUpperCase() ?? "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                            <p className="font-semibold text-foreground">
                                {user?.displayName ?? "User"}
                            </p>
                            {user?.githubUsername && (
                                <p className="text-sm text-muted-foreground">
                                    @{user.githubUsername}
                                </p>
                            )}
                        </div>
                    </div>
                </SettingsSection>

                {/* GitHub Authentication & Scope Tier Indicators */}
                <SettingsSection
                    title="GitHub Authentication"
                    badge={
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            <Shield className="size-3" />
                            OAuth2 Active
                        </span>
                    }
                >
                    <SettingsRow
                        label="Connected GitHub Account"
                        description={
                            user?.githubUsername
                                ? `Authorized as @${user.githubUsername} with repo & user permissions`
                                : "Not connected"
                        }
                        action={
                            user?.githubUsername ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl"
                                    nativeButton={false}
                                    render={
                                        <a
                                            href={`https://github.com/${user.githubUsername}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        />
                                    }
                                >
                                    <FolderGit2 className="size-3.5 mr-1.5" />
                                    GitHub Profile
                                    <ExternalLink className="size-3 ml-1.5 opacity-50" />
                                </Button>
                            ) : (
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="rounded-xl"
                                    nativeButton={false}
                                    render={<a href={BACKEND_GITHUB_LOGIN_URL} />}
                                >
                                    <FolderGit2 className="size-3.5 mr-1.5" />
                                    Connect GitHub
                                </Button>
                            )
                        }
                    />
                </SettingsSection>

                {/* Workspace & Indexing Configuration Form (Smart Validation & Autosave) */}
                <SettingsSection
                    title="Indexing & AI Parameters"
                    badge={
                        <span className="text-[11px] text-muted-foreground font-mono">
                            Auto-syncs changes
                        </span>
                    }
                >
                    <div className="p-5 space-y-5">
                        {/* Chunk Size */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-foreground">
                                    Target Chunk Size (Tokens)
                                </label>
                                <span className="font-mono text-xs text-muted-foreground">
                                    {formSettings.chunkSize} tokens
                                </span>
                            </div>
                            <input
                                type="number"
                                min={200}
                                max={2000}
                                step={50}
                                value={formSettings.chunkSize}
                                onChange={(e) =>
                                    updateFormSetting("chunkSize", Number(e.target.value))
                                }
                                className={cn(
                                    "h-9 w-full rounded-xl border bg-background px-3 text-xs outline-none focus:ring-2",
                                    validationErrors.chunkSize
                                        ? "border-destructive focus:ring-destructive/30"
                                        : "border-input focus:ring-ring"
                                )}
                            />
                            {validationErrors.chunkSize ? (
                                <p className="text-[11px] text-destructive font-medium">
                                    {validationErrors.chunkSize}
                                </p>
                            ) : (
                                <p className="text-[11px] text-muted-foreground">
                                    Target token length for code chunks generated by TokenTextSplitter.
                                </p>
                            )}
                        </div>

                        {/* Max File Size */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-foreground">
                                    Max Indexed File Size (KB)
                                </label>
                                <span className="font-mono text-xs text-muted-foreground">
                                    {formSettings.maxFileKb} KB
                                </span>
                            </div>
                            <input
                                type="number"
                                min={10}
                                max={1000}
                                step={10}
                                value={formSettings.maxFileKb}
                                onChange={(e) =>
                                    updateFormSetting("maxFileKb", Number(e.target.value))
                                }
                                className={cn(
                                    "h-9 w-full rounded-xl border bg-background px-3 text-xs outline-none focus:ring-2",
                                    validationErrors.maxFileKb
                                        ? "border-destructive focus:ring-destructive/30"
                                        : "border-input focus:ring-ring"
                                )}
                            />
                            {validationErrors.maxFileKb ? (
                                <p className="text-[11px] text-destructive font-medium">
                                    {validationErrors.maxFileKb}
                                </p>
                            ) : (
                                <p className="text-[11px] text-muted-foreground">
                                    Files larger than this limit are safely skipped during indexing.
                                </p>
                            )}
                        </div>

                        {/* Default Branch */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">
                                Default Branch Override
                            </label>
                            <input
                                type="text"
                                value={formSettings.defaultBranch}
                                onChange={(e) =>
                                    updateFormSetting("defaultBranch", e.target.value)
                                }
                                placeholder="main"
                                className={cn(
                                    "h-9 w-full rounded-xl border bg-background px-3 text-xs outline-none focus:ring-2",
                                    validationErrors.defaultBranch
                                        ? "border-destructive focus:ring-destructive/30"
                                        : "border-input focus:ring-ring"
                                )}
                            />
                            {validationErrors.defaultBranch ? (
                                <p className="text-[11px] text-destructive font-medium">
                                    {validationErrors.defaultBranch}
                                </p>
                            ) : (
                                <p className="text-[11px] text-muted-foreground">
                                    Fallback git branch if default branch is not returned by GitHub.
                                </p>
                            )}
                        </div>
                    </div>
                </SettingsSection>

                {/* Appearance */}
                <SettingsSection title="Appearance">
                    <SettingsRow
                        label="Theme"
                        description="Switch between light and dark visual mode"
                        action={
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl"
                                onClick={() => setTheme(isDark ? "light" : "dark")}
                            >
                                {isDark ? (
                                    <Sun className="size-3.5 mr-1.5 text-amber-500" />
                                ) : (
                                    <Moon className="size-3.5 mr-1.5 text-indigo-500" />
                                )}
                                {isDark ? "Light mode" : "Dark mode"}
                            </Button>
                        }
                    />
                </SettingsSection>

                {/* Onboarding & Help */}
                <SettingsSection title="Onboarding & Guides">
                    <SettingsRow
                        label="Replay Onboarding Tour"
                        description="Launch the interactive onboarding walkthrough to review capabilities and setup"
                        action={
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl"
                                onClick={() => setOnboardingWizardOpen(true)}
                            >
                                <Compass className="size-3.5 mr-1.5 text-blue-500" />
                                Start Tour
                            </Button>
                        }
                    />
                </SettingsSection>

                {/* Account & Destructive Action Protection */}
                <SettingsSection title="Account & Session">
                    <SettingsRow
                        label="Sign Out"
                        description="Terminate current session and clear local authorization cookies"
                        action={
                            <Button
                                variant="destructive"
                                size="sm"
                                className="rounded-xl"
                                onClick={() => setConfirmSignoutOpen(true)}
                            >
                                <LogOut className="size-3.5 mr-1.5" />
                                Sign out
                            </Button>
                        }
                    />
                </SettingsSection>
            </div>

            {/* Destructive Action Protection: Sign Out Confirmation Dialog */}
            <ConfirmDialog
                open={confirmSignoutOpen}
                onOpenChange={setConfirmSignoutOpen}
                title="Sign out of CodeMind?"
                description="Are you sure you want to end your session? You will be redirected to the sign-in page."
                confirmText="Sign out"
                variant="destructive"
                onConfirm={() => {
                    void logout();
                }}
            />
        </AppShell>
    );
}
