"use client";

import { motion } from "framer-motion";
import { Laptop, Server, Database, BrainCircuit } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";

export function ArchitectureDiagram() {
    return (
        <section className="py-24 relative z-10 bg-background overflow-hidden border-y border-border/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-geist-sans mb-4 text-foreground">
                        Under the hood
                    </h2>
                    <p className="text-lg text-muted-foreground font-medium">
                        A robust, scalable architecture powered by a high-performance backend, vector database, and AI embeddings.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto relative aspect-[2/1] w-full flex items-center justify-center mt-20">
                    
                    {/* SVG Connections (Animated with Framer Motion) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
                        {/* Client to Server */}
                        <g>
                            <path d="M 150 250 L 500 250" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" />
                            <motion.path
                                d="M 150 250 L 500 250"
                                stroke="rgba(168,85,247,0.6)"
                                strokeWidth="2"
                                strokeDasharray="100 100"
                                fill="none"
                                animate={{ strokeDashoffset: [200, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                        </g>

                        {/* Server to GitHub */}
                        <g>
                            <path d="M 500 250 C 650 250, 700 100, 850 100" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" />
                            <motion.path
                                d="M 500 250 C 650 250, 700 100, 850 100"
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth="2"
                                strokeDasharray="100 100"
                                fill="none"
                                animate={{ strokeDashoffset: [200, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
                            />
                        </g>

                        {/* Server to Vector DB */}
                        <g>
                            <path d="M 500 250 C 650 250, 700 400, 850 400" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" />
                            <motion.path
                                d="M 500 250 C 650 250, 700 400, 850 400"
                                stroke="rgba(168,85,247,0.6)"
                                strokeWidth="2"
                                strokeDasharray="100 100"
                                fill="none"
                                animate={{ strokeDashoffset: [200, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                            />
                        </g>

                        {/* Server to AI Model */}
                        <g>
                            <path d="M 500 250 L 850 250" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" />
                            <motion.path
                                d="M 500 250 L 850 250"
                                stroke="rgba(6,182,212,0.6)"
                                strokeWidth="2"
                                strokeDasharray="100 100"
                                fill="none"
                                animate={{ strokeDashoffset: [200, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1.5 }}
                            />
                        </g>
                    </svg>

                    {/* Nodes using precise percentage positioning matching 1000x500 viewBox */}
                    
                    {/* 1. Client (15%, 50%) */}
                    <motion.div 
                        className="absolute left-[15%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3"
                        initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center justify-center relative z-10">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl pointer-events-none" />
                            <Laptop className="w-6 h-6 text-black/80 dark:text-black dark:text-white/80" />
                        </div>
                        <span className="text-[10px] font-geist-mono font-medium uppercase tracking-[0.2em] text-muted-foreground relative z-10">Client</span>
                    </motion.div>

                    {/* 2. Server (50%, 50%) */}
                    <motion.div 
                        className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3"
                        initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="w-20 h-20 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-primary/30 shadow-[0_0_40px_rgba(var(--primary),0.15)] flex items-center justify-center relative z-10">
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl pointer-events-none" />
                            <Server className="w-8 h-8 text-primary" />
                        </div>
                        <span className="text-[10px] font-geist-mono font-medium uppercase tracking-[0.2em] text-primary relative z-10">Server</span>
                    </motion.div>

                    {/* 3. GitHub (85%, 20%) */}
                    <motion.div 
                        className="absolute left-[85%] top-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3"
                        initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center justify-center relative z-10">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl pointer-events-none" />
                            <FaGithub className="w-6 h-6 text-black/80 dark:text-black dark:text-white/80" />
                        </div>
                        <span className="text-[10px] font-geist-mono font-medium uppercase tracking-[0.2em] text-muted-foreground relative z-10">GitHub API</span>
                    </motion.div>

                    {/* 4. AI Embeddings (85%, 50%) */}
                    <motion.div 
                        className="absolute left-[85%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3"
                        initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-cyan-500/20 shadow-[0_4px_20px_rgba(6,182,212,0.1)] flex items-center justify-center relative z-10">
                            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent rounded-2xl pointer-events-none" />
                            <BrainCircuit className="w-6 h-6 text-cyan-400" />
                        </div>
                        <span className="text-[10px] font-geist-mono font-medium uppercase tracking-[0.2em] text-cyan-400 relative z-10">Embedding</span>
                    </motion.div>

                    {/* 5. Vector DB (85%, 80%) */}
                    <motion.div 
                        className="absolute left-[85%] top-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3"
                        initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-purple-500/20 shadow-[0_4px_20px_rgba(168,85,247,0.1)] flex items-center justify-center relative z-10">
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent rounded-2xl pointer-events-none" />
                            <Database className="w-6 h-6 text-purple-400" />
                        </div>
                        <span className="text-[10px] font-geist-mono font-medium uppercase tracking-[0.2em] text-purple-400 relative z-10">Vector DB</span>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
