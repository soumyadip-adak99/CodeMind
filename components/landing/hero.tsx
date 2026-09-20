"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquareCode } from "lucide-react";

interface LandingHeroProps {
    isAuthenticated?: boolean;
}

export function LandingHero({ isAuthenticated }: LandingHeroProps) {
    return (
        <section className="relative min-h-[95vh] flex flex-col justify-center overflow-hidden pt-32 pb-20 bg-background">
            {/* Simple, sleek CSS background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
            
            {/* Floating Glassmorphism Cards */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div 
                    initial={{ opacity: 0, x: -50, y: 0 }}
                    animate={{ opacity: 1, x: 0, y: [0, -20, 0] }} 
                    transition={{ 
                        opacity: { duration: 0.8, delay: 0.2 },
                        x: { type: "spring", stiffness: 50, delay: 0.2 },
                        y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 } 
                    }}
                    className="hidden lg:flex absolute top-1/4 left-[10%] bg-card/60 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl shadow-2xl items-center gap-4 w-64"
                >
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-foreground">CodeMind Indexed</div>
                        <div className="text-xs text-muted-foreground">3,204 files processed</div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 50, y: 0 }}
                    animate={{ opacity: 1, x: 0, y: [0, 20, 0] }} 
                    transition={{ 
                        opacity: { duration: 0.8, delay: 0.4 },
                        x: { type: "spring", stiffness: 50, delay: 0.4 },
                        y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 } 
                    }}
                    className="hidden lg:flex absolute bottom-1/3 right-[10%] bg-card/60 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl shadow-2xl items-start gap-4 w-72"
                >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 mt-1">
                        <MessageSquareCode className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-foreground mb-1">How does auth work?</div>
                        <div className="text-xs text-muted-foreground leading-relaxed">
                            "Authentication uses JWT tokens verified via <code className="bg-muted px-1 rounded">JwtAuthFilter</code>..."
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 mt-4">
                <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-background/50 backdrop-blur-xl px-4 py-1.5 text-sm font-geist-mono mb-8 shadow-sm hover:border-primary/50 transition-colors">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-primary mr-3 animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]"></span>
                        <span className="text-muted-foreground font-medium">GitHub <span className="mx-2 text-primary/40">→</span> Vector index <span className="mx-2 text-primary/40">→</span> Answers</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-[-0.04em] font-geist-sans leading-[1.05] mb-8 text-foreground">
                        Ask your codebase <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-cyan-500 animate-gradient-x">anything.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl leading-relaxed font-medium">
                        CodeMind turns your repositories into a searchable AI knowledge base. 
                        Understand any architecture, find security issues, or ask "how does this work?" in seconds.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-5 mb-20 w-full justify-center">
                        <div className="relative group w-full sm:w-auto">
                            <div className="absolute -inset-1.5 bg-gradient-to-r from-primary via-purple-500 to-cyan-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-gradient-x"></div>
                            {isAuthenticated ? (
                                <Link 
                                    href="/dashboard"
                                    className={cn(buttonVariants({ size: "lg" }), "relative flex items-center justify-center h-14 px-10 text-lg rounded-full w-full shadow-2xl bg-white text-black dark:bg-white dark:text-black hover:bg-gray-50 hover:scale-[1.02] transition-all duration-300 ring-1 ring-black/5")}
                                >
                                    <span className="font-semibold tracking-tight whitespace-nowrap">Open dashboard</span>
                                </Link>
                            ) : (
                                <Link 
                                    href="/login"
                                    className={cn(buttonVariants({ size: "lg" }), "relative flex items-center justify-center h-14 px-10 text-lg rounded-full w-full shadow-2xl bg-white text-black dark:bg-white dark:text-black hover:bg-gray-50 hover:scale-[1.02] transition-all duration-300 ring-1 ring-black/5")}
                                >
                                    <span className="font-semibold tracking-tight whitespace-nowrap">Get Started</span>
                                </Link>
                            )}
                        </div>
                        <Link 
                            href="#features"
                            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 px-10 text-lg rounded-full w-full sm:w-auto border-border/50 hover:bg-muted/50 backdrop-blur-sm transition-all duration-300")}
                        >
                            Explore Features
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-border/30 w-full max-w-3xl">
                        <div className="flex flex-col items-center gap-2">
                            <span className="font-geist-mono text-xs text-muted-foreground/80 uppercase tracking-widest font-semibold">SLA</span>
                            <span className="text-base font-medium">99.9% Uptime</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="font-geist-mono text-xs text-muted-foreground/80 uppercase tracking-widest font-semibold">Deployment</span>
                            <span className="text-base font-medium">Cloud & On-Premise</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="font-geist-mono text-xs text-muted-foreground/80 uppercase tracking-widest font-semibold">Security</span>
                            <span className="text-base font-medium">SOC2 Compliant (Prep)</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
