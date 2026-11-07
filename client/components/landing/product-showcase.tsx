"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    Clock,
    Code2,
    Database,
    ExternalLink,
    FileCode2,
    FolderGit2,
    Layers,
    MessageSquare,
    Play,
    RefreshCw,
    Search,
    ShieldCheck,
    Sparkles,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeMindIcon } from "@/components/icons/code-mind";

type ShowcaseTab = "chat" | "dashboard" | "vector";

export function ProductShowcase() {
    const [activeTab, setActiveTab] = useState<ShowcaseTab>("chat");

    return (
        <section id="showcase" className="py-24 md:py-32 relative z-10 bg-background overflow-hidden border-t border-border/60">
            {/* Ambient Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
                        <Sparkles className="size-3.5" />
                        <span>Live Product Tour</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-sans text-foreground mb-4">
                        See how CodeMind works in practice.
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        Take a look inside the interface developers use to ask codebase questions, 
                        monitor repository indexing, and inspect verified source citations.
                    </p>

                    {/* Showcase Tabs */}
                    <div className="flex items-center justify-center gap-2 mt-8 p-1.5 rounded-2xl bg-muted/60 border border-border/80 w-fit mx-auto">
                        <button
                            onClick={() => setActiveTab("chat")}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                                activeTab === "chat"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                            )}
                        >
                            <MessageSquare className="size-4 text-primary" />
                            <span>Code Chat & Citations</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("dashboard")}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                                activeTab === "dashboard"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                            )}
                        >
                            <FolderGit2 className="size-4 text-blue-400" />
                            <span>Repository Management</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("vector")}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                                activeTab === "vector"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                            )}
                        >
                            <Database className="size-4 text-purple-400" />
                            <span>Semantic Code Search</span>
                        </button>
                    </div>
                </div>

                {/* Tabbed Display Viewport */}
                <div className="max-w-5xl mx-auto rounded-3xl border border-border/80 bg-card shadow-2xl overflow-hidden backdrop-blur-xl">
                    {/* Browser / Application Chrome */}
                    <div className="h-11 border-b border-border/80 bg-muted/40 px-4 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <span className="size-2.5 rounded-full bg-red-500/70" />
                                <span className="size-2.5 rounded-full bg-yellow-500/70" />
                                <span className="size-2.5 rounded-full bg-green-500/70" />
                            </div>
                            <span className="text-muted-foreground font-mono text-[11px] ml-2 hidden sm:inline">
                                app.codemind.dev — workspace
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-mono font-medium">
                                {activeTab === "chat" && "Mode: Conversational Q&A"}
                                {activeTab === "dashboard" && "Mode: Repository Sync"}
                                {activeTab === "vector" && "Mode: Semantic Code Matcher"}
                            </span>
                        </div>
                    </div>

                    {/* Active Tab Content Area */}
                    <div className="min-h-[460px] p-6 sm:p-8 bg-background/60">
                        <AnimatePresence mode="wait">
                            {/* TAB 1: AI Codebase Chat */}
                            {activeTab === "chat" && (
                                <motion.div
                                    key="chat-view"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-6"
                                >
                                    {/* User Query */}
                                    <div className="flex items-start gap-3.5 max-w-2xl">
                                        <div className="size-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                            You
                                        </div>
                                        <div className="rounded-2xl rounded-tl-sm bg-muted/50 border border-border/70 p-4 text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                                            "How are expired tokens handled during chat streaming, and where do we catch the error?"
                                        </div>
                                    </div>

                                    {/* AI Assistant Answer */}
                                    <div className="flex items-start gap-3.5">
                                        <div className="size-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 shadow-sm">
                                            <CodeMindIcon className="size-4.5 text-primary" />
                                        </div>

                                        <div className="space-y-4 flex-1 min-w-0">
                                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                                                <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                                    <CheckCircle2 className="size-3" />
                                                    94% Match Relevance
                                                </span>
                                                <span>• 3 relevant blocks found in 142ms</span>
                                            </div>

                                            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
                                                When the server stream receives a 401 Unauthorized status, 
                                                the client's <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-primary">apiFetchRaw</code> interceptor 
                                                automatically attempts a token refresh via <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-primary">POST /api/auth/refresh</code>. 
                                                If the refresh request fails, it clears local credentials and safely redirects the user to the login screen.
                                            </p>

                                            {/* Code Block Preview */}
                                            <div className="rounded-xl border border-border/80 bg-muted/40 overflow-hidden text-xs">
                                                <div className="h-7 px-3 bg-muted/60 border-b border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                                                    <span>client/lib/api.ts (lines 115-126)</span>
                                                    <span className="text-emerald-400 font-semibold">TypeScript</span>
                                                </div>
                                                <pre className="p-3.5 font-mono text-[11px] leading-relaxed overflow-x-auto text-foreground/80">
                                                    <code>{`if (res.status === 401 && path !== "/api/auth/refresh") {
    const refreshRes = await fetch("/api/auth/refresh", { 
        method: "POST", 
        credentials: "include" 
    });
    if (refreshRes.ok) {
        return apiFetchRaw(path, { ...init, headers }); // Re-try request with new token
    }
}`}</code>
                                                </pre>
                                            </div>

                                            {/* Verified Line Citations */}
                                            <div className="pt-1">
                                                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                                    Verified Source Citations:
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-mono text-foreground hover:bg-primary/10 transition-colors">
                                                        <FileCode2 className="size-3 text-primary" />
                                                        <span className="font-semibold text-primary">api.ts</span>
                                                        <span className="text-muted-foreground">(lines 115-126)</span>
                                                    </div>
                                                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-mono text-foreground hover:bg-primary/10 transition-colors">
                                                        <FileCode2 className="size-3 text-primary" />
                                                        <span className="font-semibold text-primary">chat-view.tsx</span>
                                                        <span className="text-muted-foreground">(lines 84-102)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TAB 2: Repository Management View */}
                            {activeTab === "dashboard" && (
                                <motion.div
                                    key="dashboard-view"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center justify-between pb-3 border-b border-border/60">
                                        <div>
                                            <h3 className="text-sm font-bold text-foreground">Your Repositories</h3>
                                            <p className="text-xs text-muted-foreground">Connected directly via your GitHub account</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                                                <CheckCircle2 className="size-3" />
                                                Sync Active
                                            </span>
                                        </div>
                                    </div>

                                    {/* Repo Item 1 */}
                                    <div className="rounded-xl border border-border/80 bg-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                                                <FolderGit2 className="size-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-xs sm:text-sm text-foreground">
                                                        team/core-backend
                                                    </span>
                                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
                                                        Private
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    54 files indexed · Ready for questions
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                                                <CheckCircle2 className="size-3" />
                                                READY
                                            </span>
                                            <button className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-semibold cursor-pointer">
                                                Open Chat
                                            </button>
                                        </div>
                                    </div>

                                    {/* Repo Item 2 */}
                                    <div className="rounded-xl border border-blue-500/30 bg-blue-500/[0.02] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                                                <FolderGit2 className="size-5" />
                                            </div>
                                            <div className="w-full max-w-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-xs sm:text-sm text-foreground">
                                                        team/web-client
                                                    </span>
                                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
                                                        Public
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                    <span>Indexing repository files...</span>
                                                    <span className="text-blue-400 font-mono font-bold">78%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1.5">
                                                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-[78%]" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20">
                                                <Clock className="size-3 animate-spin-slow" />
                                                INDEXING
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TAB 3: Semantic Code Search View */}
                            {activeTab === "vector" && (
                                <motion.div
                                    key="vector-view"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-4"
                                >
                                    <div className="p-4 rounded-xl border border-border/70 bg-muted/30">
                                        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-1.5">
                                            <Search className="size-3.5 text-primary" />
                                            <span>Your Question:</span>
                                        </div>
                                        <p className="text-sm font-semibold text-foreground">
                                            "How does OAuth token exchange and session cookie creation work?"
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Most Relevant Source Blocks:
                                        </p>

                                        {/* Match 1 */}
                                        <div className="rounded-xl border border-primary/30 bg-primary/[0.03] p-3.5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-bold">
                                                    01
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-foreground">
                                                        AuthController.java — exchangeToken()
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground font-mono">
                                                        Lines 48-62 · Handles temporary token exchange
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
                                                94% Match
                                            </span>
                                        </div>

                                        {/* Match 2 */}
                                        <div className="rounded-xl border border-border/80 bg-card p-3.5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center text-xs font-mono font-bold">
                                                    02
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-foreground">
                                                        OAuth2Handler.java — onAuthenticationSuccess()
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground font-mono">
                                                        Lines 37-54 · Redirects with single-use authorization code
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 font-mono text-xs font-bold border border-blue-500/20">
                                                89% Match
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
