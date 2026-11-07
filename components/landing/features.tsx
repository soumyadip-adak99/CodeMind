"use client";

import { motion } from "framer-motion";
import {
    Activity,
    Cpu,
    Database,
    FileCode2,
    Layers,
    Lock,
    Search,
    ShieldCheck,
    Sparkles,
    Zap,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";

const FEATURES = [
    {
        icon: Database,
        iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        badge: "Concept Search",
        title: "Find code by meaning, not exact names",
        description:
            "Search for concepts like 'token refresh middleware' or 'webhook signature check' and CodeMind takes you straight to the right files, even if the naming doesn't match your query.",
    },
    {
        icon: FileCode2,
        iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        badge: "Zero Guesswork",
        title: "Verified line-by-line code citations",
        description:
            "Every explanation comes with exact file paths and line ranges. You can verify every claim yourself in seconds rather than trusting blind AI completions.",
    },
    {
        icon: FaGithub,
        iconColor: "text-zinc-200 bg-zinc-500/10 border-zinc-500/20",
        badge: "Public & Private",
        title: "Connects directly with your GitHub account",
        description:
            "Sign in with GitHub and access your personal projects, team repositories, and organization codebases. Setup takes less than a minute.",
    },
    {
        icon: Cpu,
        iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        badge: "Syntax Aware",
        title: "Chunks code at function & class boundaries",
        description:
            "CodeMind parses code structure instead of slicing files at arbitrary character counts. Functions, methods, and types stay intact so context is never lost.",
    },
    {
        icon: Activity,
        iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        badge: "Live Status",
        title: "Clear indexing progress and telemetry",
        description:
            "Watch files processed, chunk counts, and indexing status live as your codebase is ingested. You always know when a repository is ready to query.",
    },
    {
        icon: Layers,
        iconColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
        badge: "Multi-Project",
        title: "Separate workspaces for each repository",
        description:
            "Switch between backend APIs, frontend clients, and libraries easily. Each repository maintains its own isolated conversation history and search index.",
    },
];

export function LandingFeatures() {
    return (
        <section id="features" className="py-24 md:py-32 relative z-10 bg-background overflow-hidden">
            {/* Background Accent */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[350px] bg-primary/5 blur-[140px] pointer-events-none rounded-full" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="mb-16 md:mb-20 text-center max-w-3xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
                        <Sparkles className="size-3.5" />
                        <span>Built for Everyday Engineering</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-sans text-foreground mb-4">
                        Everything you need to navigate your codebase.
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        Practical capabilities built to solve the frustration of reading unfamiliar repositories, 
                        tracing complex data paths, and getting new developers productive quickly.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {FEATURES.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.08 }}
                                viewport={{ once: true, margin: "-50px" }}
                                className="group relative rounded-2xl border border-border/70 bg-card/60 p-6 sm:p-7 backdrop-blur-md flex flex-col justify-between hover:border-primary/40 hover:bg-card/90 transition-all duration-300 shadow-sm hover:shadow-xl"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-5">
                                        <div
                                            className={cn(
                                                "size-11 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-105",
                                                feature.iconColor
                                            )}
                                        >
                                            <Icon className="size-5.5" />
                                        </div>
                                        <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-md bg-muted/70 text-muted-foreground border border-border/60">
                                            {feature.badge}
                                        </span>
                                    </div>

                                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
