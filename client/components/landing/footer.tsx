"use client";

import Link from "next/link";
import { CodeMindIcon } from "@/components/icons/code-mind";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export function LandingFooter() {
    const scrollToTop = (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -70;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    return (
        <footer className="relative z-10 bg-card/60 border-t border-border/80 text-foreground pt-16 pb-12 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                {/* Main Multi-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-border/60">
                    {/* Brand Col */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link
                            href="/"
                            onClick={scrollToTop}
                            className="flex items-center gap-2.5 group cursor-pointer"
                            aria-label="CodeMind Home - scroll to top"
                        >
                            <div className="flex items-center justify-center size-8 rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:scale-105 transition-transform">
                                <CodeMindIcon className="size-5" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
                                CodeMind
                            </span>
                        </Link>

                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
                            CodeMind helps developers search, trace, and understand complex repositories. 
                            Ask questions about architecture or business logic and get clear answers with verified file & line citations.
                        </p>

                        <div className="flex items-center gap-2 pt-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-medium">
                                <ShieldCheck className="size-3.5" />
                                <span>Zero-Training Guarantee</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border/70 bg-muted/40 text-muted-foreground text-xs font-mono">
                                <span>Read-Only GitHub Access</span>
                            </span>
                        </div>
                    </div>

                    {/* Col 1: Product Navigation */}
                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
                            Product
                        </p>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                            <li>
                                <button
                                    onClick={() => scrollToSection("features")}
                                    className="hover:text-foreground transition-colors cursor-pointer text-left"
                                >
                                    Features
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection("how-it-works")}
                                    className="hover:text-foreground transition-colors cursor-pointer text-left"
                                >
                                    How It Works
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection("showcase")}
                                    className="hover:text-foreground transition-colors cursor-pointer text-left"
                                >
                                    Interactive Demo
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection("capabilities")}
                                    className="hover:text-foreground transition-colors cursor-pointer text-left"
                                >
                                    Use Cases
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Col 2: Security & Privacy */}
                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
                            Security & Privacy
                        </p>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                            <li>
                                <button
                                    onClick={() => scrollToSection("security")}
                                    className="hover:text-foreground transition-colors cursor-pointer text-left"
                                >
                                    Encrypted Credentials
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection("security")}
                                    className="hover:text-foreground transition-colors cursor-pointer text-left"
                                >
                                    HttpOnly Session Cookies
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection("security")}
                                    className="hover:text-foreground transition-colors cursor-pointer text-left"
                                >
                                    Isolated Account Partitions
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection("security")}
                                    className="hover:text-foreground transition-colors cursor-pointer text-left"
                                >
                                    Zero Code Modification
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Col 3: Resources */}
                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
                            Resources
                        </p>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                            <li>
                                <button
                                    onClick={() => scrollToSection("faq")}
                                    className="hover:text-foreground transition-colors cursor-pointer text-left"
                                >
                                    Frequently Asked Questions
                                </button>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-foreground transition-colors">
                                    Sign In / Get Started
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection("architecture")}
                                    className="hover:text-foreground transition-colors cursor-pointer text-left"
                                >
                                    Platform Architecture
                                </button>
                            </li>
                            <li>
                                <span className="text-muted-foreground/80">Privacy Policy</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>
                        &copy; {new Date().getFullYear()} CodeMind. Built with care for software engineers worldwide.
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Repository Intelligence</span>
                        <span>•</span>
                        <span>Grounded Citations</span>
                        <span>•</span>
                        <span>Zero Model Training</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
