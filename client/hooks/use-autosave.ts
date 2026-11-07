"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { debounce } from "@/lib/debounce";

export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

interface UseAutosaveOptions<T> {
    data: T;
    onSave: (data: T) => Promise<void> | void;
    delayMs?: number;
    enabled?: boolean;
}

export function useAutosave<T>({
    data,
    onSave,
    delayMs = 1000,
    enabled = true,
}: UseAutosaveOptions<T>) {
    const [status, setStatus] = useState<AutosaveStatus>("idle");
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const dataRef = useRef(data);
    dataRef.current = data;

    const onSaveRef = useRef(onSave);
    onSaveRef.current = onSave;

    const isFirstRender = useRef(true);
    const isDirtyRef = useRef(false);

    const executeSave = useCallback(async (dataToSave: T) => {
        setStatus("saving");
        setErrorMessage(null);
        try {
            await onSaveRef.current(dataToSave);
            setStatus("saved");
            setLastSavedAt(new Date());
            isDirtyRef.current = false;
        } catch (err) {
            setStatus("error");
            setErrorMessage(err instanceof Error ? err.message : "Failed to autosave changes");
        }
    }, []);

    const debouncedSave = useRef(
        debounce((dataToSave: T) => {
            void executeSave(dataToSave);
        }, delayMs)
    ).current;

    useEffect(() => {
        if (!enabled) return;

        // Skip saving on initial mount
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        isDirtyRef.current = true;
        setStatus("idle");
        debouncedSave(data);

        return () => {
            debouncedSave.cancel();
        };
    }, [data, enabled, debouncedSave]);

    // Warn user before leaving page if there are unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirtyRef.current) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    const saveNow = useCallback(async () => {
        debouncedSave.cancel();
        await executeSave(dataRef.current);
    }, [debouncedSave, executeSave]);

    return {
        status,
        lastSavedAt,
        errorMessage,
        saveNow,
        isDirty: isDirtyRef.current,
    };
}

