"use client";
import { useEffect, useRef } from "react";

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function lerpColor(c1: number[], c2: number[], t: number) {
    return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
}
function rgba(c: number[], a: number) {
    return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a.toFixed(3)})`;
}

// ── DEEP SPACE SUN COLOUR STOPS ────────────────────────────────────────────
// Reference: cinematic orange-red planet/sun (saifyxpro hero)
const SUN_STOPS = [
    { t: 0.00, c: [220, 50, 0] },  // deep crimson-orange at horizon
    { t: 0.10, c: [255, 90, 10] },  // fiery orange
    { t: 0.25, c: [255, 160, 30] },  // amber
    { t: 0.50, c: [255, 230, 140] },  // bright white-gold at noon
    { t: 0.75, c: [255, 150, 25] },  // amber afternoon
    { t: 0.90, c: [240, 70, 5] },  // fiery descent
    { t: 1.00, c: [180, 20, 0] },  // deep red at set
];

const SKY_RISE = [255, 80, 0];    // fire orange sky wash (sunrise side)
const SKY_NOON = [41, 98, 255];   // brand blue at noon
const SKY_SET = [160, 20, 0];    // deep crimson sky wash (sunset side)

function sampleStops(stops: { t: number; c: number[] }[], t: number) {
    for (let i = 0; i < stops.length - 1; i++) {
        if (t <= stops[i + 1].t) {
            const span = stops[i + 1].t - stops[i].t;
            const loc = span === 0 ? 0 : (t - stops[i].t) / span;
            return lerpColor(stops[i].c, stops[i + 1].c, loc);
        }
    }
    return stops[stops.length - 1].c;
}

// ── faster cycle: 20 seconds ───────────────────────────────────────────────
const CYCLE_MS = 20000;

export default function SunRiseCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;

        const resize = () => {
            const p = canvas.parentElement;
            canvas.width = p ? p.clientWidth : window.innerWidth;
            canvas.height = p ? p.clientHeight : window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const draw = (ts: number) => {
            const W = canvas.width, H = canvas.height;
            ctx.clearRect(0, 0, W, H);

            const t = (ts % CYCLE_MS) / CYCLE_MS;
            const angle = Math.PI * t;

            // Sun position (right→apex→left arc)
            const arcCX = W * .5, arcCY = H * 1.08, arcRX = W * .46, arcRY = H * .96;
            const sx = arcCX + Math.cos(angle) * arcRX;
            const sy = arcCY - Math.sin(angle) * arcRY;

            const horizonProx = 1 - Math.sin(angle);   // 1=horizon, 0=noon
            const sunC = sampleStops(SUN_STOPS, t);

            // ── Full-screen sky colour blends ──────────────────────────────────
            const riseBlend = Math.max(0, 1 - t * 2);
            const setBlend = Math.max(0, t * 2 - 1);
            const noonBlend = Math.max(0, 1 - Math.abs(t - 0.5) * 5);

            if (riseBlend > 0.001) {
                const g = ctx.createLinearGradient(W, 0, 0, 0);
                g.addColorStop(0, rgba(SKY_RISE, riseBlend * 0.35));
                g.addColorStop(0.5, rgba(SKY_RISE, riseBlend * 0.14));
                g.addColorStop(1, rgba(SKY_RISE, 0));
                ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

                const gv = ctx.createLinearGradient(0, H, 0, 0);
                gv.addColorStop(0, rgba(SKY_RISE, riseBlend * 0.5 * horizonProx));
                gv.addColorStop(0.5, rgba(SKY_RISE, riseBlend * 0.08));
                gv.addColorStop(1, rgba(SKY_RISE, 0));
                ctx.fillStyle = gv; ctx.fillRect(0, 0, W, H);
            }

            if (setBlend > 0.001) {
                const g = ctx.createLinearGradient(0, 0, W, 0);
                g.addColorStop(0, rgba(SKY_SET, setBlend * 0.35));
                g.addColorStop(0.5, rgba(SKY_SET, setBlend * 0.14));
                g.addColorStop(1, rgba(SKY_SET, 0));
                ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

                const gv = ctx.createLinearGradient(0, H, 0, 0);
                gv.addColorStop(0, rgba(SKY_SET, setBlend * 0.5 * horizonProx));
                gv.addColorStop(0.5, rgba(SKY_SET, setBlend * 0.08));
                gv.addColorStop(1, rgba(SKY_SET, 0));
                ctx.fillStyle = gv; ctx.fillRect(0, 0, W, H);
            }

            if (noonBlend > 0.001) {
                const g = ctx.createRadialGradient(W * .5, H * .1, 0, W * .5, H * .1, W * .6);
                g.addColorStop(0, rgba(SKY_NOON, noonBlend * 0.07));
                g.addColorStop(1, rgba(SKY_NOON, 0));
                ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
            }

            // ── Ground glow ────────────────────────────────────────────────────
            const gg = ctx.createRadialGradient(sx, H, 0, sx, H, W * 0.42);
            gg.addColorStop(0, rgba(sunC, horizonProx * 0.60));
            gg.addColorStop(0.4, rgba(sunC, horizonProx * 0.22));
            gg.addColorStop(1, rgba(sunC, 0));
            ctx.fillStyle = gg; ctx.fillRect(0, 0, W, H);

            // ── Outer mega glow ────────────────────────────────────────────────
            const outerR = 130 + horizonProx * 80;
            const g3 = ctx.createRadialGradient(sx, sy, 0, sx, sy, outerR);
            g3.addColorStop(0, rgba(sunC, 0.35));
            g3.addColorStop(0.4, rgba(sunC, 0.12));
            g3.addColorStop(1, rgba(sunC, 0));
            ctx.beginPath(); ctx.arc(sx, sy, outerR, 0, Math.PI * 2);
            ctx.fillStyle = g3; ctx.fill();

            // ── Mid glow ───────────────────────────────────────────────────────
            const midR = 55 + horizonProx * 22;
            const g2 = ctx.createRadialGradient(sx, sy, 0, sx, sy, midR);
            g2.addColorStop(0, rgba(sunC, 1));
            g2.addColorStop(0.5, rgba(sunC, 0.6));
            g2.addColorStop(1, rgba(sunC, 0));
            ctx.beginPath(); ctx.arc(sx, sy, midR, 0, Math.PI * 2);
            ctx.fillStyle = g2; ctx.fill();

            // ── Sun disc ───────────────────────────────────────────────────────
            const discR = 26 + horizonProx * 6;
            const noonB = Math.sin(angle);
            const discC = lerpColor(sunC, [255, 250, 220], noonB * 0.7);
            const g1 = ctx.createRadialGradient(sx, sy, 0, sx, sy, discR);
            g1.addColorStop(0, rgba([255, 255, 245], 1));
            g1.addColorStop(0.3, rgba(discC, 1));
            g1.addColorStop(0.8, rgba(sunC, 0.95));
            g1.addColorStop(1, rgba(sunC, 0));
            ctx.beginPath(); ctx.arc(sx, sy, discR, 0, Math.PI * 2);
            ctx.fillStyle = g1; ctx.fill();

            // ── Rays (horizon only) ────────────────────────────────────────────
            if (horizonProx > 0.1) {
                const ra = (horizonProx - 0.1) * 0.7;
                ctx.save(); ctx.translate(sx, sy);
                for (let i = 0; i < 16; i++) {
                    const a = (i / 16) * Math.PI * 2;
                    const rl = (70 + horizonProx * 60) * (0.6 + 0.4 * Math.sin(i * 1.9));
                    ctx.beginPath();
                    ctx.moveTo(Math.cos(a) * (discR + 3), Math.sin(a) * (discR + 3));
                    ctx.lineTo(Math.cos(a) * rl, Math.sin(a) * rl);
                    ctx.strokeStyle = rgba(sunC, ra);
                    ctx.lineWidth = 1.8; ctx.stroke();
                }
                ctx.restore();
            }

            animId = requestAnimationFrame(draw);
        };

        animId = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}
