"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Database, FileCode2, Blocks, Cpu, Sparkles, CheckCircle2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useEffect, useState } from "react";

interface ShowcaseProps {
    stage: number;
}

export function HowItWorksShowcase({ stage }: ShowcaseProps) {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-8 overflow-hidden bg-background">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            <AnimatePresence mode="wait">
                {stage === 0 && <ConnectShowcase key="stage0" />}
                {stage === 1 && <IndexShowcase key="stage1" />}
                {stage === 2 && <AskShowcase key="stage2" />}
            </AnimatePresence>
        </div>
    );
}

// ==========================================
// STAGE 0: CONNECT
// ==========================================
function ConnectShowcase() {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md relative flex flex-col items-center justify-center h-[320px] rounded-2xl border border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden"
        >
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.05),transparent_70%)]" />

            <div className="flex items-center justify-between w-full relative z-10 px-10">
                {/* GitHub Source */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="w-16 h-16 rounded-[20px] bg-gradient-to-b from-[#24292f] to-[#040d21] border border-black/10 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex items-center justify-center relative group">
                        <div className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <FaGithub className="w-8 h-8 text-black dark:text-white" />
                    </div>
                    <span className="text-[11px] font-geist-mono text-muted-foreground uppercase tracking-wider font-semibold">Source</span>
                </motion.div>

                {/* Animated Connection Line */}
                <div className="flex-1 relative mx-4 h-[1px] flex items-center">
                    {/* Faint track */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent"></div>
                    
                    {/* Beam container (clips the animation) */}
                    <div className="absolute inset-0 overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
                        {/* Moving Beam */}
                        <motion.div 
                            className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        >
                            {/* Hot leading edge/dot */}
                            <div className="absolute top-1/2 right-[20%] -translate-y-1/2 w-[3px] h-[3px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,1)] blur-[0.5px]"></div>
                        </motion.div>
                    </div>

                    {/* Floating Auth Token */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 px-3 py-1 rounded-full text-[10px] font-geist-mono text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.15)] z-10 whitespace-nowrap backdrop-blur-md">
                        OAuth 2.0
                    </div>
                </div>

                {/* CodeMind Destination */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="w-16 h-16 rounded-[20px] bg-gradient-to-b from-primary/20 to-primary/5 border border-primary/20 shadow-[0_8px_30px_rgba(var(--primary),0.2)] flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-primary/10 blur-xl rounded-2xl"></div>
                        <Database className="w-7 h-7 text-primary" />
                    </div>
                    <span className="text-[11px] font-geist-mono text-muted-foreground uppercase tracking-wider font-semibold">CodeMind</span>
                </motion.div>
            </div>

            {/* Syncing Status Box */}
            <motion.div 
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute bottom-6 left-6 right-6 bg-white dark:bg-[#121212]/80 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-xl p-3 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-3 h-3">
                        <div className="absolute w-full h-full bg-emerald-500/30 rounded-full animate-ping"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    </div>
                    <span className="text-sm font-medium text-foreground/90">Syncing repositories</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-geist-mono text-muted-foreground bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md border border-black/5 dark:border-white/5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500/70" />
                    Secure TLS
                </div>
            </motion.div>
        </motion.div>
    );
}

// ==========================================
// STAGE 1: INDEX
// ==========================================
function IndexShowcase() {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md h-[320px] relative z-10 flex flex-col justify-center gap-6"
        >
            {/* Code Parsing */}
            <div className="flex items-center justify-between gap-4">
                <motion.div 
                    initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                    className="flex-1 bg-gradient-to-b from-[#1c1c1e] to-[#121212] border border-black/10 dark:border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-xl"
                >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <FileCode2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="h-1.5 w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-purple-500" animate={{ width: ["0%", "100%"] }} transition={{ duration: 2, repeat: Infinity }} />
                        </div>
                        <div className="h-1.5 w-2/3 bg-black/5 dark:bg-white/5 rounded-full"></div>
                    </div>
                </motion.div>
                
                <motion.div 
                    animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="w-8 h-8 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center shrink-0"
                >
                    <Cpu className="w-4 h-4 text-muted-foreground" />
                </motion.div>
                
                <motion.div 
                    initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                    className="flex-1 bg-gradient-to-b from-[#1c1c1e] to-[#121212] border border-black/10 dark:border-white/10 rounded-2xl p-4 shadow-xl flex justify-center items-center h-[74px]"
                >
                    <div className="flex flex-wrap gap-1.5 w-[70px] justify-center">
                        {[...Array(6)].map((_, i) => (
                            <motion.div 
                                key={i}
                                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
                                className="w-4 h-4 bg-purple-500/20 border border-purple-500/40 rounded-[4px]"
                            />
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Vector Database */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                className="bg-gradient-to-b from-[#121212] to-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden"
            >
                {/* Subtle top highlight */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full"></div>
                
                <div className="flex items-center justify-between mb-5 relative z-10">
                    <div className="flex items-center gap-3">
                        <Blocks className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-medium text-foreground/90">pgvector Index</span>
                    </div>
                    <span className="text-[10px] font-geist-mono text-purple-400/80 bg-purple-500/10 px-2 py-1 rounded-md border border-purple-500/20">HNSW</span>
                </div>
                
                <div className="space-y-2.5 relative z-10">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50"></div>
                            <span className="text-[10px] text-muted-foreground font-geist-mono w-14 uppercase tracking-wider">Chunk {i+1}</span>
                            <div className="flex-1 h-7 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-lg flex items-center px-3 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-shimmer"></div>
                                <motion.div 
                                    className="text-[11px] text-purple-300/70 font-geist-mono whitespace-nowrap"
                                    animate={{ x: [0, -60, 0] }}
                                    transition={{ repeat: Infinity, duration: 6 + i, ease: "linear" }}
                                >
                                    [ 0.124, -0.451, 0.892, 0.334, -0.115, 0.991, 0.428, -0.712, 0.054 ]
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}

// ==========================================
// STAGE 2: ASK
// ==========================================
function AskShowcase() {
    const [typedText, setTypedText] = useState("");
    const fullText = "Authentication is handled via JWT tokens in the security package. The JwtAuthFilter class verifies the token and sets the SecurityContext.";

    useEffect(() => {
        let current = "";
        const interval = setInterval(() => {
            if (current.length < fullText.length) {
                current += fullText[current.length];
                setTypedText(current);
            } else {
                clearInterval(interval);
            }
        }, 20);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[320px] relative z-10"
        >
            {/* Top border highlight */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

            {/* Header */}
            <div className="px-5 py-4 border-b border-black/5 dark:border-white/5 bg-white dark:bg-[#121212] flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-foreground/90 uppercase tracking-widest font-geist-sans">Ask CodeMind</span>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-5 flex flex-col gap-5 overflow-hidden relative bg-[url('/grain.png')] bg-repeat opacity-[0.98]">
                {/* User Message */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className="self-end max-w-[85%] bg-[#1e1e1e] border border-black/10 dark:border-white/10 text-foreground/90 px-4 py-2.5 rounded-2xl rounded-tr-sm text-[13px] shadow-md"
                >
                    How does auth work here?
                </motion.div>

                {/* Processing Step */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                    className="self-start flex items-center gap-2 text-[11px] text-muted-foreground font-geist-mono bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-md border border-black/5 dark:border-white/5 shadow-sm"
                >
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500/70" />
                    Matched 3 relevant chunks
                </motion.div>

                {/* AI Response */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                    className="self-start max-w-[95%] bg-cyan-500/5 border border-cyan-500/20 px-4 py-3 rounded-2xl rounded-tl-sm text-[13px] text-foreground/90 shadow-md relative"
                >
                    <p className="leading-relaxed">
                        {typedText}
                        <span className="animate-pulse ml-1 inline-block w-1.5 h-3.5 bg-cyan-400 align-middle"></span>
                    </p>
                </motion.div>

                {/* Subtle gradient at bottom */}
                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none"></div>
            </div>
        </motion.div>
    );
}
