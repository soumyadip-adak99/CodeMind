"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useScrollStore } from "@/store/scroll-store";
import { FieldEngine } from "./field-engine";
import { FallbackSVG } from "./fallback-svg";
import { cn } from "@/lib/utils";

export function VectorFieldCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<FieldEngine | null>(null);
    const scrollProgress = useScrollStore((state) => state.scrollProgress);
    const { theme } = useTheme();
    const isDark = theme === "dark" || theme === "system";
    
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQuery.matches);
        
        const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    useEffect(() => {
        if (prefersReducedMotion || hasError || !canvasRef.current || !containerRef.current) return;

        try {
            // Adaptive quality: fewer particles on mobile
            const isMobile = window.innerWidth < 768;
            const numParticles = isMobile ? 900 : 2500;

            engineRef.current = new FieldEngine({
                canvas: canvasRef.current,
                numParticles,
                isDark,
            });

            // Intersection Observer to pause animation when offscreen
            const io = new IntersectionObserver((entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    engineRef.current?.start();
                } else {
                    engineRef.current?.stop();
                }
            }, { threshold: 0.01 });

            io.observe(containerRef.current);

            // Resize Observer
            const ro = new ResizeObserver(() => {
                engineRef.current?.resize();
            });
            ro.observe(containerRef.current);

            // Visibility change (tab hidden)
            const handleVisibility = () => {
                if (document.hidden) {
                    engineRef.current?.stop();
                } else if (containerRef.current && io.takeRecords().length === 0) { // lazy check
                    engineRef.current?.start();
                }
            };
            document.addEventListener("visibilitychange", handleVisibility);

            // Pointer tracking for parallax
            const handlePointerMove = (e: PointerEvent) => {
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;
                // Local coordinates
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                engineRef.current?.setPointer(x, y);
            };
            window.addEventListener("pointermove", handlePointerMove, { passive: true });

            return () => {
                io.disconnect();
                ro.disconnect();
                document.removeEventListener("visibilitychange", handleVisibility);
                window.removeEventListener("pointermove", handlePointerMove);
                engineRef.current?.stop();
                engineRef.current = null;
            };
        } catch (err) {
            console.error("Canvas 2D Engine failed to initialize:", err);
            setHasError(true);
        }
    }, [prefersReducedMotion, hasError]);

    // Update theme
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.setTheme(isDark);
        }
    }, [isDark]);

    // Sync with global scroll store (HowItWorks controls this)
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.setScrollProgress(scrollProgress);
        }
    }, [scrollProgress]);

    if (prefersReducedMotion || hasError) {
        return (
            <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none" aria-hidden="true">
                <FallbackSVG className="w-full max-w-2xl h-auto" />
            </div>
        );
    }

    return (
        <div ref={containerRef} className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <canvas 
                className={cn(
                    "w-full h-full block opacity-0 transition-opacity duration-1000", 
                    "data-[loaded=true]:opacity-100"
                )} 
                // Set data-loaded to true after hydration to fade in smoothly
                ref={node => {
                    if (node) {
                        // @ts-ignore
                        canvasRef.current = node;
                        requestAnimationFrame(() => {
                            node.setAttribute('data-loaded', 'true');
                        });
                    }
                }}
            />
        </div>
    );
}
