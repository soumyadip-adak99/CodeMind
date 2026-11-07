import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CodeMindIcon } from "@/components/icons/code-mind";
import { ArrowLeft, Compass, FolderGit2, Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none">
                <div className="h-96 w-96 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-600/15" />
            </div>

            <div className="max-w-md space-y-6">
                {/* Logo & Badge */}
                <div className="flex flex-col items-center gap-3">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25">
                        <CodeMindIcon className="size-10" />
                    </div>
                    <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                        Error 404 · Page Not Found
                    </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Lost in Neural Code Space
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        The repository or route you are looking for does not exist, has been moved,
                        or is temporarily unreachable.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Button nativeButton={false} render={<Link href="/dashboard" />}>
                        <FolderGit2 className="mr-2 size-4" />
                        Go to Dashboard
                    </Button>
                    <Button
                        variant="outline"
                        nativeButton={false}
                        render={<Link href="/dashboard/overview" />}
                    >
                        <Compass className="mr-2 size-4" />
                        View Overview
                    </Button>
                </div>

                {/* Return home link */}
                <div className="pt-4 border-t border-border/50">
                    <Link
                        href="/"
                        className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-1.5 size-3" />
                        Back to CodeMind homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}

