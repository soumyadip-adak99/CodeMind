"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollStore } from "@/store/scroll-store";
import { motion, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import { HowItWorksShowcase } from "./how-it-works-showcase";

export function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null);
    const setScrollProgress = useScrollStore((state) => state.setScrollProgress);
    const setCurrentStage = useScrollStore((state) => state.setCurrentStage);
    const [activeStage, setActiveStage] = useState(0);
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    useEffect(() => {
        return scrollYProgress.on("change", (v) => {
            setScrollProgress(v);
            
            // Determine stage based on scroll progress
            let stage = 0;
            if (v < 0.33) stage = 0;
            else if (v < 0.66) stage = 1;
            else stage = 2;
            
            setCurrentStage(stage);
            setActiveStage(stage);
        });
    }, [scrollYProgress, setScrollProgress, setCurrentStage]);

    return (
        <section id="how-it-works" ref={containerRef} className="relative z-10 bg-background pt-24 pb-48">
            <div className="container mx-auto px-4 md:px-6 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    
                    {/* Left Column: Scrolling Content */}
                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute left-[15px] top-32 bottom-32 w-[2px] bg-border rounded-full hidden md:block">
                            <motion.div 
                                className="absolute top-0 w-full bg-primary rounded-full"
                                style={{ height: "100%", scaleY: scrollYProgress, transformOrigin: "top" }}
                            />
                        </div>

                        <div className="space-y-0 relative z-10">
                            {/* Step 1 */}
                            <div className={cn("min-h-screen flex flex-col justify-center pl-0 md:pl-12 transition-opacity duration-700", activeStage === 0 ? "opacity-100" : "opacity-30")}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-geist-mono text-sm shadow-[0_0_15px_rgba(var(--primary),0.2)]">1</div>
                                    <span className="font-geist-mono text-sm text-primary tracking-widest uppercase">Connect</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-geist-sans mb-6 text-foreground">
                                    Connect your repositories
                                </h2>
                                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed font-medium">
                                    Sign in securely. CodeMind instantly fetches the repositories you own, collaborate on, or have access to through organizations.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <span className="inline-flex items-center rounded-lg border border-border bg-card/50 px-4 py-2 text-sm font-geist-mono shadow-sm">OAuth 2.0</span>
                                    <span className="inline-flex items-center rounded-lg border border-border bg-card/50 px-4 py-2 text-sm font-geist-mono shadow-sm">Enterprise Identity</span>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className={cn("min-h-screen flex flex-col justify-center pl-0 md:pl-12 transition-opacity duration-700", activeStage === 1 ? "opacity-100" : "opacity-30")}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500 font-geist-mono text-sm shadow-[0_0_15px_rgba(168,85,247,0.2)]">2</div>
                                    <span className="font-geist-mono text-sm text-purple-500 tracking-widest uppercase">Index</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-geist-sans mb-6 text-foreground">
                                    Transform code to vectors
                                </h2>
                                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed font-medium">
                                    Background workers intelligently parse ASTs, filter out noise, chunk your code, and generate dense vector embeddings using specialized models.
                                </p>
                                <div className="flex flex-wrap gap-3 mb-10">
                                    <span className="inline-flex items-center rounded-lg border border-purple-500/20 bg-purple-500/5 text-purple-500 px-4 py-2 text-sm font-geist-mono shadow-sm">1536-d Embeddings</span>
                                    <span className="inline-flex items-center rounded-lg border border-border bg-card/50 px-4 py-2 text-sm font-geist-mono shadow-sm">pgvector HNSW</span>
                                </div>
                                
                                {/* Live indexing progress demo */}
                                <div className="p-5 border border-border rounded-2xl bg-card/40 backdrop-blur-xl max-w-md shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex justify-between items-center mb-4 font-geist-mono text-sm">
                                        <span className="text-foreground font-medium">Indexing core-services</span>
                                        <span className="text-purple-500 animate-pulse font-semibold">Processing...</span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                                        <motion.div 
                                            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                                            initial={{ width: "10%" }}
                                            whileInView={{ width: "85%" }}
                                            transition={{ duration: 4, ease: "easeOut" }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-3 font-geist-mono text-xs text-muted-foreground">
                                        <span>245 / 312 files</span>
                                        <span>14,503 chunks</span>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className={cn("min-h-screen flex flex-col justify-center pl-0 md:pl-12 transition-opacity duration-700", activeStage === 2 ? "opacity-100" : "opacity-30")}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 font-geist-mono text-sm shadow-[0_0_15px_rgba(6,182,212,0.2)]">3</div>
                                    <span className="font-geist-mono text-sm text-cyan-500 tracking-widest uppercase">Ask</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-geist-sans mb-6 text-foreground">
                                    Chat with your codebase
                                </h2>
                                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed font-medium">
                                    Semantic search finds the exact files and functions you need. The LLM synthesizes an accurate, context-aware answer directly from your actual code.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <span className="inline-flex items-center rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-cyan-500 px-4 py-2 text-sm font-geist-mono shadow-sm">Top-K Retrieval</span>
                                    <span className="inline-flex items-center rounded-lg border border-border bg-card/50 px-4 py-2 text-sm font-geist-mono shadow-sm">Context-aware RAG</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky HTML/Framer Visual */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24 h-[80vh] w-full rounded-3xl overflow-hidden border border-border shadow-2xl flex items-center justify-center">
                            <HowItWorksShowcase stage={activeStage} />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
