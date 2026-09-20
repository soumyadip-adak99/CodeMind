"use client"

import { RequiredAuth } from "@/components/provider/required-auth"
import { RepoDashboard } from "@/components/dashboard/repo-dashboard"

export default function DashboardPage() {
    return (
        <RequiredAuth>
            <RepoDashboard />
        </RequiredAuth>
    )
}
