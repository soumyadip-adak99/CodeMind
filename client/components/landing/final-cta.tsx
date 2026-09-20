import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CodeMindIcon } from "@/components/icons/code-mind";
import { FaGithub } from "react-icons/fa";

interface LandingFinalCtaProps {
    isAuthenticated?: boolean;
}

export function LandingFinalCta({ isAuthenticated }: LandingFinalCtaProps) {
    return (
        <section className="py-40 relative z-10 bg-white dark:bg-[#0a0a0a] overflow-hidden border-t border-black/5 dark:border-white/5">
            {/* Massive Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-[100%] pointer-events-none" />
            
            {/* Grid background with radial mask */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center flex flex-col items-center">
                
                {/* Premium Logo with Pulsing Rings */}
                <div className="relative mb-12">
                    <div className="absolute inset-0 rounded-[24px] border border-primary/40 animate-ping" style={{ animationDuration: '3s' }} />
                    <div className="absolute -inset-4 rounded-[32px] border border-primary/20 animate-pulse" style={{ animationDuration: '4s' }} />
                    <div className="flex items-center justify-center w-24 h-24 rounded-[24px] bg-gray-50 dark:bg-[#121212] border border-black/10 dark:border-white/10 shadow-[0_0_50px_rgba(var(--primary),0.3)] relative z-10 overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <CodeMindIcon className="w-12 h-12 text-foreground relative z-10" />
                    </div>
                </div>
                
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter font-geist-sans mb-6 text-transparent bg-clip-text bg-gradient-to-b from-black to-black/60 dark:from-white dark:to-white/60">
                    Ready to understand<br className="hidden md:block" /> your code?
                </h2>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 font-medium">
                    Connect your GitHub account and start chatting with your repositories in minutes.
                </p>
                
                <div className="relative group w-full sm:w-auto">
                    {/* Glowing button backdrop */}
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-primary via-purple-500 to-cyan-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-gradient-x" />
                    
                    {isAuthenticated ? (
                        <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "relative flex items-center justify-center h-14 px-10 text-lg rounded-full w-full shadow-2xl bg-white text-black dark:bg-white dark:text-black hover:bg-gray-50 hover:scale-[1.02] transition-all duration-300 ring-1 ring-black/5")}>
                            <span className="font-semibold tracking-tight whitespace-nowrap">Open dashboard</span>
                        </Link>
                    ) : (
                        <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "relative flex items-center justify-center gap-3 h-14 px-10 text-lg rounded-full w-full shadow-2xl bg-white text-black dark:bg-white dark:text-black hover:bg-gray-50 hover:scale-[1.02] transition-all duration-300 ring-1 ring-black/5")}>
                            <FaGithub className="w-6 h-6 shrink-0" />
                            <span className="font-semibold tracking-tight whitespace-nowrap">Continue with GitHub</span>
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
