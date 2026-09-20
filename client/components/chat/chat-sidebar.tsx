"use client";

import Link from "next/link";

import { useState, useMemo, useCallback, useRef } from "react";
import { useChatSessions, useCreateSession } from "@/hooks/use-chat";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "cn";
import {
    Plus,
    MessageSquare,
    ChevronLeft,
    Search,
    MoreHorizontal,
    Pencil,
    Trash2,
    Settings,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChatSession } from "@/@type";
import { CodeMindIcon } from "@/components/icons/code-mind";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { isToday, isYesterday, subDays, isAfter } from "date-fns";

// ─── Time grouping ─────────────────────────────────────────────────────────────

function groupSessions(sessions: ChatSession[]): Record<string, ChatSession[]> {
    const now = new Date();
    const groups: Record<string, ChatSession[]> = {
        Today: [],
        Yesterday: [],
        "Previous 7 days": [],
        Older: [],
    };

    for (const s of sessions) {
        const d = new Date(s.updatedAt);
        if (isToday(d)) {
            groups.Today.push(s);
        } else if (isYesterday(d)) {
            groups.Yesterday.push(s);
        } else if (isAfter(d, subDays(now, 7))) {
            groups["Previous 7 days"].push(s);
        } else {
            groups.Older.push(s);
        }
    }

    return groups;
}

// ─── Session skeleton ─────────────────────────────────────────────────────────

function SessionSkeleton() {
    return (
        <div className="px-2 py-1.5 space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 px-2 py-2 rounded-xl">
                    <Skeleton className="w-4 h-4 rounded shrink-0" />
                    <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-full rounded" />
                        <Skeleton className="h-2 w-2/3 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Single session row ───────────────────────────────────────────────────────

function SessionItem({
    session,
    isActive,
    onClick,
    onDelete,
    onRename,
    collapsed,
}: {
    session: ChatSession;
    isActive: boolean;
    onClick: () => void;
    onDelete: (id: string) => void;
    onRename: (id: string, currentTitle: string) => void;
    collapsed: boolean;
}) {
    const title = session.title || "New Conversation";

    if (collapsed) {
        return (
            <Tooltip>
                <TooltipTrigger
                    onClick={onClick}
                    aria-label={title}
                    className={cn(
                        "w-8 h-8 mx-auto flex items-center justify-center rounded-lg transition-all duration-150",
                        isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                >
                    <MessageSquare className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs max-w-[200px] truncate">
                    {title}
                </TooltipContent>
            </Tooltip>
        );
    }

    return (
        <div
            className={cn(
                "flex items-center gap-2.5 px-2.5 py-1 rounded-xl transition-all duration-150 group/item",
                isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
        >
            {/* Clickable title area */}
            <button
                onClick={onClick}
                className="flex items-center gap-2.5 flex-1 min-w-0 py-1.5 text-left"
            >
                <MessageSquare
                    className={cn(
                        "w-3.5 h-3.5 shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground group-hover/item:text-foreground"
                    )}
                />
                <span className="flex-1 text-sm truncate">{title}</span>
            </button>

            {/* Hover actions – sibling, NOT inside the button above */}
            <DropdownMenu>
                <DropdownMenuTrigger
                    aria-label="More options"
                    className={cn(
                        "w-6 h-6 flex items-center justify-center rounded-md shrink-0",
                        "opacity-0 group-hover/item:opacity-100 focus-visible:opacity-100",
                        "text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    )}
                >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                        onClick={() => onRename(session.id, session.title)}
                    >
                        <Pencil className="w-3.5 h-3.5 mr-2" />
                        Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onDelete(session.id)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

// ─── ChatSidebarContent (shared by desktop and mobile Sheet) ─────────────────

interface ChatSidebarContentProps {
    repoId: string;
    repoName: string;
    activeSessionId: string | null;
    onSelectSession: (id: string) => void;
    collapsed: boolean;
    onToggle: () => void;
}

export function ChatSidebarContent({
    repoId,
    repoName,
    activeSessionId,
    onSelectSession,
    collapsed,
    onToggle,
}: ChatSidebarContentProps) {
    const { data: sessions, isLoading } = useChatSessions(repoId);
    const createSession = useCreateSession();
    const { data: user } = useCurrentUser();
    const logout = useLogout();

    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [renameId, setRenameId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState("");
    const renameInputRef = useRef<HTMLInputElement>(null);

    const handleCreate = useCallback(() => {
        createSession.mutate(
            { repositoryId: repoId },
            { onSuccess: (s) => onSelectSession(s.id) }
        );
    }, [createSession, repoId, onSelectSession]);

    const handleDelete = useCallback((_deletedId: string) => {
        // TODO: wire to api.deleteSession when backend is ready
        setDeleteId(null);
    }, []);

    const handleRenameStart = useCallback((id: string, currentTitle: string) => {
        setRenameId(id);
        setRenameValue(currentTitle || "");
        setTimeout(() => renameInputRef.current?.focus(), 0);
    }, []);

    const handleRenameCommit = useCallback((_renamedId: string) => {
        // TODO: wire to api.renameSession when backend is ready
        setRenameId(null);
        setRenameValue("");
    }, []);

    const filteredSessions = useMemo(() => {
        if (!sessions) return [];
        if (!search.trim()) return sessions;
        const q = search.toLowerCase();
        return sessions.filter((s) => s.title?.toLowerCase().includes(q));
    }, [sessions, search]);

    const grouped = useMemo(() => groupSessions(filteredSessions), [filteredSessions]);

    const userInitial =
        user?.displayName?.charAt(0).toUpperCase() ??
        user?.githubUsername?.charAt(0).toUpperCase() ??
        "U";

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div
                className={cn(
                    "flex items-center gap-2 border-b border-sidebar-border shrink-0",
                    collapsed ? "px-2 py-3 justify-center" : "px-3 py-3"
                )}
            >
                {collapsed ? (
                    <Tooltip>
                        <TooltipTrigger
                            aria-label="Expand sidebar"
                            onClick={onToggle}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                        >
                            <CodeMindIcon className="w-5 h-5 text-blue-600" />
                        </TooltipTrigger>
                        <TooltipContent side="right">Expand</TooltipContent>
                    </Tooltip>
                ) : (
                    <>
                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white shadow-sm flex items-center justify-center shrink-0">
                            <CodeMindIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-muted-foreground leading-none">Ask about</p>
                            <p className="text-sm font-semibold truncate">{repoName}</p>
                        </div>
                        <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Collapse sidebar"
                            className="w-7 h-7 shrink-0"
                            onClick={onToggle}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                    </>
                )}
            </div>

            {/* New Chat button */}
            <div className={cn("shrink-0", collapsed ? "px-2 pt-2" : "px-3 pt-3")}>
                {collapsed ? (
                    <Tooltip>
                        <TooltipTrigger
                            aria-label="New chat"
                            onClick={handleCreate}
                            disabled={createSession.isPending}
                            className="w-8 h-8 mx-auto flex items-center justify-center rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-150 disabled:opacity-50"
                        >
                            <Plus className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent side="right">New chat</TooltipContent>
                    </Tooltip>
                ) : (
                    <button
                        onClick={handleCreate}
                        disabled={createSession.isPending}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-150 disabled:opacity-50 group"
                    >
                        <Plus className="w-4 h-4 shrink-0 group-hover:rotate-90 transition-transform duration-200" />
                        <span className="text-sm font-medium flex-1 text-left">New chat</span>
                        <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border font-mono leading-none">
                            ⌘K
                        </kbd>
                    </button>
                )}
            </div>

            {/* Search */}
            {!collapsed && (
                <div className="px-3 pt-2 shrink-0">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                        <input
                            type="search"
                            placeholder="Search conversations…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            aria-label="Search conversations"
                            className="w-full h-8 pl-8 pr-3 text-xs bg-muted/60 border border-border/60 rounded-lg outline-none focus:border-ring/60 focus:ring-1 focus:ring-ring/30 placeholder:text-muted-foreground/60 transition-all"
                        />
                    </div>
                </div>
            )}

            {/* Session list */}
            <nav
                aria-label="Conversation history"
                className="flex-1 overflow-y-auto mt-2 pb-2"
            >
                {isLoading ? (
                    <SessionSkeleton />
                ) : filteredSessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 px-4 text-center gap-2">
                        {!collapsed && (
                            <>
                                <MessageSquare className="w-7 h-7 text-muted-foreground/30" />
                                <p className="text-sm text-muted-foreground">No conversations yet</p>
                                <p className="text-xs text-muted-foreground/60">Start a new chat above</p>
                            </>
                        )}
                    </div>
                ) : collapsed ? (
                    <div className="flex flex-col items-center gap-1 px-2 pt-1">
                        {filteredSessions.map((s) => (
                            <SessionItem
                                key={s.id}
                                session={s}
                                isActive={activeSessionId === s.id}
                                onClick={() => onSelectSession(s.id)}
                                onDelete={setDeleteId}
                                onRename={handleRenameStart}
                                collapsed
                            />
                        ))}
                    </div>
                ) : (
                    <div className="px-2">
                        {Object.entries(grouped).map(([label, group]) => {
                            if (group.length === 0) return null;
                            return (
                                <div key={label} className="mb-4">
                                    <p className="px-2.5 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                        {label}
                                    </p>
                                    <div className="space-y-0.5">
                                        {group.map((s) =>
                                            renameId === s.id ? (
                                                <div key={s.id} className="px-2.5 py-1.5">
                                                    <input
                                                        ref={renameInputRef}
                                                        type="text"
                                                        value={renameValue}
                                                        onChange={(e) => setRenameValue(e.target.value)}
                                                        onBlur={() => handleRenameCommit(s.id)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") handleRenameCommit(s.id);
                                                            if (e.key === "Escape") setRenameId(null);
                                                        }}
                                                        aria-label="Rename conversation"
                                                        className="w-full h-8 px-2.5 text-sm bg-background border border-ring/60 rounded-lg outline-none ring-1 ring-ring/30"
                                                    />
                                                </div>
                                            ) : (
                                                <SessionItem
                                                    key={s.id}
                                                    session={s}
                                                    isActive={activeSessionId === s.id}
                                                    onClick={() => onSelectSession(s.id)}
                                                    onDelete={setDeleteId}
                                                    onRename={handleRenameStart}
                                                    collapsed={false}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </nav>

            {/* Footer: user info */}
            {!collapsed && user && (
                <div className="shrink-0 border-t border-sidebar-border p-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-muted transition-colors text-left outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <Avatar className="w-8 h-8 shrink-0">
                                <AvatarImage src={user.avatarUrl ?? undefined} alt={user.displayName} />
                                <AvatarFallback className="text-xs">{userInitial}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0 grid text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{user.displayName}</span>
                                {user.githubUsername && (
                                    <span className="truncate text-xs text-muted-foreground">
                                        @{user.githubUsername}
                                    </span>
                                )}
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                            align="end" 
                            side="top" 
                            sideOffset={4} 
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        >
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.displayName} />
                                            <AvatarFallback className="rounded-lg text-xs">{userInitial}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{user.displayName}</span>
                                            {user.githubUsername && (
                                                <span className="truncate text-xs text-muted-foreground">
                                                    @{user.githubUsername}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem render={
                                <Link href="/dashboard/settings">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </Link>
                            } />
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            {/* Delete confirmation dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this conversation and all its messages. This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteId && handleDelete(deleteId)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// ─── Desktop sidebar wrapper ──────────────────────────────────────────────────

type ChatSidebarProps = ChatSidebarContentProps;

export function ChatSidebar(props: ChatSidebarProps) {
    return (
        <aside
            className={cn(
                "hidden md:flex flex-col h-dvh sticky top-0 bg-sidebar border-r border-sidebar-border",
                "transition-all duration-300 shrink-0 overflow-hidden",
                props.collapsed ? "w-14" : "w-72"
            )}
        >
            <ChatSidebarContent {...props} />
        </aside>
    );
}
