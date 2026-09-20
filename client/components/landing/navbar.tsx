"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CodeMindIcon } from "@/components/icons/code-mind";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LandingNavbarProps {
    isAuthenticated: boolean;
}

export function LandingNavbar({ isAuthenticated }: LandingNavbarProps) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <header
            className={cn(
                "fixed top-0 inset-x-0 z-50 h-16 transition-all duration-500",
                scrolled
                    ? "bg-background/70 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
                    : "bg-transparent border-b border-transparent"
            )}
        >
            <div className="container mx-auto h-full px-4 md:px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/0 border border-primary/20 group-hover:border-primary/50 transition-colors">
                        <CodeMindIcon className="size-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="font-geist-sans font-semibold tracking-tight text-xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        CodeMind
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    {["How it works", "Features", "Security", "FAQ"].map((item) => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, '-'))}
                            className="text-muted-foreground hover:text-foreground transition-colors relative group py-2"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary rounded-full transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
                        </button>
                    ))}
                </nav>

                <div className="flex items-center gap-3 md:gap-4">
                    {isAuthenticated ? (
                        <Link 
                            href="/dashboard"
                            className={cn(buttonVariants({ size: "sm" }), "group h-9 rounded-full px-5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 transition-all duration-300 shadow-[0_0_15px_rgba(var(--primary),0.2)] hover:shadow-[0_0_20px_rgba(var(--primary),0.4)]")}
                        >
                            Dashboard
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                            >
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </Link>
                    ) : (
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                            <Link 
                                href="/login" 
                                className={cn(buttonVariants({ size: "sm" }), "relative h-9 rounded-full px-5 bg-background text-foreground border border-border hover:bg-muted transition-colors flex items-center")}
                            >
                                Sign in
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                                >
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
