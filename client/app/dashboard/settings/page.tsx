"use client"

import { RequiredAuth } from "@/components/provider/required-auth"
import { SettingsDashboard } from "@/components/dashboard/settings-dashboard"

export default function SettingsPage() {
    return (
        <RequiredAuth>
            <SettingsDashboard />
        </RequiredAuth>
    )
}
