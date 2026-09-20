import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { CodeBlock } from "./code-block";
import "./chat-markdown.css";

interface ChatMarkdownProps {
    content: string;
    isStreaming?: boolean;
}

const markdownComponents: Components = {
    // Route fenced code blocks to our styled CodeBlock component
    code({ className, children, ...props }) {
        const isBlock = className?.startsWith("language-");
        const language = className?.replace("language-", "");

        if (isBlock) {
            return (
                <CodeBlock language={language}>
                    {String(children).replace(/\n$/, "")}
                </CodeBlock>
            );
        }

        // Inline code
        return (
            <code
                className="font-mono text-[0.8125em] bg-muted border border-border rounded-[0.3rem] px-[0.4em] py-[0.15em]"
                {...props}
            >
                {children}
            </code>
        );
    },
    // Ensure pre does not double-wrap
    pre({ children }) {
        return <>{children}</>;
    },
};

export function ChatMarkdown({ content, isStreaming }: ChatMarkdownProps) {
    return (
        <div className="chat-markdown">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
            >
                {content}
            </ReactMarkdown>
            {isStreaming && (
                <span
                    aria-hidden="true"
                    className="inline-block w-[2px] h-[1.1em] bg-foreground/70 rounded-sm ml-0.5 align-text-bottom animate-[caret-blink_0.8s_step-end_infinite]"
                />
            )}
        </div>
    );
}
