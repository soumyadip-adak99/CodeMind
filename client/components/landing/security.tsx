"use client";

import { motion } from "framer-motion";
import {
    CheckCircle2,
    Database,
    FileCode2,
    KeyRound,
    Lock,
    Server,
    Shield,
    ShieldCheck,
    Sparkles,
    UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SECURITY_PILLARS = [
    {
        icon: KeyRound,
        title: "Encrypted at Rest",
        description:
            "Your GitHub OAuth tokens and account credentials are encrypted with industry-standard AES-256 before storage. Raw keys are never written or exposed in plaintext.",
    },
    {
        icon: UserCheck,
        title: "Strict Account Isolation",
        description:
            "Every repository index, search query, and conversation is strictly scoped to your authenticated GitHub account. Other users cannot view your code or search history.",
    },
    {
        icon: Lock,
        title: "Secure HttpOnly Sessions",
        description:
            "Session authentication uses cryptographically signed, HttpOnly SameSite cookies with automatic expiration. Browser scripts cannot inspect or extract your session secret.",
    },
    {
        icon: ShieldCheck,
        title: "Read-Only GitHub Access",
        description:
            "We only request minimal read permissions to ingest repository files. CodeMind will never commit code, create pull requests, push to branches, or modify your git history.",
    },
    {
        icon: Database,
        title: "Isolated Code Partitions",
        description:
            "Your repository embeddings are stored in isolated partitions strictly tied to your account. Your code context is never mixed with other users or teams.",
    },
    {
        icon: Shield,
        title: "Zero Model Training Guarantee",
        description:
            "Your intellectual property is never used to train or fine-tune public AI models. Queries and code chunks are processed ephemerally in memory and discarded right after generation.",
    },
];

export function LandingSecurity() {
    return (
        <section id="security" className="py-24 md:py-32 relative z-10 bg-background overflow-hidden border-t border-border/60">
            {/* Background Accent */}
            <div className="absolute left-1/4 bottom-0 w-[500px] h-[350px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
                        <Shield className="size-3.5" />
                        <span>Security & Privacy</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-sans text-foreground mb-4">
                        Your code belongs to you. Always.
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        We know that letting any tool access your repositories requires trust. 
                        Here is our plain-English commitment to how your code and credentials are safeguarded.
                    </p>
                </div>

                {/* 6 Security Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {SECURITY_PILLARS.map((pillar, idx) => {
                        const Icon = pillar.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.08 }}
                                viewport={{ once: true, margin: "-50px" }}
                                className="rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-7 backdrop-blur-xl flex flex-col justify-between hover:border-primary/40 hover:bg-card/90 transition-all duration-300 shadow-sm hover:shadow-xl group"
                            >
                                <div>
                                    <div className="size-11 rounded-xl border border-primary/20 bg-primary/10 text-primary flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105">
                                        <Icon className="size-5.5" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        {pillar.description}
                                    </p>
                                </div>

                                <div className="mt-5 pt-3 border-t border-border/60 flex items-center gap-2 text-xs font-medium text-emerald-400">
                                    <CheckCircle2 className="size-3.5" />
                                    <span>Verified Policy</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
