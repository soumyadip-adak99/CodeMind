"use client";

import { motion } from "framer-motion";
import { 
    Lock, 
    Filter, 
    Activity, 
    Database, 
    RefreshCw, 
    MessageSquare, 
    Shield 
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";

const FeatureCard = ({ 
    title, 
    description, 
    icon, 
    className, 
    children, 
    large = false, 
    delay = 0 
}: { 
    title: string; 
    description: string; 
    icon: React.ReactNode; 
    className?: string; 
    children?: React.ReactNode; 
    large?: boolean; 
    delay?: number; 
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: "-50px" }}
        className={cn(
            "group relative overflow-hidden rounded-3xl p-[1px] flex flex-col bg-border",
            className
        )}
    >
        {/* Animated gradient border */}
        <div className="absolute inset-0 bg-gradient-to-br from-border to-border group-hover:from-primary/50 group-hover:via-purple-500/50 group-hover:to-border transition-all duration-700 opacity-50 group-hover:opacity-100" />
        
        <div className="relative h-full w-full flex flex-col bg-white dark:bg-[#0a0a0a] rounded-[23px] overflow-hidden transition-colors duration-500 group-hover:bg-gray-50 dark:bg-[#121212]">
            
            {/* Graphic Container */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {children}
            </div>

            {/* Content (Text/Icon on top) */}
            <div className="relative z-10 flex flex-col h-full p-8">
                <div className={cn(
                    "flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-[#1c1c1e] border border-black/10 dark:border-white/10 mb-6 transition-all duration-500 group-hover:scale-110 group-hover:border-primary/30 group-hover:shadow-[0_0_15px_rgba(var(--primary),0.1)] relative",
                    large ? "w-14 h-14" : "w-12 h-12"
                )}>
                    {icon}
                </div>
                
                <div className="mt-auto">
                    <h3 className={cn("font-semibold mb-2 text-black dark:text-white tracking-tight drop-shadow-md", large ? "text-2xl" : "text-lg")}>
                        {title}
                    </h3>
                    <p className="text-sm text-black dark:text-black/60 dark:text-white/60 leading-relaxed font-medium drop-shadow-sm">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    </motion.div>
);

export function LandingFeatures() {
    return (
        <section id="features" className="py-24 relative z-10 bg-background overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-20 text-center max-w-3xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary mb-6">
                        <span className="font-semibold tracking-wide uppercase text-xs">Enterprise-grade</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-geist-sans mb-6 text-foreground">
                        Everything you need to understand code.
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground">
                        A complete, enterprise-grade AI platform designed for speed, accuracy, and security. No complex setup required.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[220px] gap-6">
                    {/* GitHub OAuth - 2x2 */}
                    <FeatureCard
                        title="GitHub OAuth"
                        description="One-click sign in. Syncs repositories you own, collaborate on, or access through orgs."
                        icon={<FaGithub className="w-6 h-6 text-black dark:text-white" />}
                        className="md:col-span-2 md:row-span-2"
                        large
                        delay={0}
                    >
                        <div className="absolute top-8 right-8 bottom-32 left-32 opacity-30 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                            <div className="w-full h-full max-w-xs max-h-xs border border-black/10 dark:border-white/10 rounded-3xl relative bg-gray-100 dark:bg-[#111] overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.15),transparent)]"></div>
                                <svg className="absolute inset-0 w-full h-full">
                                    <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="rgba(0,0,0,0.1) dark:rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                                    <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="rgba(0,0,0,0.1) dark:rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                                    <line x1="50%" y1="50%" x2="30%" y2="80%" stroke="rgba(0,0,0,0.1) dark:rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                                    <line x1="50%" y1="50%" x2="70%" y2="70%" stroke="rgba(0,0,0,0.1) dark:rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                                </svg>
                                <div className="absolute top-[20%] left-[20%] w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-black/5 dark:bg-white/10 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center"><FaGithub className="w-4 h-4 text-black dark:text-white/50"/></div>
                                <div className="absolute top-[30%] left-[80%] w-10 h-10 -translate-x-1/2 -translate-y-1/2 bg-black/5 dark:bg-white/10 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center"><FaGithub className="w-5 h-5 text-black dark:text-white/50"/></div>
                                <div className="absolute top-[80%] left-[30%] w-6 h-6 -translate-x-1/2 -translate-y-1/2 bg-black/5 dark:bg-white/10 rounded-full border border-black/20 dark:border-white/20"></div>
                                <div className="absolute top-[70%] left-[70%] w-12 h-12 -translate-x-1/2 -translate-y-1/2 bg-black/5 dark:bg-white/10 rounded-full border border-black/20 dark:border-white/20"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary/20 border border-primary/50 rounded-2xl shadow-[0_0_30px_rgba(var(--primary),0.3)] z-10 flex items-center justify-center">
                                    <FaGithub className="w-8 h-8 text-primary" />
                                </div>
                            </div>
                        </div>
                    </FeatureCard>

                    {/* Private Repositories */}
                    <FeatureCard
                        title="Private Repositories"
                        description="Works flawlessly with both public and private repositories."
                        icon={<Lock className="w-5 h-5 text-black dark:text-black/80 dark:text-white/80" />}
                        className="md:col-span-1 md:row-span-1"
                        delay={0.05}
                    >
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-700" />
                    </FeatureCard>

                    {/* Smart Filtering */}
                    <FeatureCard
                        title="Smart Filtering"
                        description="Skips node_modules, build outputs, lock files automatically."
                        icon={<Filter className="w-5 h-5 text-black dark:text-black/80 dark:text-white/80" />}
                        className="md:col-span-1 md:row-span-1"
                        delay={0.1}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2/3 flex flex-col gap-3 px-8 opacity-20 group-hover:opacity-60 transition-opacity duration-700">
                            <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden"><div className="w-1/3 h-full bg-primary/60 rounded-full"></div></div>
                            <div className="w-4/5 h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden"><div className="w-2/3 h-full bg-white/60 rounded-full"></div></div>
                            <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden"><div className="w-1/2 h-full bg-primary/60 rounded-full"></div></div>
                        </div>
                    </FeatureCard>

                    {/* Live Indexing */}
                    <FeatureCard
                        title="Live Indexing"
                        description="Real-time progress updates for files processed."
                        icon={<Activity className="w-5 h-5 text-black dark:text-black/80 dark:text-white/80" />}
                        className="md:col-span-1 md:row-span-1"
                        delay={0.15}
                    >
                        <div className="absolute right-8 top-8 opacity-10 group-hover:opacity-40 transition-all duration-700 scale-150">
                            <div className="w-16 h-16 rounded-full border-4 border-t-primary border-r-primary border-b-white/10 border-l-white/10 animate-spin-slow"></div>
                        </div>
                    </FeatureCard>

                    {/* Re-index Anytime */}
                    <FeatureCard
                        title="Re-index Anytime"
                        description="Update your vector base with one click when code changes."
                        icon={<RefreshCw className="w-5 h-5 text-black dark:text-black/80 dark:text-white/80" />}
                        className="md:col-span-1 md:row-span-1"
                        delay={0.2}
                    >
                        <div className="absolute inset-0 bg-[url('/grain.png')] opacity-10 mix-blend-screen pointer-events-none" />
                    </FeatureCard>

                    {/* Semantic Search - 2x1 */}
                    <FeatureCard
                        title="Semantic Search"
                        description="1536-dimension embeddings stored in PostgreSQL with pgvector HNSW indexing."
                        icon={<Database className="w-5 h-5 text-black dark:text-black/80 dark:text-white/80" />}
                        className="md:col-span-2 md:row-span-1"
                        delay={0.25}
                    >
                        <div className="absolute right-0 top-0 bottom-0 w-2/3 overflow-hidden flex items-center justify-end">
                            <div className="w-[120%] h-[150%] flex gap-1.5 flex-wrap opacity-20 group-hover:opacity-40 transition-opacity duration-700 transform rotate-12 scale-125 pr-8">
                                {Array.from({ length: 150 }).map((_, i) => (
                                    <div key={i} className={cn("w-3 h-3 rounded-sm", (i * 37) % 100 > 80 ? "bg-primary" : "bg-black/10 dark:bg-white/20")}></div>
                                ))}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent"></div>
                        </div>
                    </FeatureCard>

                    {/* Repository-scoped */}
                    <FeatureCard
                        title="Repository-scoped"
                        description="Answers are strictly bounded to the specific repository context."
                        icon={<MessageSquare className="w-5 h-5 text-black dark:text-black/80 dark:text-white/80" />}
                        className="md:col-span-1 md:row-span-1"
                        delay={0.3}
                    >
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-30 transition-opacity duration-700 scale-[2] translate-x-1/4 translate-y-1/4 pointer-events-none">
                            <div className="w-32 h-32 border border-black/20 dark:border-white/20 rounded-full flex items-center justify-center">
                                <div className="w-24 h-24 border border-black/20 dark:border-white/20 rounded-full flex items-center justify-center">
                                    <div className="w-16 h-16 border border-black/20 dark:border-white/20 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </FeatureCard>

                    {/* Secure by Default */}
                    <FeatureCard
                        title="Secure by Default"
                        description="Tokens are AES-encrypted at rest. Scoped to signed-in user."
                        icon={<Shield className="w-5 h-5 text-black dark:text-black/80 dark:text-white/80" />}
                        className="md:col-span-1 md:row-span-1"
                        delay={0.35}
                    >
                        <div className="absolute right-6 top-6 w-24 h-24 bg-purple-500/10 blur-xl rounded-full group-hover:bg-purple-500/20 transition-colors duration-700" />
                        <div className="absolute right-8 top-8 opacity-20 group-hover:opacity-50 transition-opacity duration-700">
                            <Shield className="w-16 h-16 text-black dark:text-white" />
                        </div>
                    </FeatureCard>
                </div>
            </div>
        </section>
    );
}
