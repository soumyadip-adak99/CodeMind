import { DashBoardNavItem, DashboardNavGroup } from "@/@type";
import { FolderGit2, LayoutGrid, Settings } from "lucide-react";

export const dashboardNavGroups: DashboardNavGroup[] = [
    {
        label: "Workspace",
        items: [
            {
                title: "Overview",
                href: "/dashboard/overview",
                icon: LayoutGrid,
            },
            {
                title: "Repositories",
                href: "/dashboard",
                icon: FolderGit2,
                exact: true,
            },
        ],
    },

    {
        label: "Accout",
        items: [
            {
                title: "Settings",
                href: "/dashboard/settings",
                icon: Settings,
            },
        ],
    },
];

export function isDashboardNavActive(pathname: string, href: string, exact = false) {
    if (exact) return pathname === href;

    return pathname === href || pathname.startsWith(`${href}/`);
}
