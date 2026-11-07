"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CodeMindIcon } from "@/components/icons/code-mind";
import { FaGithub } from "react-icons/fa";
import { ArrowRight, CheckCircle2, FolderGit2 } from "lucide-react";

interface LandingFinalCtaProps {
    isAuthenticated?: boolean;
}

export function LandingFinalCta({ isAuthenticated }: LandingFinalCtaProps) {
    return (
        <section className="py-28 md:py-36 relative z-10 bg-background overflow-hidden border-t border-border/80">
            {/* Ambient Radial Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] md:w-[950px] h-[450px] bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-emerald-500/15 blur-[140px] rounded-full pointer-events-none" />

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800f_1px,transparent_1px),linear-gradient(to_bottom,#8080800f_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center flex flex-col items-center">
                {/* Brand Icon with Pulsing Rings */}
                <div className="relative mb-8">
                    <div className="absolute -inset-2.5 rounded-3xl border border-primary/20 animate-pulse" />
                    <div className="flex items-center justify-center size-16 sm:size-18 rounded-2xl bg-card border border-border shadow-[0_0_40px_rgba(var(--primary),0.2)] relative z-10">
                        <CodeMindIcon className="size-8 sm:size-9 text-primary" />
                    </div>
                </div>

                {/* Main Heading: text-balanced, wide max-w to keep 2 clean punchy lines */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans mb-5 text-foreground max-w-4xl mx-auto text-balance leading-[1.15]">
                    Stop guessing how the code works. <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                        Start asking questions.
                    </span>
                </h2>

                {/* Subtitle */}
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-balance mb-9 leading-relaxed font-normal">
                    Connect your GitHub account in 60 seconds. Explore unfamiliar repositories, understand 
                    architectural patterns, and get plain-English explanations backed by verified code lines.
                </p>

                {/* Conversion Button with symmetric, clean glow */}
                <div className="relative inline-flex items-center justify-center mb-9">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/40 via-indigo-500/40 to-purple-500/40 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-300 pointer-events-none" />
                    {isAuthenticated ? (
                        <Link
                            href="/dashboard"
                            className={cn(
                                buttonVariants({ size: "lg" }),
                                "relative z-10 inline-flex items-center justify-center gap-2.5 h-13 px-8 text-sm sm:text-base rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all duration-200 shadow-xl cursor-pointer"
                            )}
                        >
                            <FolderGit2 className="size-4.5" />
                            <span>Go to Your Dashboard</span>
                            <ArrowRight className="size-4 ml-1" />
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className={cn(
                                buttonVariants({ size: "lg" }),
                                "relative z-10 inline-flex items-center justify-center gap-2.5 h-13 px-8 text-sm sm:text-base rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all duration-200 shadow-xl cursor-pointer"
                            )}
                        >
                            <FaGithub className="size-5" />
                            <span>Connect with GitHub — It's Free</span>
                            <ArrowRight className="size-4 ml-1" />
                        </Link>
                    )}
                </div>

                {/* Reassurance Checklist: perfectly aligned flex row */}
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground font-medium">
                    <div className="inline-flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                        <span>No credit card required</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                        <span>Strictly read-only access</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                        <span>Your code never trains public AI</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
