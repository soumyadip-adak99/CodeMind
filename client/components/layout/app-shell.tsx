import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Settings, Keyboard, HelpCircle, Compass, Search, Command } from "lucide-react";
import { CodeMindIcon } from "@/components/icons/code-mind";
import { ModeToggle } from "../ui/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui-store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

import { Separator } from "@/components/ui/separator";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    SidebarProvider,
} from "@/components/ui/sidebar";

import { dashboardNavGroups, isDashboardNavActive } from "@/lib/dashboard-nav";

import { useCurrentUser, useLogout } from "@/hooks/use-auth";

export function AppShell({
    children,
    title,
    description,
    actions,
    hideHeader = false,
}: {
    children: React.ReactNode;
    title?: string;
    description?: string;
    actions?: React.ReactNode;
    hideHeader?: boolean;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: user } = useCurrentUser();
    const logout = useLogout();
    const { toggleCommandPalette, setShortcutsDialogOpen, setOnboardingWizardOpen } = useUIStore();

    // Global navigation chords: g then d, g then o, g then s
    useEffect(() => {
        let lastKey = "";
        let timer: NodeJS.Timeout;

        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            if (
                target?.tagName === "INPUT" ||
                target?.tagName === "TEXTAREA" ||
                target?.isContentEditable
            ) {
                return;
            }

            if (e.metaKey || e.ctrlKey || e.altKey) return;

            const key = e.key.toLowerCase();
            if (lastKey === "g") {
                if (key === "d") {
                    e.preventDefault();
                    router.push("/dashboard");
                } else if (key === "o") {
                    e.preventDefault();
                    router.push("/dashboard/overview");
                } else if (key === "s") {
                    e.preventDefault();
                    router.push("/dashboard/settings");
                }
                lastKey = "";
                clearTimeout(timer);
                return;
            }

            if (key === "g") {
                lastKey = "g";
                clearTimeout(timer);
                timer = setTimeout(() => {
                    lastKey = "";
                }, 1000);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            clearTimeout(timer);
        };
    }, [router]);

    return (
        <SidebarProvider>
            <Sidebar variant="inset" collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                render={<Link href="/dashboard" />}
                                tooltip="CodeMind"
                            >
                                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                                    <CodeMindIcon className="size-6" />
                                </div>
                                <div className="flex flex-col flex-1 text-left text-xl leading-tight ml-2">
                                    <span className="truncate font-bold tracking-tight">CodeMind</span>
                                    <span className="truncate text-xs font-medium text-muted-foreground uppercase tracking-wider">Workspace</span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    {dashboardNavGroups.map((group) => (
                        <SidebarGroup key={group.label}>
                            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {group.items.map((item) => {
                                        const isActive = isDashboardNavActive(
                                            pathname,
                                            item.href,
                                            item.exact
                                        );

                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    render={<Link href={item.href} />}
                                                    isActive={isActive}
                                                    tooltip={item.title}
                                                >
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    render={
                                        <SidebarMenuButton
                                            size="lg"
                                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                        >
                                            <Avatar className="h-8 w-8 rounded-lg">
                                                <AvatarImage
                                                    src={user?.avatarUrl || undefined}
                                                    alt={user?.displayName ?? ""}
                                                />
                                                <AvatarFallback className="rounded-lg">
                                                    {user?.displayName?.charAt(0).toUpperCase() ??
                                                        "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-semibold">
                                                    {user?.displayName ?? "User"}
                                                </span>
                                                <span className="truncate text-xs">
                                                    {user?.githubUsername
                                                        ? `@${user.githubUsername}`
                                                        : ""}
                                                </span>
                                            </div>
                                        </SidebarMenuButton>
                                    }
                                />
                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                    side="bottom"
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="p-0 font-normal">
                                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                                <Avatar className="h-8 w-8 rounded-lg">
                                                    <AvatarImage
                                                        src={user?.avatarUrl || undefined}
                                                        alt={user?.displayName ?? ""}
                                                    />
                                                    <AvatarFallback className="rounded-lg">
                                                        {user?.displayName?.charAt(0).toUpperCase() ??
                                                            "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="grid flex-1 text-left text-sm leading-tight">
                                                    <span className="truncate font-semibold">
                                                        {user?.displayName ?? "User"}
                                                    </span>
                                                    <span className="truncate text-xs">
                                                        {user?.githubUsername
                                                            ? `@${user.githubUsername}`
                                                            : ""}
                                                    </span>
                                                </div>
                                            </div>
                                        </DropdownMenuLabel>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        render={
                                            <Link href="/dashboard/settings">
                                                <Settings className="mr-2 h-4 w-4" />
                                                Settings
                                            </Link>
                                        }
                                    />
                                    <DropdownMenuItem onClick={() => setShortcutsDialogOpen(true)}>
                                        <Keyboard className="mr-2 h-4 w-4" />
                                        Keyboard shortcuts
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setOnboardingWizardOpen(true)}>
                                        <Compass className="mr-2 h-4 w-4" />
                                        Onboarding tour
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => logout()}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                {!hideHeader && (
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            {title && (
                                <div className="flex flex-col">
                                    <h1 className="text-sm font-semibold">{title}</h1>
                                    {description && (
                                        <p className="text-xs text-muted-foreground">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            {/* Global Command Palette search trigger */}
                            <button
                                type="button"
                                onClick={toggleCommandPalette}
                                className="flex h-8 items-center gap-2 rounded-xl border border-input bg-muted/40 px-3 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
                                aria-label="Open command palette"
                            >
                                <Search className="size-3.5 shrink-0" />
                                <span className="hidden sm:inline">Search & commands...</span>
                                <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center justify-center gap-1 rounded-md border border-border/80 bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-xs">
                                    <Command className="size-3 shrink-0" />
                                    <span className="text-[10px] font-semibold leading-none">K</span>
                                </kbd>
                            </button>
                            {actions}
                            <ModeToggle />
                        </div>
                    </header>
                )}
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-8 mt-4">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
