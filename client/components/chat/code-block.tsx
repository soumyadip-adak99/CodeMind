"use client";

import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "cn";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeBlockProps {
    language?: string;
    children: string;
}

export function CodeBlock({ language, children }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const el = document.createElement("textarea");
            el.value = children;
            el.style.position = "fixed";
            el.style.opacity = "0";
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [children]);

    const displayLang = language ?? "text";

    return (
        <div className="relative group my-6 rounded-md overflow-hidden bg-[#0d0d0d] border border-white/10">
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#2f2f2f]">
                <span className="text-xs font-mono text-zinc-300">
                    {displayLang}
                </span>
                <button
                    onClick={handleCopy}
                    aria-label={copied ? "Copied" : "Copy code"}
                    className={cn(
                        "flex items-center gap-1.5 text-xs transition-all duration-200",
                        "text-zinc-300 hover:text-white",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4" />
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code content */}
            <div className="w-full overflow-x-auto text-[0.875rem] leading-loose">
                <SyntaxHighlighter
                    language={language || "text"}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: "1rem",
                        background: "transparent",
                        fontSize: "0.85rem",
                    }}
                    wrapLines={true}
                >
                    {children}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}
