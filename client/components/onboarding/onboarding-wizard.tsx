"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUIStore } from "@/store/ui-store";
import { useCurrentUser } from "@/hooks/use-auth";
import { useRepos, useStartIndexing } from "@/hooks/use-repo";
import { safeLocalStorageGet, safeLocalStorageSet, STORAGE_KEYS } from "@/lib/storage";
import {
    BrainCircuit,
    Check,
    ChevronRight,
    FolderGit2,
    Layers,
    MessageSquare,
    Sparkles,
    Zap,
    X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function OnboardingWizard() {
    const router = useRouter();
    const { data: user } = useCurrentUser();
    const { data: repos, isLoading: reposLoading } = useRepos();
    const startIndexing = useStartIndexing();
    const { theme, setTheme } = useTheme();

    const { onboardingWizardOpen, setOnboardingWizardOpen } = useUIStore();
    const [step, setStep] = useState(1);
    const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);
    const [preferences, setPreferences] = useState({
        preferredTheme: "system",
        defaultBranch: "main",
        enableAutoSync: true,
    });

    const totalSteps = 3;

    // Check on mount if user hasn't completed onboarding yet (new users only)
    useEffect(() => {
        if (!user) return;
        const userOnboardingKey = `${STORAGE_KEYS.ONBOARDING_COMPLETED}_${user.id}`;
        const isCompleted =
            safeLocalStorageGet(userOnboardingKey, false) ||
            safeLocalStorageGet(STORAGE_KEYS.ONBOARDING_COMPLETED, false);

        if (isCompleted) {
            return;
        }

        // Wait until repos have finished loading to prevent false onboarding prompt
        if (reposLoading) {
            return;
        }

        // If the user already has repositories in the database that are indexed or processed,
        // they are an existing user who previously set up their account!
        const isExistingUser =
            repos &&
            repos.length > 0 &&
            repos.some(
                (r) => r.indexStatus === "READY" || r.chunkCount > 0 || r.indexedAt !== null
            );

        if (isExistingUser) {
            safeLocalStorageSet(userOnboardingKey, true);
            safeLocalStorageSet(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
            return;
        }

        // New users only: trigger onboarding
        setOnboardingWizardOpen(true);
    }, [user, repos, reposLoading, setOnboardingWizardOpen]);

    const handleComplete = (shouldIndex = false) => {
        if (user) {
            safeLocalStorageSet(`${STORAGE_KEYS.ONBOARDING_COMPLETED}_${user.id}`, true);
        }
        safeLocalStorageSet(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
        safeLocalStorageSet(STORAGE_KEYS.WORKSPACE_SETTINGS, preferences);
        setOnboardingWizardOpen(false);

        if (shouldIndex && selectedRepoId) {
            startIndexing.mutate(selectedRepoId);
        }

        // Redirect to dashboard page for new users
        router.push("/dashboard");
    };

    const handleSkip = () => {
        if (user) {
            safeLocalStorageSet(`${STORAGE_KEYS.ONBOARDING_COMPLETED}_${user.id}`, true);
        }
        safeLocalStorageSet(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
        setOnboardingWizardOpen(false);
        router.push("/dashboard");
    };

    return (
        <Dialog open={onboardingWizardOpen} onOpenChange={setOnboardingWizardOpen}>
            <DialogContent showCloseButton={false} className="max-w-lg p-0 overflow-hidden rounded-3xl border border-border/80 shadow-2xl">
                {/* Stepper Progress Header */}
                <div className="bg-muted/40 p-6 pb-4 border-b">
                    <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        <span>Step {step} of {totalSteps}</span>
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                            <span>Skip setup</span>
                            <X className="size-3.5" />
                        </button>
                    </div>
                    <Progress value={(step / totalSteps) * 100} className="h-1.5" />
                </div>

                <div className="p-6">
                    {/* ── Step 1: Welcome ──────────────────────────────────── */}
                    {step === 1 && (
                        <div className="space-y-5 text-center">
                            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 shadow-inner">
                                <BrainCircuit className="size-8" />
                            </div>

                            <div className="space-y-1.5">
                                <h3 className="text-xl font-bold tracking-tight">
                                    Welcome to CodeMind, {user?.displayName ?? "Developer"}!
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    CodeMind connects to your GitHub repositories, indexes your source code
                                    into high-dimensional vector embeddings, and enables natural language AI chat.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
                                <div className="rounded-xl border border-border/60 bg-card p-3 flex flex-col gap-2">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                                        <FolderGit2 className="size-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="font-semibold text-xs text-foreground">Sync Repos</p>
                                        <p className="text-[11px] text-muted-foreground leading-snug">GitHub OAuth integration</p>
                                    </div>
                                </div>
                                <div className="rounded-xl border border-border/60 bg-card p-3 flex flex-col gap-2">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 shrink-0">
                                        <Layers className="size-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="font-semibold text-xs text-foreground">Vector Index</p>
                                        <p className="text-[11px] text-muted-foreground leading-snug">pgvector cosine storage</p>
                                    </div>
                                </div>
                                <div className="rounded-xl border border-border/60 bg-card p-3 flex flex-col gap-2">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                                        <MessageSquare className="size-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="font-semibold text-xs text-foreground">Chat with Code</p>
                                        <p className="text-[11px] text-muted-foreground leading-snug">RAG citations & context</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-3">
                                <Button onClick={() => setStep(2)} className="w-full sm:w-auto">
                                    Get Started
                                    <ChevronRight className="ml-1 size-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ── Step 2: Preferences ──────────────────────────────── */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <div>
                                <h3 className="text-lg font-bold tracking-tight">Customize Your Workspace</h3>
                                <p className="text-xs text-muted-foreground">
                                    Set your initial configuration. You can change these anytime in Settings.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">
                                        Interface Theme
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: "light", label: "Light" },
                                            { id: "dark", label: "Dark" },
                                            { id: "system", label: "System" },
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => {
                                                    setTheme(t.id);
                                                    setPreferences((p) => ({ ...p, preferredTheme: t.id }));
                                                }}
                                                className={cn(
                                                    "flex items-center justify-center rounded-xl border p-2.5 text-xs font-medium transition-all",
                                                    theme === t.id
                                                        ? "border-primary bg-primary/10 text-primary font-semibold ring-2 ring-primary/20"
                                                        : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/50"
                                                )}
                                            >
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">
                                        Default Branch for Indexing
                                    </label>
                                    <input
                                        type="text"
                                        value={preferences.defaultBranch}
                                        onChange={(e) =>
                                            setPreferences((p) => ({ ...p, defaultBranch: e.target.value }))
                                        }
                                        placeholder="main"
                                        className="h-9 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-ring"
                                    />
                                    <p className="text-[11px] text-muted-foreground">
                                        The branch CodeMind pulls files from during indexing.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3">
                                <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                                    Back
                                </Button>
                                <Button size="sm" onClick={() => setStep(3)}>
                                    Continue
                                    <ChevronRight className="ml-1 size-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ── Step 3: Pick First Repo ───────────────────────────── */}
                    {step === 3 && (
                        <div className="space-y-5">
                            <div>
                                <h3 className="text-lg font-bold tracking-tight">Select a Repository to Index</h3>
                                <p className="text-xs text-muted-foreground">
                                    Choose one of your synced repositories to begin neural indexing.
                                </p>
                            </div>

                            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                                {repos && repos.length > 0 ? (
                                    repos.slice(0, 10).map((repo) => (
                                        <div
                                            key={repo.id}
                                            onClick={() => setSelectedRepoId(repo.id)}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
                                                selectedRepoId === repo.id
                                                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                                                    : "border-border/60 hover:bg-muted/40"
                                            )}
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <FolderGit2 className="size-4 shrink-0 text-muted-foreground" />
                                                <div className="truncate">
                                                    <p className="text-xs font-semibold truncate">{repo.fullName}</p>
                                                    <p className="text-[10px] text-muted-foreground">
                                                        {repo.language ?? "Code"} · {repo.isPrivate ? "Private" : "Public"}
                                                    </p>
                                                </div>
                                            </div>
                                            {selectedRepoId === repo.id && (
                                                <div className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                                                    <Check className="size-3" />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-xs text-muted-foreground">
                                        No repositories synced yet. You can sync from the dashboard.
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-3">
                                <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                                    Back
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleComplete(false)}
                                    >
                                        Skip Indexing
                                    </Button>
                                    <Button
                                        size="sm"
                                        disabled={!selectedRepoId}
                                        onClick={() => handleComplete(true)}
                                    >
                                        <Zap className="mr-1.5 size-3.5" />
                                        Index & Go to Dashboard
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

