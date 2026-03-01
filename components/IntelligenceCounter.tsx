"use client";
import { useEffect, useRef, useState } from "react";

const SCORES = ["87.3", "91.6", "94.2"];

export default function IntelligenceCounter() {
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setIndex((i) => (i + 1) % SCORES.length);
                setFade(true);
            }, 300);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="inline-flex items-center gap-3 glass-card px-4 py-2 rounded-lg animate-pulse-glow">
            <div className="w-2 h-2 rounded-full bg-blue-accent animate-pulse" />
            <span className="text-slate-400 text-sm font-medium">Intelligence Score</span>
            <span
                className="text-xl font-bold font-mono transition-opacity duration-300"
                style={{
                    opacity: fade ? 1 : 0,
                    color: "#4D7AFF",
                    textShadow: "0 0 20px rgba(41,98,255,0.6)",
                }}
            >
                {SCORES[index]}
            </span>
        </div>
    );
}
