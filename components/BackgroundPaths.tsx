"use client";
import { useEffect, useRef } from "react";

// ─── Background Paths (inspired by KokonutD) ───────────────────────────────
// Animated SVG curved paths that drift slowly across the background.
// Each path has a unique curve and travels from off-screen to off-screen.

type PathDef = { d: string; duration: number; delay: number; opacity: number };

function generatePaths(W: number, H: number): PathDef[] {
    const paths: PathDef[] = [];
    const count = 20;
    for (let i = 0; i < count; i++) {
        const startX = -W * 0.2 + (i / count) * W * 1.4;
        const startY = H + 60;
        const cp1x = startX + (Math.random() - 0.5) * W * 0.6;
        const cp1y = H * 0.6 - Math.random() * H * 0.3;
        const cp2x = startX + (Math.random() - 0.5) * W * 0.4;
        const cp2y = H * 0.2 - Math.random() * H * 0.2;
        const endX = startX + (Math.random() - 0.5) * W * 0.5;
        const endY = -60;

        paths.push({
            d: `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`,
            duration: 4 + Math.random() * 6,
            delay: Math.random() * 6,
            opacity: 0.03 + Math.random() * 0.08,
        });
    }
    return paths;
}

export default function BackgroundPaths({ className = "" }: { className?: string }) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        const W = window.innerWidth;
        const H = window.innerHeight;
        svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

        const paths = generatePaths(W, H);

        // Remove old paths
        while (svg.firstChild) svg.removeChild(svg.firstChild);

        paths.forEach((pDef) => {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pDef.d);
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", "white");
            path.setAttribute("stroke-width", "1");
            path.setAttribute("stroke-opacity", String(pDef.opacity));

            // Animate dash offset for draw-on effect
            const length = 2000; // approximate
            path.setAttribute("stroke-dasharray", String(length));
            path.setAttribute("stroke-dashoffset", String(length));

            const anim = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            anim.setAttribute("attributeName", "stroke-dashoffset");
            anim.setAttribute("from", String(length));
            anim.setAttribute("to", String(-length));
            anim.setAttribute("dur", `${pDef.duration}s`);
            anim.setAttribute("begin", `${pDef.delay}s`);
            anim.setAttribute("repeatCount", "indefinite");
            anim.setAttribute("calcMode", "linear");

            path.appendChild(anim);
            svg.appendChild(path);
        });
    }, []);

    return (
        <svg
            ref={svgRef}
            className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
        />
    );
}
