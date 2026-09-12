import type { SVGProps } from "react";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Settings } from "lucide-react";
import { CodeMindIcon } from "@/components/icons/code-mind";
import { ModeToggle } from "../ui/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

import { cn } from "@/lib/utils";
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
    const { data: user } = useCurrentUser();
    const logout = useLogout();

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
                                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                                    <CodeMindIcon className="size-9" />
                                </div>
                                <div className="flex flex-col flex-1 text-left text-xl leading-tight ml-1">
                                    <span className="truncate font-semibold">CodeMind</span>
                                    <span className="truncate text-sm">Chat your code</span>
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

export function BrandMark({ className, ...props }: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="CodeMind"
            role="img"
            {...props}
        >
            {/* Brain / Mind */}
            <path
                d="
          M18 10
          C14.5 8 10.5 10 10.5 14
          C7.5 14.5 6 17 7 19.5
          C4.5 21 4 24.5 6.5 26.5
          C5 29.5 7 32.5 10 32.5
          C10 36 13 38 16 37
          C17 40 20 41 22 39.5
          M30 10
          C33.5 8 37.5 10 37.5 14
          C40.5 14.5 42 17 41 19.5
          C43.5 21 44 24.5 41.5 26.5
          C43 29.5 41 32.5 38 32.5
          C38 36 35 38 32 37
          C31 40 28 41 26 39.5
        "
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Left code bracket < */}
            <path
                d="M20 19L15 24L20 29"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Code slash / */}
            <path d="M27 18L22 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

            {/* Right code bracket > */}
            <path
                d="M28 19L33 24L28 29"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function GhostButtonLink({
    href,
    children,
    className,
}: {
    href: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Button variant="ghost" size="sm" className={className} render={<Link href={href} />}>
            {children}
        </Button>
    );
}
