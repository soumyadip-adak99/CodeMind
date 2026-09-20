"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Search, FolderGit2, CheckCircle2, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ProductShowcase() {
    return (
        <section className="py-32 relative z-10 bg-background border-y border-border overflow-hidden">
            {/* Premium Background Design */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
                    
                    {/* Mockup 1: Dashboard */}
                    <div className="w-full md:w-1/2 perspective-1000">
                        <motion.div 
                            initial={{ opacity: 0, rotateY: 10, y: 30 }}
                            whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
                        >
                            {/* Window header */}
                            <div className="h-10 border-b border-border bg-muted/30 flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                </div>
                                <div className="mx-auto bg-background border border-border rounded-md px-3 py-1 text-[10px] font-geist-mono text-muted-foreground flex items-center gap-2">
                                    <Search className="w-3 h-3" />
                                    <span>Search repositories...</span>
                                </div>
                            </div>
                            
                            {/* App Content */}
                            <div className="p-5 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">Your Repositories</h3>
                                    <span className="text-xs bg-secondary px-2 py-1 rounded text-secondary-foreground">2 / 5 Indexed</span>
                                </div>
                                
                                {/* Repo Card 1 */}
                                <div className="border border-border rounded-xl p-4 flex flex-col gap-3 hover:bg-muted/20 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <FolderGit2 className="w-5 h-5 text-primary" />
                                            <span className="font-medium text-sm">acme-corp/spring-boot-ecommerce</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span>Indexed</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                        A full-stack e-commerce application built with Spring Boot 3, Spring Security, and React.
                                    </p>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] font-geist-mono bg-secondary px-1.5 py-0.5 rounded border border-border">Java</span>
                                        <span className="text-[10px] font-geist-mono bg-secondary px-1.5 py-0.5 rounded border border-border">TypeScript</span>
                                    </div>
                                </div>
                                
                                {/* Repo Card 2 */}
                                <div className="border border-border rounded-xl p-4 flex flex-col gap-3 hover:bg-muted/20 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <FolderGit2 className="w-5 h-5 text-muted-foreground" />
                                            <span className="font-medium text-sm">acme-corp/CodeMind</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                                            <Clock className="w-3 h-3 animate-spin-slow" />
                                            <span>Indexing...</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1 bg-secondary rounded-full overflow-hidden mt-1">
                                        <div className="h-full bg-blue-500 w-[65%]" />
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] font-geist-mono bg-secondary px-1.5 py-0.5 rounded border border-border">Java</span>
                                        <span className="text-[10px] font-geist-mono bg-secondary px-1.5 py-0.5 rounded border border-border">React</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Mockup 2: Chat */}
                    <div className="w-full md:w-1/2 perspective-1000">
                        <motion.div 
                            initial={{ opacity: 0, rotateY: -10, y: 30 }}
                            whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden relative"
                        >
                            {/* Window header */}
                            <div className="h-10 border-b border-border bg-muted/30 flex items-center px-4 justify-between">
                                <div className="flex items-center gap-2">
                                    <FolderGit2 className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-xs font-medium text-muted-foreground">spring-boot-ecommerce</span>
                                </div>
                            </div>

                            {/* Chat Content */}
                            <div className="p-5 flex flex-col gap-6 bg-[url('/grain.png')] bg-repeat opacity-[0.98]">
                                {/* User Message */}
                                <div className="flex gap-4">
                                    <Avatar className="w-8 h-8 rounded-lg border border-border">
                                        <AvatarFallback className="rounded-lg text-xs">U</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-2">
                                        <div className="font-semibold text-sm">User</div>
                                        <div className="text-sm bg-muted/50 p-3 rounded-xl rounded-tl-none border border-border">
                                            How does JWT authentication work in this repository?
                                        </div>
                                    </div>
                                </div>

                                {/* Assistant Message */}
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                        <BrainCircuit className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="font-semibold text-sm">CodeMind</div>
                                        <div className="text-sm text-foreground/90 leading-relaxed">
                                            Authentication is handled in the <code className="font-geist-mono text-[11px] bg-secondary px-1 py-0.5 rounded text-primary">security</code> package using JWT tokens. Here is how the <code className="font-geist-mono text-[11px] bg-secondary px-1 py-0.5 rounded text-primary">JwtAuthenticationFilter</code> processes requests:
                                        </div>
                                        
                                        {/* Code Block Mock */}
                                        <div className="rounded-lg border border-border bg-[#1e1e1e] overflow-hidden">
                                            <div className="flex items-center px-3 py-1.5 bg-[#2d2d2d] border-b border-[#3e3e3e]">
                                                <span className="text-[10px] font-geist-mono text-zinc-400">JwtAuthenticationFilter.java</span>
                                            </div>
                                            <div className="p-3 overflow-x-auto text-[11px] font-geist-mono leading-[1.6]">
                                                <pre>
                                                    <span className="text-[#569cd6]">protected</span> <span className="text-[#569cd6]">void</span> <span className="text-[#dcdcaa]">doFilterInternal</span>(
                                                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;HttpServletRequest <span className="text-[#9cdcfe]">request</span>,
                                                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;HttpServletResponse <span className="text-[#9cdcfe]">response</span>,
                                                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;FilterChain <span className="text-[#9cdcfe]">filterChain</span>
                                                    <br/>) <span className="text-[#569cd6]">throws</span> ServletException, IOException {"{"}
                                                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#569cd6]">final</span> String authHeader = request.<span className="text-[#dcdcaa]">getHeader</span>(<span className="text-[#ce9178]">"Authorization"</span>);
                                                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#c586c0]">if</span> (authHeader == <span className="text-[#569cd6]">null</span> || !authHeader.<span className="text-[#dcdcaa]">startsWith</span>(<span className="text-[#ce9178]">"Bearer "</span>)) {"{"}
                                                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;filterChain.<span className="text-[#dcdcaa]">doFilter</span>(request, response);
                                                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#c586c0]">return</span>;
                                                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;{"}"}
                                                    <br/>{"}"}
                                                </pre>
                                            </div>
                                        </div>

                                        {/* Sources */}
                                        <div className="pt-2">
                                            <span className="text-xs text-muted-foreground font-medium mb-2 block">Sources</span>
                                            <div className="flex flex-wrap gap-2">
                                                <div className="inline-flex items-center gap-1 text-[10px] font-geist-mono bg-secondary/50 border border-border px-2 py-1 rounded cursor-pointer hover:bg-secondary">
                                                    <FolderGit2 className="w-3 h-3 text-muted-foreground" />
                                                    src/main/java/.../security/JwtAuthenticationFilter.java
                                                </div>
                                                <div className="inline-flex items-center gap-1 text-[10px] font-geist-mono bg-secondary/50 border border-border px-2 py-1 rounded cursor-pointer hover:bg-secondary">
                                                    <FolderGit2 className="w-3 h-3 text-muted-foreground" />
                                                    src/main/java/.../security/JwtService.java
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
