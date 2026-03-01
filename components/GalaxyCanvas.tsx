"use client";
import { useEffect, useRef } from "react";

// ── types ──────────────────────────────────────────────────────────────────
interface Star { nx: number; ny: number; r: number; baseAlpha: number; speed: number; phase: number; color: string; layer: number; }
interface Meteor { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; w: number; }
interface Nebula { nx: number; ny: number; r: number; color: string; alpha: number; driftX: number; driftY: number; px: number; py: number; }

function rand(a: number, b: number) { return a + Math.random() * (b - a); }

const STAR_COLORS = ["#ffffff", "#ffe8c8", "#c8d8ff", "#ffd0a0", "#e0f0ff"];
const NEBULA_CONFIGS = [
    { color: "rgba(41,98,255,", a: 0.07 },
    { color: "rgba(80,40,180,", a: 0.06 },
    { color: "rgba(0,140,200,", a: 0.05 },
    { color: "rgba(20,60,180,", a: 0.08 },
    { color: "rgba(100,20,160,", a: 0.05 },
];

function buildStars(): Star[] {
    const out: Star[] = [];
    // Layer 0 – tiny distant (600)
    for (let i = 0; i < 600; i++) out.push({ nx: Math.random(), ny: Math.random(), r: rand(0.2, 0.6), baseAlpha: rand(0.2, 0.7), speed: rand(0.008, 0.025), phase: rand(0, 6.28), color: STAR_COLORS[i % STAR_COLORS.length], layer: 0 });
    // Layer 1 – mid (200)
    for (let i = 0; i < 200; i++) out.push({ nx: Math.random(), ny: Math.random(), r: rand(0.6, 1.4), baseAlpha: rand(0.4, 0.9), speed: rand(0.015, 0.04), phase: rand(0, 6.28), color: STAR_COLORS[i % STAR_COLORS.length], layer: 1 });
    // Layer 2 – bright foreground (60)
    for (let i = 0; i < 60; i++)  out.push({ nx: Math.random(), ny: Math.random(), r: rand(1.4, 2.6), baseAlpha: rand(0.7, 1.0), speed: rand(0.03, 0.07), phase: rand(0, 6.28), color: STAR_COLORS[i % STAR_COLORS.length], layer: 2 });
    return out;
}

function buildNebulae(): Nebula[] {
    return NEBULA_CONFIGS.map((c, i) => ({
        nx: rand(0.05, 0.95), ny: rand(0.05, 0.85),
        r: rand(0.22, 0.42),   // fraction of screen width
        color: c.color, alpha: c.a,
        driftX: rand(-0.00004, 0.00004),
        driftY: rand(-0.00002, 0.00002),
        px: 0, py: 0,
    }));
}

export default function GalaxyCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let animId: number;
        let W = 0, H = 0;
        let lastW = 0, lastH = 0;

        // Build once, never re-randomize on resize (positions are normalised)
        const stars = buildStars();
        const nebulae = buildNebulae();
        const meteors: Meteor[] = [];

        // Per-layer x-drift in normalised space
        const LAYER_DRIFT = [0.00004, 0.00008, 0.00014];
        const layerDrift = [0, 0, 0];

        let lastMeteor = 0;

        const resize = () => {
            const p = canvas.parentElement;
            const nW = p ? p.clientWidth : window.innerWidth;
            const nH = p ? p.clientHeight : window.innerHeight;
            if (nW === lastW && nH === lastH) return;   // no change → skip
            canvas.width = nW; canvas.height = nH;
            lastW = nW; lastH = nH; W = nW; H = nH;
        };
        resize();
        window.addEventListener("resize", resize, { passive: true });

        const spawnMeteor = () => {
            const startX = rand(W * 0.05, W * 0.95);
            const startY = rand(-30, H * 0.25);
            const angle = rand(2.0, 2.5);
            const spd = rand(6, 14);
            meteors.push({ x: startX, y: startY, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, life: 0, maxLife: rand(45, 90), w: rand(0.8, 2) });
        };

        const draw = (ts: number) => {
            if (W === 0 || H === 0) { animId = requestAnimationFrame(draw); return; }

            // Spawn meteor every 1.5s
            if (ts - lastMeteor > 1500) { spawnMeteor(); if (Math.random() < 0.28) spawnMeteor(); lastMeteor = ts; }

            // Update normalised drift
            for (let l = 0; l < 3; l++) layerDrift[l] = (layerDrift[l] + LAYER_DRIFT[l]) % 1;

            ctx.clearRect(0, 0, W, H);

            // 1. Deep space gradient bg
            const bg = ctx.createLinearGradient(0, 0, 0, H);
            bg.addColorStop(0, "#01020b");
            bg.addColorStop(0.5, "#02040f");
            bg.addColorStop(1, "#000108");
            ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

            // 2. Nebulae (drifting, normalised coords)
            nebulae.forEach((n, i) => {
                n.nx = (n.nx + n.driftX + 1) % 1;
                n.ny = (n.ny + n.driftY + 1) % 1;
                const px = n.nx * W, py = n.ny * H, pr = n.r * W;
                const pulse = 0.75 + 0.25 * Math.sin(ts * 0.0004 + i * 1.8);
                const g = ctx.createRadialGradient(px, py, 0, px, py, pr);
                g.addColorStop(0, n.color + (n.alpha * pulse).toFixed(3) + ")");
                g.addColorStop(0.55, n.color + (n.alpha * 0.3 * pulse).toFixed(3) + ")");
                g.addColorStop(1, n.color + "0)");
                ctx.fillStyle = g;
                ctx.beginPath(); ctx.arc(px, py, pr, 0, 6.28); ctx.fill();
            });

            // 3. Stars — normalised positions, parallax via layerDrift
            stars.forEach(s => {
                s.phase += s.speed * 0.016;   // frame-rate-independent enough
                const twinkle = 0.45 + 0.55 * Math.sin(s.phase);
                const a = s.baseAlpha * (0.3 + 0.7 * twinkle);
                const drift = layerDrift[s.layer] * (s.layer === 0 ? 0.3 : s.layer === 1 ? 0.65 : 1.0);
                const px = ((s.nx + drift) % 1) * W;
                const py = s.ny * H;

                ctx.globalAlpha = a;
                ctx.fillStyle = s.color;
                ctx.beginPath(); ctx.arc(px, py, s.r, 0, 6.28); ctx.fill();

                // Sparkle cross for brightest stars
                if (s.layer === 2 && twinkle > 0.85) {
                    ctx.globalAlpha = (twinkle - 0.85) * a * 4;
                    ctx.strokeStyle = s.color; ctx.lineWidth = 0.5;
                    const sl = s.r * 5;
                    ctx.beginPath(); ctx.moveTo(px - sl, py); ctx.lineTo(px + sl, py); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(px, py - sl); ctx.lineTo(px, py + sl); ctx.stroke();
                }
            });
            ctx.globalAlpha = 1;

            // 4. Meteors
            for (let i = meteors.length - 1; i >= 0; i--) {
                const m = meteors[i];
                m.x += m.vx; m.y += m.vy; m.life++;
                if (m.life >= m.maxLife || m.x < -100 || m.y > H + 100) { meteors.splice(i, 1); continue; }
                const p = m.life / m.maxLife;
                const a = (1 - p) * 0.9;
                const tLen = m.vx * -10, tLenY = m.vy * -10;
                const g = ctx.createLinearGradient(m.x, m.y, m.x + tLen * 3.5, m.y + tLenY * 3.5);
                g.addColorStop(0, `rgba(255,255,255,${a.toFixed(2)})`);
                g.addColorStop(0.4, `rgba(180,200,255,${(a * 0.5).toFixed(2)})`);
                g.addColorStop(1, "rgba(80,100,255,0)");
                ctx.save();
                ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x + tLen * 3.5, m.y + tLenY * 3.5);
                ctx.strokeStyle = g; ctx.lineWidth = m.w * (1 - p * 0.5); ctx.lineCap = "round"; ctx.stroke();
                ctx.beginPath(); ctx.arc(m.x, m.y, m.w, 0, 6.28);
                ctx.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`; ctx.fill();
                ctx.restore();
            }

            animId = requestAnimationFrame(draw);
        };

        animId = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}
