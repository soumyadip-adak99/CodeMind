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
