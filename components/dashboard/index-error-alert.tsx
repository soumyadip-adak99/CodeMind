"use client";

import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface IndexErrorAlertProps {
    errorMessage: string | null | undefined;
    repoName?: string;
}

export function IndexErrorAlert({ errorMessage, repoName }: IndexErrorAlertProps) {
    if (!errorMessage) return null;

    return (
        <Alert variant="destructive" className="text-sm">
            <AlertTriangle className="size-4" />
            <AlertTitle className="font-semibold">
                Indexing failed{repoName ? ` for ${repoName}` : ""}
            </AlertTitle>
            <AlertDescription className="mt-1 text-xs font-mono break-all">
                {errorMessage}
            </AlertDescription>
        </Alert>
    );
}
