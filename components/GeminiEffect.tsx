"use client";
import { useRef, useEffect, useState } from "react";

// ─── Google Gemini Effect (Aceternity style) ────────────────────────────────
// Scroll-driven SVG beam paths that progressively draw themselves as the user
// scrolls down into the section. Each path reveals from 0 to full length.
// Colours match the Gemini beam palette adapted to Neural Orbit.

const PATHS = [
    "M 0 350 C 150 200, 350 500, 600 300 S 900 100, 1200 350",
    "M 0 300 C 200 450, 400 150, 650 280 S 950 450, 1200 300",
    "M 0 400 C 100 250, 300 480, 550 320 S 850 180, 1200 400",
    "M 0 250 C 250 400, 500 200, 700 330 S 1000 450, 1200 250",
    "M 0 450 C 180 300, 380 500, 620 360 S 920 220, 1200 450",
];

const BEAM_COLORS = [
    "#2962FF",  // electric blue
    "#4D7AFF",  // medium blue
    "#6B9FFF",  // sky blue
    "#1E90FF",  // dodger blue
    "#38bdf8",  // light cyan-blue
];

export default function GeminiEffect({ containerRef }: { containerRef?: React.RefObject<HTMLElement | null> }) {
    const [progress, setProgress] = useState(0); // 0 → 1 as section scrolls into view

    useEffect(() => {
        const onScroll = () => {
            const el = containerRef?.current ?? document.documentElement;
            const rect = (el as HTMLElement).getBoundingClientRect?.() ?? { top: 0, height: window.innerHeight };
            const scrolled = Math.max(0, -rect.top);
            const total = Math.max(1, (rect as DOMRect).height - window.innerHeight);
            setProgress(Math.min(1, scrolled / (total * 0.6)));
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, [containerRef]);

    return (
        <svg
            viewBox="0 0 1200 600"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
        >
            <defs>
                {PATHS.map((_, i) => (
                    <linearGradient key={`grad-${i}`} id={`beam-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={BEAM_COLORS[i]} stopOpacity="0" />
                        <stop offset="30%" stopColor={BEAM_COLORS[i]} stopOpacity="1" />
                        <stop offset="70%" stopColor={BEAM_COLORS[(i + 1) % BEAM_COLORS.length]} stopOpacity="1" />
                        <stop offset="100%" stopColor={BEAM_COLORS[(i + 1) % BEAM_COLORS.length]} stopOpacity="0" />
                    </linearGradient>
                ))}
                {/* Glow filter */}
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>

            {PATHS.map((d, i) => {
                // Stagger each beam — beam i starts revealing at 20% * i progress
                const beamStart = (i / PATHS.length) * 0.35;
                const beamProg = Math.min(1, Math.max(0, (progress - beamStart) / (1 - beamStart)));

                return (
                    <g key={i}>
                        {/* Base dim path */}
                        <path
                            d={d}
                            fill="none"
                            stroke={BEAM_COLORS[i]}
                            strokeWidth="1"
                            strokeOpacity="0.08"
                        />
                        {/* Animated draw path */}
                        <path
                            d={d}
                            fill="none"
                            stroke={`url(#beam-grad-${i})`}
                            strokeWidth={1.5 + i * 0.3}
                            strokeLinecap="round"
                            filter="url(#glow)"
                            strokeDasharray="1200"
                            strokeDashoffset={1200 * (1 - beamProg)}
                            style={{ transition: "stroke-dashoffset 0.05s linear" }}
                            strokeOpacity={0.7 + beamProg * 0.3}
                        />
                    </g>
                );
            })}
        </svg>
    );
}
