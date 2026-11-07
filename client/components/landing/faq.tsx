"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Sparkles } from "lucide-react";

const FAQ_ITEMS = [
    {
        id: "faq-1",
        question: "How is CodeMind different from ChatGPT or GitHub Copilot?",
        answer:
            "Most AI tools only see the snippet you manually copy-paste into the chat or the single active file open in your editor. CodeMind indexes your entire repository across folders and modules. When you ask a question, it searches your whole project, explains how pieces connect, and links directly to the real files and line numbers so you can verify everything yourself.",
    },
    {
        id: "faq-2",
        question: "Does CodeMind work with private GitHub repositories?",
        answer:
            "Yes. When you connect with GitHub, CodeMind shows both your public and private repositories. Everything we index is strictly isolated to your authenticated account. No one else can view your code, search your index, or read your conversations.",
    },
    {
        id: "faq-3",
        question: "Which files are indexed, and what gets ignored?",
        answer:
            "We index source files in all major programming languages (Java, TypeScript, JavaScript, Python, Go, Rust, C++, SQL, YAML, HTML, CSS, and more). To keep searches fast and relevant, CodeMind automatically ignores noisy files like package-lock.json, node_modules, build folders, images, and anything larger than 100 KB.",
    },
    {
        id: "faq-4",
        question: "Can CodeMind modify or commit to my repository?",
        answer:
            "No. We ask for strictly read-only access through GitHub. CodeMind cannot push commits, open pull requests, edit files, or change your git history in any way. It only reads files to build your search index.",
    },
    {
        id: "faq-5",
        question: "How do I update the index when new commits are merged?",
        answer:
            "You can trigger a re-index with a single click from your repository dashboard or using the keyboard command palette. CodeMind pulls the latest commit from your default branch and updates the index so your answers stay accurate.",
    },
    {
        id: "faq-6",
        question: "How do I get started?",
        answer:
            "Getting started takes under a minute. Simply connect your GitHub account with one click, choose a repository to index, and start asking questions right away. No credit card or complicated setup required.",
    },
];

export function LandingFaq() {
    return (
        <section id="faq" className="py-24 md:py-32 relative z-10 bg-background overflow-hidden border-t border-border/60">
            {/* Background Accent */}
            <div className="absolute right-1/3 top-0 w-[500px] h-[300px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />

            <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-14 md:mb-18">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
                        <HelpCircle className="size-3.5" />
                        <span>Common Questions</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-sans text-foreground mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        Clear, straightforward answers about how CodeMind indexes your code, protects your privacy, and integrates with GitHub.
                    </p>
                </div>

                {/* Accordion List */}
                <Accordion className="w-full space-y-4">
                    {FAQ_ITEMS.map((item) => (
                        <AccordionItem
                            key={item.id}
                            value={item.id}
                            className="rounded-2xl border border-border/80 bg-card/60 px-5 sm:px-6 backdrop-blur-md transition-all hover:border-primary/40 data-[state=open]:border-primary/50 data-[state=open]:bg-card/90 shadow-xs"
                        >
                            <AccordionTrigger className="text-left font-semibold text-sm sm:text-base py-5 hover:no-underline text-foreground cursor-pointer">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-5 pt-1">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
