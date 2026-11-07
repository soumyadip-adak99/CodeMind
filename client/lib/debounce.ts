/**
 * Reusable debounce utility and React hooks.
 * Prevents excessive executions (e.g. typing in search, autosave).
 */

import { useEffect, useState, useCallback, useRef } from "react";

/**
 * Creates a debounced function that delays invoking `func` until after `delayMs`
 * milliseconds have elapsed since the last time the debounced function was invoked.
 */
export function debounce<Args extends unknown[]>(
    func: (...args: Args) => void,
    delayMs: number
): ((...args: Args) => void) & { cancel: () => void; flush: () => void } {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Args | null = null;

    const debounced = (...args: Args) => {
        lastArgs = args;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            if (lastArgs) {
                func(...lastArgs);
                lastArgs = null;
            }
            timeoutId = null;
        }, delayMs);
    };

    debounced.cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        lastArgs = null;
    };

    debounced.flush = () => {
        if (timeoutId && lastArgs) {
            clearTimeout(timeoutId);
            func(...lastArgs);
            lastArgs = null;
            timeoutId = null;
        }
    };

    return debounced;
}

/**
 * Hook to debounce a rapidly changing value (e.g. search input).
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delayMs);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delayMs]);

    return debouncedValue;
}

/**
 * Hook to return a memoized debounced callback function.
 */
export function useDebouncedCallback<Args extends unknown[]>(
    callback: (...args: Args) => void,
    delayMs: number = 300
) {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    const debouncedFn = useCallback(
        debounce((...args: Args) => {
            callbackRef.current(...args);
        }, delayMs),
        [delayMs]
    );

    return debouncedFn;
}
