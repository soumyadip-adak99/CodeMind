"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CodeMindIcon } from "@/components/icons/code-mind";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, ArrowRight, FolderGit2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface LandingNavbarProps {
    isAuthenticated: boolean;
}

const NAV_ITEMS = [
    { label: "Features", href: "features" },
    { label: "How It Works", href: "how-it-works" },
    { label: "Use Cases", href: "capabilities" },
    { label: "Platform", href: "architecture" },
    { label: "Security", href: "security" },
    { label: "FAQ", href: "faq" },
];

export function LandingNavbar({ isAuthenticated }: LandingNavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>("");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            // Active section spy
            const sections = NAV_ITEMS.map((item) => document.getElementById(item.href));
            const scrollPos = window.scrollY + 100;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPos) {
                    setActiveSection(NAV_ITEMS[i].href);
                    return;
                }
            }
            if (window.scrollY < 300) {
                setActiveSection("");
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection("");
        setMobileMenuOpen(false);
    };

    const scrollToSection = (id: string) => {
        setMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -70;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    return (
        <header
            className={cn(
                "fixed top-0 inset-x-0 z-50 h-16 transition-all duration-300",
                scrolled
                    ? "bg-background/85 backdrop-blur-xl border-b border-border/60 shadow-[0_4px_30px_rgba(0,0,0,0.25)]"
                    : "bg-transparent border-b border-transparent"
            )}
        >
            <div className="container mx-auto h-full px-4 md:px-6 flex items-center justify-between">
                {/* Brand Logo & Name: clicking smoothly scrolls to top */}
                <Link
                    href="/"
                    onClick={scrollToTop}
                    className="flex items-center gap-2.5 group cursor-pointer select-none"
                    aria-label="CodeMind Home - scroll to top"
                >
                    <div className="relative flex items-center justify-center size-9 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/25 group-hover:border-primary/60 transition-all duration-300 shadow-[0_0_15px_rgba(var(--primary),0.15)]">
                        <CodeMindIcon className="size-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold tracking-tight text-lg text-foreground group-hover:text-primary transition-colors">
                            CodeMind
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
                    {NAV_ITEMS.map((item) => {
                        const isActive = activeSection === item.href;
                        return (
                            <button
                                key={item.label}
                                onClick={() => scrollToSection(item.href)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer relative",
                                    isActive
                                        ? "text-primary bg-primary/10 font-semibold"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                )}
                            >
                                {item.label}
                                {isActive && (
                                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Action Buttons (Desktop) */}
                <div className="hidden sm:flex items-center gap-3">
                    {isAuthenticated ? (
                        <Link
                            href="/dashboard"
                            className={cn(
                                buttonVariants({ size: "sm" }),
                                "group h-9 rounded-xl px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-all duration-200 shadow-[0_0_20px_rgba(var(--primary),0.25)] flex items-center gap-2 cursor-pointer"
                            )}
                        >
                            <FolderGit2 className="size-4" />
                            <span>Go to Dashboard</span>
                            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className={cn(
                                    buttonVariants({ variant: "ghost", size: "sm" }),
                                    "h-9 px-3.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl"
                                )}
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/login"
                                className={cn(
                                    buttonVariants({ size: "sm" }),
                                    "group h-9 rounded-xl px-4 bg-foreground text-background hover:bg-foreground/90 font-semibold text-xs transition-all duration-200 flex items-center gap-1.5 shadow-md hover:shadow-lg"
                                )}
                            >
                                <FaGithub className="size-3.5" />
                                <span>Get Started Free</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Hamburger Toggle */}
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex lg:hidden items-center justify-center size-9 rounded-xl border border-border/80 bg-muted/30 text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                    aria-label="Toggle navigation menu"
                >
                    {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
            </div>

            {/* Mobile Dropdown Drawer */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-x-0 top-16 bg-background/95 backdrop-blur-2xl border-b border-border/80 shadow-2xl p-6 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                    <div className="flex flex-col gap-2">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => scrollToSection(item.href)}
                                className={cn(
                                    "flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-medium transition-colors text-left",
                                    activeSection === item.href
                                        ? "text-primary bg-primary/10 font-semibold"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                )}
                            >
                                <span>{item.label}</span>
                                {activeSection === item.href && (
                                    <span className="size-1.5 rounded-full bg-primary" />
                                )}
                            </button>
                        ))}

                        <div className="pt-4 mt-2 border-t border-border/60 flex flex-col gap-2.5">
                            {isAuthenticated ? (
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        buttonVariants({ size: "default" }),
                                        "w-full rounded-xl justify-center bg-primary text-primary-foreground font-semibold flex items-center gap-2"
                                    )}
                                >
                                    <FolderGit2 className="size-4" />
                                    <span>Go to Dashboard</span>
                                    <ArrowRight className="size-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            buttonVariants({ variant: "outline", size: "default" }),
                                            "w-full rounded-xl justify-center text-sm"
                                        )}
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            buttonVariants({ size: "default" }),
                                            "w-full rounded-xl justify-center bg-foreground text-background font-semibold text-sm flex items-center gap-2"
                                        )}
                                    >
                                        <FaGithub className="size-4" />
                                        <span>Get Started Free</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
