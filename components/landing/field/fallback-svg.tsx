import { cn } from "@/lib/utils";

export function FallbackSVG({ className }: { className?: string }) {
    return (
        <div className={cn("w-full h-full flex items-center justify-center opacity-30", className)}>
            <svg viewBox="0 0 400 400" className="w-full h-full max-w-2xl text-primary" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Central Node */}
                <circle cx="200" cy="200" r="15" fill="currentColor" opacity="0.8" />
                <circle cx="200" cy="200" r="25" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                <circle cx="200" cy="200" r="40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.2" />

                {/* Filaments & Cluster nodes */}
                <g stroke="currentColor" strokeWidth="1" opacity="0.3">
                    <line x1="200" y1="200" x2="120" y2="100" />
                    <line x1="200" y1="200" x2="300" y2="120" />
                    <line x1="200" y1="200" x2="280" y2="300" />
                    <line x1="200" y1="200" x2="100" y2="280" />
                </g>

                <g fill="currentColor" opacity="0.6">
                    {/* Top Left Cluster */}
                    <circle cx="120" cy="100" r="6" />
                    <circle cx="110" cy="90" r="3" />
                    <circle cx="130" cy="85" r="4" />
                    <circle cx="105" cy="115" r="3" />
                    <line x1="120" y1="100" x2="110" y2="90" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="120" y1="100" x2="130" y2="85" stroke="currentColor" strokeWidth="0.5" />

                    {/* Top Right Cluster */}
                    <circle cx="300" cy="120" r="5" />
                    <circle cx="315" cy="110" r="3" />
                    <circle cx="290" cy="100" r="4" />
                    <line x1="300" y1="120" x2="315" y2="110" stroke="currentColor" strokeWidth="0.5" />

                    {/* Bottom Right Cluster */}
                    <circle cx="280" cy="300" r="7" />
                    <circle cx="295" cy="315" r="4" />
                    <circle cx="260" cy="310" r="3" />
                    <circle cx="285" cy="280" r="3" />
                    <line x1="280" y1="300" x2="295" y2="315" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="280" y1="300" x2="260" y2="310" stroke="currentColor" strokeWidth="0.5" />

                    {/* Bottom Left Cluster */}
                    <circle cx="100" cy="280" r="5" />
                    <circle cx="85" cy="295" r="3" />
                    <circle cx="115" cy="300" r="3" />
                    <line x1="100" y1="280" x2="85" y2="295" stroke="currentColor" strokeWidth="0.5" />
                </g>
                
                {/* Background Scattered Dots */}
                <g fill="currentColor" opacity="0.15">
                    <circle cx="50" cy="150" r="2" />
                    <circle cx="80" cy="50" r="1.5" />
                    <circle cx="350" cy="80" r="2" />
                    <circle cx="370" cy="200" r="1.5" />
                    <circle cx="330" cy="350" r="2" />
                    <circle cx="150" cy="380" r="1.5" />
                    <circle cx="40" cy="320" r="1.5" />
                </g>
            </svg>
        </div>
    );
}
