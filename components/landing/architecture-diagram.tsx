"use client";

import { motion } from "framer-motion";
import {
    Activity,
    BrainCircuit,
    Cpu,
    Database,
    Laptop,
    Lock,
    Server,
    ShieldCheck,
    Sparkles,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ARCHITECTURE_NODES = [
    {
        title: "Developer Workspace",
        category: "Presentation Layer",
        metric: "Real-Time Streaming",
        description: "Instant token streaming, fast keyboard commands, clear syntax highlighting, and one-click code citation navigation.",
        icon: Laptop,
        color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
        title: "Repository Ingestion",
        category: "Processing Layer",
        metric: "Automated File Parsing",
        description: "Scans project directories, strips out lockfiles and build noise, and segments classes and methods into logical units.",
        icon: Server,
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
        title: "Semantic Code Index",
        category: "Retrieval Layer",
        metric: "Sub-Second Search",
        description: "Maps code meaning into a high-dimensional search index, returning the most relevant source blocks across thousands of files in milliseconds.",
        icon: Database,
        color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
        title: "Grounded Answer Engine",
        category: "Intelligence Layer",
        metric: "Zero Hallucinations",
        description: "Synthesizes clear explanations strictly from your repository's real code blocks, always citing the exact files and line numbers.",
        icon: BrainCircuit,
        color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
];

export function ArchitectureDiagram() {
    return (
        <section id="architecture" className="py-24 md:py-32 relative z-10 bg-background overflow-hidden border-t border-border/60">
            {/* Ambient Radial Gradient */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/5 blur-[150px] pointer-events-none rounded-full" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
                        <Sparkles className="size-3.5" />
                        <span>Platform Architecture</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-sans text-foreground mb-4">
                        Engineered for speed, privacy, and scale.
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        A multi-tier architecture built to index repositories cleanly, search code conceptually,
                        and keep your proprietary intellectual property completely isolated.
                    </p>
                </div>

                {/* Architecture Flow Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {ARCHITECTURE_NODES.map((node, idx) => {
                        const Icon = node.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                className="rounded-3xl border border-border/80 bg-card/60 p-6 backdrop-blur-xl flex flex-col justify-between hover:border-primary/40 hover:bg-card/90 transition-all duration-300 shadow-sm hover:shadow-xl group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-5">
                                        <div
                                            className={cn(
                                                "size-12 rounded-2xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-105",
                                                node.color
                                            )}
                                        >
                                            <Icon className="size-6" />
                                        </div>
                                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
                                            0{idx + 1}
                                        </span>
                                    </div>

                                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-primary mb-1 block">
                                        {node.category}
                                    </span>
                                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">
                                        {node.title}
                                    </h3>
                                    <p className="text-[11px] font-mono text-muted-foreground/80 mb-3 font-semibold">
                                        {node.metric}
                                    </p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {node.description}
                                    </p>
                                </div>

                                <div className="mt-5 pt-3 border-t border-border/60 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>Active System Tier</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Data Flow Summary Card */}
                <div className="mt-12 max-w-4xl mx-auto rounded-2xl border border-border/70 bg-muted/20 p-5 sm:p-6 text-xs text-muted-foreground text-center flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-left">
                        <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Zap className="size-4" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground text-xs sm:text-sm">
                                Private, Zero-Retention Processing
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                                Strict isolation: Your proprietary code never trains public foundation models.
                            </p>
                        </div>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 shrink-0 font-medium flex items-center gap-1.5">
                        <ShieldCheck className="size-3.5" />
                        <span>Isolated Repository Partitions</span>
                    </span>
                </div>
            </div>
        </section>
    );
}
