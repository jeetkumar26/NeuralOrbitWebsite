"use client";
import { useRef, useEffect, useState, ReactNode } from "react";

// ─── Container Scroll Animation (Aceternity style) ──────────────────────────
// Wraps children in a 3-D perspective container that rotates from an initial
// tilted angle to flat as the user scrolls into view.

interface ContainerScrollProps {
    titleComponent: ReactNode;
    children: ReactNode;
    className?: string;
}

export default function ContainerScroll({
    titleComponent,
    children,
    className = "",
}: ContainerScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollProg, setScrollProg] = useState(0); // 0 → 1

    useEffect(() => {
        const onScroll = () => {
            const el = containerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const total = el.clientHeight + window.innerHeight;
            const offset = window.innerHeight - rect.top;
            setScrollProg(Math.min(1, Math.max(0, offset / total)));
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // rotateX from 20° (flat-ish initial) down to 0° (fully flat)
    const rotateX = 20 - scrollProg * 20;
    const scale = 0.9 + scrollProg * 0.1;
    const translateY = -scrollProg * 40;

    return (
        <div
            ref={containerRef}
            className={`relative flex flex-col items-center py-16 ${className}`}
            style={{ perspective: "1200px" }}
        >
            {/* Title above container */}
            <div className="mb-10 text-center z-10">{titleComponent}</div>

            {/* The 3-D card */}
            <div
                className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl"
                style={{
                    transform: `rotateX(${rotateX}deg) scale(${scale}) translateY(${translateY}px)`,
                    transformOrigin: "center top",
                    transition: "transform 0.1s linear",
                    border: "1px solid rgba(41,98,255,0.2)",
                    background: "rgba(11,15,26,0.9)",
                    boxShadow: "0 30px 80px rgba(41,98,255,0.15), 0 0 0 1px rgba(41,98,255,0.1)",
                }}
            >
                {/* Top bar (browser chrome feel) */}
                <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(41,98,255,0.1)" }}>
                    <span className="w-3 h-3 rounded-full bg-red-500/60" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <span className="w-3 h-3 rounded-full bg-green-500/60" />
                    <div className="flex-1 mx-4 h-5 rounded-full" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
                </div>
                <div className="overflow-hidden">{children}</div>
            </div>

            {/* Gradient fade at bottom */}
            <div
                className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, transparent, #0B0F1A)" }}
            />
        </div>
    );
}
