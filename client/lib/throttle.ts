/**
 * Reusable throttle utility and React hooks.
 * Limits function execution to at most once per `limitMs` (e.g. scroll, resize).
 */

import { useEffect, useState, useCallback, useRef } from "react";

/**
 * Creates a throttled function that only invokes `func` at most once per every `limitMs` milliseconds.
 */
export function throttle<Args extends unknown[]>(
    func: (...args: Args) => void,
    limitMs: number
): ((...args: Args) => void) & { cancel: () => void } {
    let inThrottle = false;
    let lastArgs: Args | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const throttled = (...args: Args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            timeoutId = setTimeout(() => {
                inThrottle = false;
                if (lastArgs) {
                    throttled(...lastArgs);
                    lastArgs = null;
                }
            }, limitMs);
        } else {
            lastArgs = args;
        }
    };

    throttled.cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        inThrottle = false;
        lastArgs = null;
    };

    return throttled;
}

/**
 * Hook to throttle a rapidly changing value (e.g. scroll positions, window sizes).
 */
export function useThrottle<T>(value: T, limitMs: number = 200): T {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const lastRanRef = useRef<number>(0);

    useEffect(() => {
        const now = Date.now();
        if (now - lastRanRef.current >= limitMs) {
            setThrottledValue(value);
            lastRanRef.current = now;
            return;
        }

        const handler = setTimeout(() => {
            setThrottledValue(value);
            lastRanRef.current = Date.now();
        }, limitMs - (now - lastRanRef.current));

        return () => {
            clearTimeout(handler);
        };
    }, [value, limitMs]);

    return throttledValue;
}

/**
 * Hook to return a memoized throttled callback function.
 */
export function useThrottledCallback<Args extends unknown[]>(
    callback: (...args: Args) => void,
    limitMs: number = 200
) {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    const throttledFn = useCallback(
        throttle((...args: Args) => {
            callbackRef.current(...args);
        }, limitMs),
        [limitMs]
    );

    return throttledFn;
}
