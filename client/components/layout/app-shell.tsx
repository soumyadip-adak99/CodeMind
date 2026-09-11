import type { SVGProps } from "react";

export function BrandMark({ className, ...props }: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="CodeMind"
            role="img"
            {...props}
        >
            {/* Brain / Mind */}
            <path
                d="
          M18 10
          C14.5 8 10.5 10 10.5 14
          C7.5 14.5 6 17 7 19.5
          C4.5 21 4 24.5 6.5 26.5
          C5 29.5 7 32.5 10 32.5
          C10 36 13 38 16 37
          C17 40 20 41 22 39.5
          M30 10
          C33.5 8 37.5 10 37.5 14
          C40.5 14.5 42 17 41 19.5
          C43.5 21 44 24.5 41.5 26.5
          C43 29.5 41 32.5 38 32.5
          C38 36 35 38 32 37
          C31 40 28 41 26 39.5
        "
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Left code bracket < */}
            <path
                d="M20 19L15 24L20 29"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Code slash / */}
            <path d="M27 18L22 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

            {/* Right code bracket > */}
            <path
                d="M28 19L33 24L28 29"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
