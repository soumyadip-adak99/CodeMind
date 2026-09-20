import { CodeMindIcon } from "@/components/icons/code-mind";

export function LandingFooter() {
    return (
        <footer className="py-12 relative z-10 bg-background border-t border-border">
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    <CodeMindIcon className="w-5 h-5 text-primary" />
                    <span className="font-geist-sans font-semibold tracking-tight text-lg">
                        CodeMind
                    </span>
                </div>
                
                <div className="text-sm text-muted-foreground/60 font-medium tracking-wide">
                    &copy; 2026 CodeMind. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
