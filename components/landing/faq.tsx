"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function LandingFaq() {
    return (
        <section id="faq" className="py-32 relative z-10 bg-background overflow-hidden border-t border-border">
            {/* Ambient Background Design */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/grain.png')] opacity-[0.02] pointer-events-none mix-blend-screen" />

            <div className="container mx-auto px-4 md:px-6 max-w-3xl relative z-10">
                <h2 className="text-3xl font-semibold tracking-tight font-geist-sans mb-10 text-center">
                    Frequently Asked Questions
                </h2>
                <Accordion className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-left font-medium">What gets indexed?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            When you index a repository, CodeMind fetches the file tree and splits the supported code files into token-based chunks (~200 tokens each). These chunks are passed to the configured embedding provider to create 1536-dimension embeddings, which are then stored in our PostgreSQL database using pgvector.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-left font-medium">Does it work with private repositories?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            Yes. CodeMind syncs repositories you own, collaborate on, or have access to through organizations—both public and private. Operations are securely scoped to your signed-in GitHub identity.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-left font-medium">What happens to my code?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            Your code chunks are stored securely in our database and sent to the embedding provider to generate vectors. When you ask a question, the relevant code chunks are retrieved and sent to the LLM to generate the final answer. We never commit, modify, or share your code with unauthenticated users.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-left font-medium">Which files are skipped during indexing?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            To ensure high-quality answers and fast indexing, CodeMind automatically skips common noise. This includes <code>node_modules</code>, build outputs, lock files (like <code>package-lock.json</code>), hidden files, and any file larger than 100 KB.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger className="text-left font-medium">How do I re-index a repository?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            You can re-index a repository anytime directly from the dashboard. Re-indexing completely replaces the previous vectors with the latest state of your codebase.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                        <AccordionTrigger className="text-left font-medium">Is CodeMind open source?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            Yes, CodeMind is fully open-source under the MIT license. You can self-host the entire stack (Spring Boot API, PostgreSQL, and Next.js frontend) on your own infrastructure if you require complete data isolation.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
}
