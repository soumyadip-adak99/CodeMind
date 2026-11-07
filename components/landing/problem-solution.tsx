"use client";

import { CheckCircle2, FileQuestion, Sparkles, XCircle, SearchX, Bot, Users, Clock, Compass, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const PAIN_POINTS = [
    {
        icon: FileQuestion,
        title: "Documentation that goes stale immediately",
        description: "Wikis, architecture diagrams, and READMEs are outdated the moment a feature branch merges into main.",
    },
    {
        icon: SearchX,
        title: "Search that only matches exact words",
        description: "Grep and IDE search can't answer conceptual questions. They won't tell you how a payment flows between services.",
    },
    {
        icon: Bot,
        title: "Generic AI chatbots that invent non-existent code",
        description: "Copy-pasting snippets into external AI tools produces plausible-sounding code that references classes and methods that don't exist in your repo.",
    },
    {
        icon: Users,
        title: "Constantly interrupting senior developers",
        description: "New hires spend days waiting on Slack replies just to learn where an environment variable or endpoint is configured.",
    },
];

const ADVANTAGES = [
    {
        icon: Clock,
        title: "Always synced with your actual code",
        description: "CodeMind indexes directly from your repository branch. The moment you push updates, your answers reflect the latest code.",
    },
    {
        icon: Compass,
        title: "Finds the right code by meaning, not keywords",
        description: "Ask 'How do we verify webhooks?' and CodeMind identifies the right handler, even if the method is named processSignature().",
    },
    {
        icon: ShieldCheck,
        title: "Verified file and line citations with every answer",
        description: "You never have to take an AI's word for it. Click through directly to the exact file names and line ranges that back up the explanation.",
    },
    {
        icon: Zap,
        title: "New teammates start contributing on day one",
        description: "Engineers can independently explore the codebase, understand architectural conventions, and deliver their first pull request faster.",
    },
];

export function ProblemSolution() {
    return (
        <section className="py-24 md:py-32 relative z-10 bg-background overflow-hidden border-t border-border/60">
            {/* Background Glow */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
                        <Sparkles className="size-3.5" />
                        <span>The Reality of Modern Codebases</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-sans text-foreground mb-4">
                        Codebases grow fast. <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground">
                            Understanding them shouldn't be so slow.
                        </span>
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        Developers spend more time reading unfamiliar code than writing new features. 
                        Here is what changes when you give your team an intelligent index of their repositories.
                    </p>
                </div>

                {/* Comparison Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* The Old Way */}
                    <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.02] p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-500/15">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                                    <XCircle className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">Without CodeMind</h3>
                                    <p className="text-xs text-muted-foreground">Keyword search, outdated wikis, and waiting on teammate replies</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {PAIN_POINTS.map((item, idx) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={idx} className="flex items-start gap-3.5">
                                            <div className="size-6 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                                                <Icon className="size-3.5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-foreground mb-1">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-red-500/10 text-xs font-mono text-red-400/80">
                            The cost: Hours lost every week to code archaeology and interrupted sprints
                        </div>
                    </div>

                    {/* The CodeMind Way */}
                    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/[0.03] p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-[0_0_40px_rgba(16,185,129,0.06)]">
                        <div>
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-500/20">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 shadow-sm">
                                    <CheckCircle2 className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                        <span>With CodeMind</span>
                                        <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            Instant Clarity
                                        </span>
                                    </h3>
                                    <p className="text-xs text-muted-foreground">Direct answers backed by verified files and line numbers</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {ADVANTAGES.map((item, idx) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={idx} className="flex items-start gap-3.5">
                                            <div className="size-6 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                                <Icon className="size-3.5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-foreground mb-1">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-emerald-500/15 text-xs font-mono text-emerald-400">
                            The outcome: Confident answers in seconds, backed by exact code lines
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
