"use client";
import { useEffect, useRef, useState } from "react";

// ── Cinematic boot: single node → network → score → hero ──────────────────
interface Props { onComplete: () => void; }

const SEQUENCE = [
    { text: "Neural Orbit is listening…", t: 300 },
    { text: "» Establishing neural link", t: 1000 },
    { text: "» Scanning signal channels", t: 1600 },
    { text: "» Calibrating intelligence engine", t: 2200 },
];

export default function BootSequence({ onComplete }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [lines, setLines] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [done, setDone] = useState(false);

    // Reveal terminal lines
    useEffect(() => {
        const timers: ReturnType<typeof setTimeout>[] = [];
        SEQUENCE.forEach((s, i) => timers.push(setTimeout(() => setLines(p => [...p, i]), s.t)));
        timers.push(setTimeout(() => setShowScore(true), 2800));
        timers.push(setTimeout(() => setDone(true), 4200));
        timers.push(setTimeout(() => onComplete(), 4900));
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    // Count-up score
    useEffect(() => {
        if (!showScore) return;
        let v = 0;
        const iv = setInterval(() => {
            v += 2.1;
            setScore(Math.min(94.2, parseFloat(v.toFixed(1))));
            if (v >= 94.2) clearInterval(iv);
        }, 16);
        return () => clearInterval(iv);
    }, [showScore]);

    // Canvas: single expanding node → network
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const W = canvas.width, H = canvas.height;
        const CX = W / 2, CY = H / 2;

        // 36 nodes that appear over time
        const nodes = Array.from({ length: 36 }, (_, i) => ({
            x: CX + (Math.random() - 0.5) * W * 0.7,
            y: CY + (Math.random() - 0.5) * H * 0.6,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            born: 600 + i * 55,
            r: Math.random() * 1.5 + 0.5,
        }));

        let t0 = performance.now(), animId: number;

        const draw = (now: number) => {
            const elapsed = now - t0;
            ctx.clearRect(0, 0, W, H);

            // Background
            ctx.fillStyle = "#00000a";
            ctx.fillRect(0, 0, W, H);

            // Central core node — expands from 0
            const coreProgress = Math.min(1, elapsed / 600);
            const coreR = coreProgress * 8;
            const coreA = coreProgress;
            if (coreR > 0) {
                const cg = ctx.createRadialGradient(CX, CY, 0, CX, CY, coreR * 10);
                cg.addColorStop(0, `rgba(100,160,255,${(coreA * 0.5).toFixed(2)})`);
                cg.addColorStop(0.4, `rgba(41,98,255,${(coreA * 0.2).toFixed(2)})`);
                cg.addColorStop(1, "rgba(41,98,255,0)");
                ctx.beginPath(); ctx.arc(CX, CY, coreR * 10, 0, Math.PI * 2);
                ctx.fillStyle = cg; ctx.fill();

                ctx.beginPath(); ctx.arc(CX, CY, coreR, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(180,210,255,${coreA.toFixed(2)})`;
                ctx.fill();
            }

            // Satellite nodes
            const activeNodes = nodes.filter(n => n.born <= elapsed);
            activeNodes.forEach(n => {
                n.x += n.vx; n.y += n.vy;
                n.vx *= 0.99; n.vy *= 0.99;
                const age = elapsed - n.born;
                const a = Math.min(1, age / 400);
                // Connection to centre
                const d = Math.hypot(n.x - CX, n.y - CY);
                if (d < 350) {
                    ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(n.x, n.y);
                    ctx.strokeStyle = `rgba(41,98,255,${(a * 0.25).toFixed(2)})`;
                    ctx.lineWidth = 0.6; ctx.stroke();
                }
                // Peer connections
                activeNodes.forEach(m => {
                    const pd = Math.hypot(n.x - m.x, n.y - m.y);
                    if (pd < 140 && pd > 0) {
                        ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y);
                        ctx.strokeStyle = `rgba(41,98,255,${(a * 0.12).toFixed(2)})`;
                        ctx.lineWidth = 0.4; ctx.stroke();
                    }
                });
                // Node
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(77,122,255,${a.toFixed(2)})`; ctx.fill();
            });

            animId = requestAnimationFrame(draw);
        };
        animId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animId);
    }, []);

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{
                background: "#00000a",
                opacity: done ? 0 : 1,
                transition: "opacity 0.7s ease",
                pointerEvents: done ? "none" : "all",
            }}
        >
            <canvas ref={canvasRef} className="absolute inset-0" />

            <div className="relative z-10 max-w-lg w-full px-8">
                {/* Logo — actual Neural Orbit SVG */}
                <div className="flex items-center gap-3 mb-10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/neuralorbit.svg`}
                        alt="Neural Orbit"
                        style={{ height: 44, width: "auto", filter: "brightness(0) invert(1)" }}
                    />
                </div>

                {/* Terminal lines */}
                <div className="font-mono text-sm space-y-2.5">
                    {SEQUENCE.map((s, i) => (
                        <div key={i} style={{ opacity: lines.includes(i) ? 1 : 0, transition: "opacity 0.3s" }}
                            className={i === 0 ? "text-white" : "text-slate-500"}>
                            {s.text}
                            {/* blinking cursor on active line */}
                            {lines.includes(i) && !lines.includes(i + 1) && (
                                <span className="inline-block w-0.5 h-3.5 bg-current ml-1 align-middle"
                                    style={{ animation: "blink 1s step-end infinite" }} />
                            )}
                        </div>
                    ))}

                    {/* Intelligence score */}
                    <div style={{ opacity: showScore ? 1 : 0, transition: "opacity 0.4s" }}
                        className="flex items-center gap-2 pt-1">
                        <span className="text-slate-500">» Intelligence Score:</span>
                        <span className="text-blue-400 font-bold">{score.toFixed(1)}</span>
                        {score >= 94.2 && <span className="text-emerald-400 text-xs">✓ ONLINE</span>}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-8 h-px bg-white/5 overflow-hidden rounded-full">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${Math.min(100, (lines.length / SEQUENCE.length + (showScore && score >= 94.2 ? 0.5 : 0)) * 100)}%`,
                            background: "linear-gradient(90deg,#1a3a8f,#2962FF,#4D7AFF)",
                            boxShadow: "0 0 8px rgba(41,98,255,0.9)",
                        }}
                    />
                </div>
            </div>
            <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
        </div>
    );
}
