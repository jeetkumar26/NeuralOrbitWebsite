"use client";
import { useEffect, useRef } from "react";

// ── Neural Intelligence Field ─────────────────────────────────────────────
// 80 nodes, mouse-reactive, connection lines, pulse on click
// Lightweight: single canvas, neighbour check O(n²) acceptable at n=80

interface Node {
    x: number; y: number; vx: number; vy: number;
    r: number; alpha: number; pulse: number;
}

export default function NeuralField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let W = 0, H = 0, animId: number;

        const resize = () => {
            const p = canvas.parentElement;
            W = canvas.width = p ? p.clientWidth : window.innerWidth;
            H = canvas.height = p ? p.clientHeight : window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize, { passive: true });

        // Build 80 nodes
        const nodes: Node[] = Array.from({ length: 80 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.6 + 0.5,
            alpha: Math.random() * 0.6 + 0.4,
            pulse: 0,
        }));

        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };
        const onClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left, my = e.clientY - rect.top;
            nodes.forEach(n => {
                const d = Math.hypot(n.x - mx, n.y - my);
                if (d < 160) n.pulse = 1;
            });
        };
        const onLeave = () => { mouse.current = { x: -1000, y: -1000 }; };
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("click", onClick);
        canvas.addEventListener("mouseleave", onLeave);

        const CONN_DIST = 160;  // connection threshold
        const MOUSE_DIST = 130;  // mouse influence radius
        const REPEL_FORCE = 1.2;

        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            const mx = mouse.current.x, my = mouse.current.y;

            // Update nodes
            nodes.forEach(n => {
                // Mouse repulsion
                const dx = n.x - mx, dy = n.y - my, d = Math.hypot(dx, dy);
                if (d < MOUSE_DIST) {
                    const f = (1 - d / MOUSE_DIST) * REPEL_FORCE;
                    n.vx += (dx / d) * f; n.vy += (dy / d) * f;
                }

                // Dampen + move
                n.vx *= 0.97; n.vy *= 0.97;
                n.x = (n.x + n.vx + W) % W;
                n.y = (n.y + n.vy + H) % H;

                // Pulse decay
                if (n.pulse > 0) n.pulse = Math.max(0, n.pulse - 0.025);
            });

            // Draw edges
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i], b = nodes[j];
                    const d = Math.hypot(a.x - b.x, a.y - b.y);
                    if (d < CONN_DIST) {
                        const t = 1 - d / CONN_DIST;
                        const pBoost = Math.max(a.pulse, b.pulse);
                        const alpha = (t * 0.28 + pBoost * 0.25) * Math.min(a.alpha, b.alpha);
                        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(41,98,255,${alpha.toFixed(3)})`;
                        ctx.lineWidth = t * 1.2 + pBoost * 0.8;
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            nodes.forEach(n => {
                const nearMouse = Math.hypot(n.x - mx, n.y - my) < MOUSE_DIST;
                const gA = nearMouse ? n.alpha : n.alpha * 0.7;
                const pA = n.pulse;

                // Pulse ring
                if (pA > 0) {
                    const pr = (1 - pA) * 60 + n.r;
                    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pr);
                    g.addColorStop(0, `rgba(41,98,255,${(pA * 0.3).toFixed(3)})`);
                    g.addColorStop(1, "rgba(41,98,255,0)");
                    ctx.beginPath(); ctx.arc(n.x, n.y, pr, 0, 6.28);
                    ctx.fillStyle = g; ctx.fill();
                }

                // Glow
                if (nearMouse) {
                    const gg = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
                    gg.addColorStop(0, "rgba(77,122,255,0.35)");
                    gg.addColorStop(1, "rgba(77,122,255,0)");
                    ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, 6.28);
                    ctx.fillStyle = gg; ctx.fill();
                }

                // Node disc
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r + (nearMouse ? 0.5 : 0) + (pA > 0.5 ? 0.3 : 0), 0, 6.28);
                ctx.fillStyle = `rgba(77,122,255,${gA.toFixed(3)})`; ctx.fill();
            });

            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("mousemove", onMouseMove);
            canvas.removeEventListener("click", onClick);
            canvas.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ cursor: "crosshair" }}
        />
    );
}
