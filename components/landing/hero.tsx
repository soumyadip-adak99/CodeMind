"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    ArrowRight,
    CheckCircle2,
    Code2,
    Database,
    ExternalLink,
    FileCode2,
    FolderGit2,
    MessageSquare,
    Play,
    ShieldCheck,
    Sparkles,
    Terminal,
    Zap,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { CodeMindIcon } from "@/components/icons/code-mind";

interface LandingHeroProps {
    isAuthenticated?: boolean;
}

interface DemoScenario {
    id: string;
    question: string;
    repo: string;
    summary: string;
    codeSnippet: string;
    language: string;
    citations: { file: string; lines: string; relevance: string }[];
}

const DEMO_SCENARIOS: DemoScenario[] = [
    {
        id: "auth",
        question: "How does user sign-in work, and where is the session cookie created?",
        repo: "team-platform/backend",
        summary:
            "When someone signs in with GitHub, our OAuth handler verifies their account and generates a short-lived token. The web client immediately exchanges that token via POST /api/auth/exchange, where the server issues a secure, HttpOnly session cookie that JavaScript cannot access.",
        language: "java",
        codeSnippet: `// AuthController.java (lines 48-62)
@PostMapping("/exchange")
public ResponseEntity<UserResponse> exchangeToken(@RequestParam String token, 
                                                   HttpServletRequest req, 
                                                   HttpServletResponse res) {
    Long githubId = tokenStore.consume(token);
    User user = userRepository.findByGithubId(githubId).orElseThrow();
    
    // Issues a secure, HttpOnly cookie with SameSite protection
    sessionUtil.setSessionCookie(req, res);
    return ResponseEntity.ok(userMapper.toResponse(user));
}`,
        citations: [
            { file: "AuthController.java", lines: "L48-L62", relevance: "Direct Implementation" },
            { file: "OAuth2Handler.java", lines: "L37-L54", relevance: "Token Handoff" },
            { file: "SecurityConfig.java", lines: "L72-L85", relevance: "Cookie Policy" },
        ],
    },
    {
        id: "pipeline",
        question: "How do we verify incoming Stripe webhooks and prevent duplicate events?",
        repo: "billing-service",
        summary:
            "Incoming webhooks are verified against our secret HMAC-SHA256 signature in webhook-handler.ts. If the signature is invalid, we return an immediate 401. If valid, the payload is published to an idempotent event queue that rejects duplicates before any charge is captured.",
        language: "typescript",
        codeSnippet: `// webhook-handler.ts (lines 34-49)
export async function handleStripeWebhook(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();
  
  // Validates HMAC signature; throws if forged or replayed
  const event = stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET);
  await eventQueue.publishIdempotent("payment.events", event);
  return Response.json({ received: true });
}`,
        citations: [
            { file: "webhook-handler.ts", lines: "L34-L49", relevance: "Signature Verification" },
            { file: "event-queue.ts", lines: "L88-L102", relevance: "Deduplication Logic" },
        ],
    },
    {
        id: "indexing",
        question: "Which files are skipped during repository indexing to keep searches fast?",
        repo: "team-platform/core",
        summary:
            "To keep answers focused and searches fast, CodeMind ignores noisy files: .git metadata, node_modules, lockfiles (package-lock.json), build bundles, images, test fixtures, and anything over 100 KB. Only meaningful source code is indexed.",
        language: "java",
        codeSnippet: `// FileFilterUtil.java (lines 18-32)
private static final Set<String> IGNORED_EXTENSIONS = Set.of(
    ".png", ".jpg", ".zip", ".tar", ".gz", ".lock", ".ico", ".map"
);

public static boolean shouldIndex(String path, long byteSize) {
    if (byteSize > 100_000) return false; // Skip files larger than 100KB
    if (path.contains("node_modules/") || path.contains(".git/")) return false;
    return SUPPORTED_EXTENSIONS.stream().anyMatch(path::endsWith);
}`,
        citations: [
            { file: "FileFilterUtil.java", lines: "L18-L32", relevance: "Extension & Size Rules" },
            { file: "IndexingService.java", lines: "L62-L80", relevance: "Directory Scanner" },
        ],
    },
];

export function LandingHero({ isAuthenticated }: LandingHeroProps) {
    const [activeScenario, setActiveScenario] = useState<DemoScenario>(DEMO_SCENARIOS[0]);

    return (
        <section className="relative flex flex-col overflow-hidden pt-36 sm:pt-40 md:pt-44 pb-16 md:pb-24 bg-background">
            {/* Background Ambient Glows & Subtle Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800f_1px,transparent_1px),linear-gradient(to_bottom,#8080800f_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            <div className="absolute left-1/2 top-16 -translate-x-1/2 w-[650px] md:w-[900px] h-[400px] bg-gradient-to-tr from-primary/15 via-purple-500/10 to-blue-500/15 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Hero Top Content */}
                <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                    {/* Badge: with clear top margin below header */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/90 backdrop-blur-xl px-4 py-1.5 text-xs font-mono mb-8 shadow-sm hover:border-primary/50 transition-colors">
                        <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        <span className="text-muted-foreground font-medium">
                            A smarter way to explore codebases · <span className="text-foreground">Verified line citations</span>
                        </span>
                    </div>

                    {/* Main Headline: perfectly proportioned and text-balanced */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-sans leading-[1.12] mb-6 text-foreground text-balance max-w-4xl mx-auto">
                        Understand any repository <br className="hidden md:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                            in minutes, not weeks.
                        </span>
                    </h1>

                    {/* Subheading: text-balanced without orphan words */}
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance leading-relaxed font-normal">
                        Connect your GitHub repositories and have a natural conversation with your code. 
                        Trace architectural decisions, investigate unfamiliar logic, and get clear answers backed by the exact files and lines that prove them.
                    </p>

                    {/* CTA Buttons: balanced and centered */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-14 w-full sm:w-auto justify-center items-center">
                        <div className="relative group w-full sm:w-auto">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/50 via-indigo-500/50 to-purple-500/50 rounded-2xl blur-md opacity-50 group-hover:opacity-90 transition duration-300" />
                            {isAuthenticated ? (
                                <Link
                                    href="/dashboard"
                                    className={cn(
                                        buttonVariants({ size: "lg" }),
                                        "relative flex items-center justify-center gap-2.5 h-13 px-8 text-sm sm:text-base rounded-xl w-full sm:w-auto bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all duration-200 shadow-xl cursor-pointer"
                                    )}
                                >
                                    <FolderGit2 className="size-4.5" />
                                    <span>Open Your Dashboard</span>
                                    <ArrowRight className="size-4 ml-1" />
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className={cn(
                                        buttonVariants({ size: "lg" }),
                                        "relative flex items-center justify-center gap-2.5 h-13 px-8 text-sm sm:text-base rounded-xl w-full sm:w-auto bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all duration-200 shadow-xl cursor-pointer"
                                    )}
                                >
                                    <FaGithub className="size-5" />
                                    <span>Connect with GitHub — It's Free</span>
                                    <ArrowRight className="size-4 ml-1" />
                                </Link>
                            )}
                        </div>

                        <a
                            href="#showcase"
                            className={cn(
                                buttonVariants({ variant: "outline", size: "lg" }),
                                "h-13 px-7 text-sm rounded-xl w-full sm:w-auto border-border/80 bg-background/60 hover:bg-muted/50 backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2 text-foreground font-medium cursor-pointer"
                            )}
                        >
                            <Play className="size-3.5 fill-foreground text-foreground" />
                            <span>Try the Interactive Demo</span>
                        </a>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-6 px-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md w-full max-w-4xl text-left">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                                <FileCode2 className="size-4.5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-foreground">Verified Citations</p>
                                <p className="text-[11px] text-muted-foreground">Every answer cites exact files & lines</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                                <ShieldCheck className="size-4.5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-foreground">Private by Design</p>
                                <p className="text-[11px] text-muted-foreground">Your code never trains public AI</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                                <Code2 className="size-4.5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-foreground">Read-Only Safety</p>
                                <p className="text-[11px] text-muted-foreground">We never commit or modify code</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                                <Zap className="size-4.5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-foreground">Instant Onboarding</p>
                                <p className="text-[11px] text-muted-foreground">Ready to ask in under 60 seconds</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Interactive Live Preview Sandbox ── */}
                <div className="mt-14 max-w-5xl mx-auto">
                    <div className="rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden backdrop-blur-xl">
                        {/* Sandbox Header / Browser Chrome */}
                        <div className="h-11 border-b border-border/80 bg-muted/40 px-4 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <span className="size-2.5 rounded-full bg-red-500/70" />
                                    <span className="size-2.5 rounded-full bg-yellow-500/70" />
                                    <span className="size-2.5 rounded-full bg-green-500/70" />
                                </div>
                                <span className="text-muted-foreground font-mono text-[11px] ml-2 hidden sm:inline">
                                    Live Sandbox — Try clicking different questions below
                                </span>
                            </div>

                            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 font-medium">
                                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Interactive Demo
                            </span>
                        </div>

                        {/* Sandbox Interactive Question Bar */}
                        <div className="p-3 bg-muted/20 border-b border-border/60 flex flex-wrap gap-2">
                            {DEMO_SCENARIOS.map((scenario) => {
                                const isSelected = activeScenario.id === scenario.id;
                                return (
                                    <button
                                        key={scenario.id}
                                        type="button"
                                        onClick={() => setActiveScenario(scenario)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 border",
                                            isSelected
                                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                                : "bg-background/80 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted"
                                        )}
                                    >
                                        <MessageSquare className="size-3" />
                                        <span>
                                            {scenario.id === "auth" && "Authentication Flow"}
                                            {scenario.id === "pipeline" && "Webhook Deduplication"}
                                            {scenario.id === "indexing" && "File Filtering Rules"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Sandbox Question / Answer View */}
                        <div className="p-5 sm:p-7 space-y-6">
                            {/* User Question */}
                            <div className="flex items-start gap-3">
                                <div className="size-8 rounded-xl bg-muted border border-border/80 flex items-center justify-center text-muted-foreground shrink-0 font-mono text-xs font-semibold mt-0.5">
                                    You
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-foreground">
                                        "{activeScenario.question}"
                                    </p>
                                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                                        Repository: {activeScenario.repo}
                                    </p>
                                </div>
                            </div>

                            {/* CodeMind AI Response with Citations */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeScenario.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="size-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-0.5 shadow-sm">
                                        <CodeMindIcon className="size-4.5 text-primary" />
                                    </div>

                                    <div className="space-y-4 flex-1 min-w-0">
                                        {/* Retrieval Metric Tag */}
                                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono font-medium">
                                                <Zap className="size-3" />
                                                Found in 184ms
                                            </span>
                                            <span>ranked by code relevance</span>
                                        </div>

                                        {/* Explanation */}
                                        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
                                            {activeScenario.summary}
                                        </p>

                                        {/* Code Snippet Box */}
                                        <div className="rounded-xl border border-border/80 bg-muted/30 overflow-hidden text-xs">
                                            <div className="h-7 px-3 bg-muted/50 border-b border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                                                <span>Source Code ({activeScenario.language})</span>
                                                <span className="text-[10px] text-primary">Verified Snippet</span>
                                            </div>
                                            <pre className="p-3.5 font-mono text-[11px] leading-relaxed overflow-x-auto text-foreground/80">
                                                <code>{activeScenario.codeSnippet}</code>
                                            </pre>
                                        </div>

                                        {/* Verified Citations */}
                                        <div className="space-y-1.5 pt-1">
                                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                                Verified Source Citations:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {activeScenario.citations.map((cite, i) => (
                                                    <div
                                                        key={i}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/70 bg-card text-xs font-mono text-foreground hover:border-primary/50 transition-colors shadow-2xs"
                                                    >
                                                        <FileCode2 className="size-3 text-primary" />
                                                        <span className="font-medium">{cite.file}</span>
                                                        <span className="text-primary font-semibold">({cite.lines})</span>
                                                        <span className="text-[10px] text-muted-foreground ml-1">
                                                            {cite.relevance}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
