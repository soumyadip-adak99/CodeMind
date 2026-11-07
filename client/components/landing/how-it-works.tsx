"use client";

import { motion } from "framer-motion";
import {
    ArrowRight,
    BrainCircuit,
    CheckCircle2,
    Code2,
    Cpu,
    Database,
    FileCode2,
    FolderGit2,
    Lock,
    MessageSquare,
    Network,
    Sparkles,
    Zap,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";

const STEPS = [
    {
        stepNumber: "01",
        badge: "Step 1: Quick Connection",
        title: "Connect your GitHub account",
        description:
            "Sign in with GitHub and select the repositories you want to explore. CodeMind requests strictly read-only access—we never commit code, modify branches, or alter your git history.",
        techPills: ["One-Click GitHub Sign In", "Read-Only Safety", "Public & Private Repos"],
        icon: FaGithub,
        iconColor: "text-zinc-200 bg-zinc-500/10 border-zinc-500/20",
    },
    {
        stepNumber: "02",
        badge: "Step 2: Smart Indexing",
        title: "We map your codebase",
        description:
            "CodeMind automatically scans your file tree, removes build artifacts and lockfile clutter, and breaks down classes and functions into semantic chunks so the AI understands real project context.",
        techPills: ["Noise & Lockfile Filtering", "Syntax-Aware Chunks", "Fast Background Indexing"],
        icon: Database,
        iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
        stepNumber: "03",
        badge: "Step 3: Direct Answers",
        title: "Ask anything and inspect the sources",
        description:
            "Ask questions in plain English about architecture, data flows, or bug symptoms. CodeMind returns concise explanations accompanied by the exact files and line numbers where the code lives.",
        techPills: ["Plain-English Questions", "Exact File & Line Numbers", "Clickable Code Citations"],
        icon: MessageSquare,
        iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 md:py-32 relative z-10 bg-background overflow-hidden border-t border-border/60">
            {/* Background Light Beam */}
            <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-primary/5 blur-[140px] pointer-events-none rounded-full" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
                        <Sparkles className="size-3.5" />
                        <span>How It Works</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-sans text-foreground mb-4">
                        From GitHub to answers in three steps.
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        No complex plugins to install or machine learning models to configure. 
                        Sign in, select your repository, and start asking questions in under a minute.
                    </p>
                </div>

                {/* 3 Step Connected Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
                    {STEPS.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.15 }}
                                viewport={{ once: true, margin: "-50px" }}
                                className="relative rounded-3xl border border-border/80 bg-card/60 p-7 sm:p-8 backdrop-blur-xl flex flex-col justify-between hover:border-primary/40 hover:bg-card/90 transition-all duration-300 shadow-sm hover:shadow-xl group"
                            >
                                <div>
                                    {/* Step Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div
                                            className={cn(
                                                "size-12 rounded-2xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-105",
                                                step.iconColor
                                            )}
                                        >
                                            <Icon className="size-6" />
                                        </div>
                                        <span className="text-xs font-mono font-bold text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/60">
                                            {step.stepNumber}
                                        </span>
                                    </div>

                                    {/* Step Info */}
                                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-primary mb-1.5 block">
                                        {step.badge}
                                    </span>
                                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-normal">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Tech Pills */}
                                <div className="pt-4 border-t border-border/60 flex flex-wrap gap-1.5">
                                    {step.techPills.map((pill, pIdx) => (
                                        <span
                                            key={pIdx}
                                            className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-muted/70 text-muted-foreground border border-border/50"
                                        >
                                            {pill}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
