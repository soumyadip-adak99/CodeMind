"use client"

import { RequiredAuth } from "@/components/provider/required-auth"
import { OverviewDashboard } from "@/components/dashboard/overview-dashboard"

export default function OverviewPage() {
    return (
        <RequiredAuth>
            <OverviewDashboard />
        </RequiredAuth>
    )
}
