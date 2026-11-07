"use client";

import { motion } from "framer-motion";
import {
    ArrowRight,
    Compass,
    FileCheck2,
    GitFork,
    Network,
    RefreshCw,
    Search,
    ShieldAlert,
    Sparkles,
    UserCheck,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SERVICES = [
    {
        icon: UserCheck,
        iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        title: "Developer Onboarding",
        subtitle: "Ramp up in days instead of weeks",
        description:
            "Give new engineers an always-available guide to ask about repository conventions, setup steps, and configuration files without feeling like they are constantly interrupting senior teammates.",
        tag: "Onboarding",
    },
    {
        icon: Network,
        iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        title: "Tracing Request & Data Flows",
        subtitle: "Follow requests from route to database",
        description:
            "Understand how an endpoint actually executes: which middleware checks the request, which service orchestrates the business logic, and which database tables are touched along the way.",
        tag: "Architecture",
    },
    {
        icon: ShieldAlert,
        iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        title: "Security & Permission Audits",
        subtitle: "Locate sensitive endpoints and token handlers",
        description:
            "Quickly verify how authentication headers, session cookies, and API keys are validated across classes. Spot endpoints missing permission guards before shipping to production.",
        tag: "Security",
    },
    {
        icon: RefreshCw,
        iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        title: "Planning Refactors & Upgrades",
        subtitle: "See downstream impact before writing code",
        description:
            "Find every place an old utility function, deprecated interface, or third-party SDK is used across your repository. Plan refactors knowing exactly what needs to be touched.",
        tag: "Refactoring",
    },
];

export function LandingCapabilities() {
    return (
        <section id="capabilities" className="py-24 md:py-32 relative z-10 bg-background overflow-hidden border-t border-border/60">
            {/* Background Accent */}
            <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 blur-[130px] pointer-events-none rounded-full" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
                        <Sparkles className="size-3.5" />
                        <span>Everyday Engineering Use Cases</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-sans text-foreground mb-4">
                        Where teams use CodeMind every day.
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        Whether you are stepping into a legacy codebase, investigating a production incident, 
                        or onboarding new developers, here is how CodeMind helps your team move faster.
                    </p>
                </div>

                {/* Services Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
                    {SERVICES.map((service, idx) => {
                        const Icon = service.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                className="group rounded-3xl border border-border/80 bg-card/60 p-7 sm:p-8 backdrop-blur-xl hover:border-primary/40 hover:bg-card/90 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-5">
                                        <div
                                            className={cn(
                                                "size-12 rounded-2xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-105",
                                                service.iconBg
                                            )}
                                        >
                                            <Icon className="size-6" />
                                        </div>
                                        <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border/60">
                                            {service.tag}
                                        </span>
                                    </div>

                                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-xs font-semibold text-primary/80 mb-3">
                                        {service.subtitle}
                                    </p>
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                    <span>Learn more about this workflow</span>
                                    <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1 text-primary" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
