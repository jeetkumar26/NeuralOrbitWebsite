"use client";
import { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Point3D { x: number; y: number; z: number }
interface Marker { lat: number; lng: number; label: string }
interface Arc { from: Marker; to: Marker; progress: number; speed: number; color: string }
interface Particle { arc: Arc; t: number; speed: number }

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const DEG = Math.PI / 180;

function latLngToXYZ(lat: number, lng: number, r: number): Point3D {
    const phi = (90 - lat) * DEG;
    const theta = (lng + 180) * DEG;
    return {
        x: -r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.cos(phi),
        z: r * Math.sin(phi) * Math.sin(theta),
    };
}

function rotateY(p: Point3D, angle: number): Point3D {
    return {
        x: p.x * Math.cos(angle) + p.z * Math.sin(angle),
        y: p.y,
        z: -p.x * Math.sin(angle) + p.z * Math.cos(angle),
    };
}

function rotateX(p: Point3D, angle: number): Point3D {
    return {
        x: p.x,
        y: p.y * Math.cos(angle) - p.z * Math.sin(angle),
        z: p.y * Math.sin(angle) + p.z * Math.cos(angle),
    };
}

function lerp3(a: Point3D, b: Point3D, t: number): Point3D {
    const len = Math.sqrt(
        (b.x - a.x) ** 2 + (b.y - a.y) ** 2 + (b.z - a.z) ** 2
    );
    // Spherical linear interpolation (slerp-like via midpoint elevation)
    const mid = {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2 + len * 0.4,
        z: (a.z + b.z) / 2,
    };
    if (t < 0.5) {
        const tt = t * 2;
        return {
            x: a.x * (1 - tt) + mid.x * tt,
            y: a.y * (1 - tt) + mid.y * tt,
            z: a.z * (1 - tt) + mid.z * tt,
        };
    } else {
        const tt = (t - 0.5) * 2;
        return {
            x: mid.x * (1 - tt) + b.x * tt,
            y: mid.y * (1 - tt) + b.y * tt,
            z: mid.z * (1 - tt) + b.z * tt,
        };
    }
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MARKERS: Marker[] = [
    { lat: 40.7128, lng: -74.006, label: "New York" },
    { lat: 51.5074, lng: -0.1278, label: "London" },
    { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
    { lat: -33.8688, lng: 151.2093, label: "Sydney" },
    { lat: 28.6139, lng: 77.209, label: "Delhi" },
    { lat: 1.3521, lng: 103.8198, label: "Singapore" },
    { lat: 48.8566, lng: 2.3522, label: "Paris" },
    { lat: 55.7558, lng: 37.6173, label: "Moscow" },
    { lat: -23.5505, lng: -46.6333, label: "São Paulo" },
    { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
    { lat: 25.2048, lng: 55.2708, label: "Dubai" },
    { lat: 22.3193, lng: 114.1694, label: "Hong Kong" },
];

const ARC_COLORS = ["#4D7AFF", "#2962FF", "#6B9FFF", "#3B82F6"];

function makeArcs(): Arc[] {
    const arcs: Arc[] = [];
    const pairs = [
        [0, 1], [1, 6], [0, 9], [2, 11], [3, 5], [4, 5],
        [7, 6], [8, 0], [10, 5], [11, 2], [9, 10], [1, 4],
    ];
    for (const [a, b] of pairs) {
        arcs.push({
            from: MARKERS[a],
            to: MARKERS[b],
            progress: Math.random(),
            speed: 0.0008 + Math.random() * 0.0006,
            color: ARC_COLORS[Math.floor(Math.random() * ARC_COLORS.length)],
        });
    }
    return arcs;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function GlobeCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        let rotY = 0;     // auto rotation angle
        let rotX = 0.3;   // slight tilt
        let isDragging = false;
        let lastX = 0;
        let lastY = 0;
        let velX = 0;
        let velY = 0;

        // Globe radius — responsive
        const getR = () => Math.min(canvas.width, canvas.height) * 0.36;

        const resize = () => {
            const container = canvas.parentElement;
            canvas.width = container ? container.clientWidth : window.innerWidth;
            canvas.height = container ? container.clientHeight : window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Fibonacci sphere dots
        const N = 1200;
        const fibDots: Point3D[] = [];
        const golden = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < N; i++) {
            const y = 1 - (i / (N - 1)) * 2;
            const r = Math.sqrt(1 - y * y);
            const theta = golden * i;
            fibDots.push({ x: r * Math.cos(theta), y, z: r * Math.sin(theta) });
        }

        const arcs = makeArcs();

        // ---------------------------------------------------------------------------
        // Draw frame
        // ---------------------------------------------------------------------------
        const draw = () => {
            const W = canvas.width;
            const H = canvas.height;
            const cx = W / 2;
            const cy = H / 2;
            const R = getR();

            ctx.clearRect(0, 0, W, H);

            // Auto rotate + damping
            if (!isDragging) {
                rotY += 0.0015;
                velX *= 0.92;
                velY *= 0.92;
                rotX += velY * 0.004;
                rotY += velX * 0.004;
            }
            // Clamp tilt
            rotX = Math.max(-0.6, Math.min(0.6, rotX));

            // ── Fibonacci dots ────────────────────────────────────────────
            const dots2D: Array<{ sx: number; sy: number; z: number }> = [];
            for (const d of fibDots) {
                let p = { x: d.x * R, y: d.y * R, z: d.z * R };
                p = rotateX(p, rotX);
                p = rotateY(p, rotY);
                const persp = 1400 / (1400 + p.z);
                const sx = cx + p.x * persp;
                const sy = cy + p.y * persp;
                const visible = p.z < 0; // front hemisphere
                const alpha = visible
                    ? 0.05 + 0.45 * ((R - p.z) / (2 * R))
                    : 0.015 + 0.035 * ((R + p.z) / (2 * R));
                const radius = visible ? 1.2 * persp : 0.5;
                ctx.beginPath();
                ctx.arc(sx, sy, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(41,98,255,${alpha.toFixed(3)})`;
                ctx.fill();
                if (visible) dots2D.push({ sx, sy, z: p.z });
            }

            // ── Globe outline glow ─────────────────────────────────────────
            const glowGrad = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.1);
            glowGrad.addColorStop(0, "rgba(41,98,255,0)");
            glowGrad.addColorStop(0.6, "rgba(41,98,255,0.04)");
            glowGrad.addColorStop(1, "rgba(41,98,255,0.18)");
            ctx.beginPath();
            ctx.arc(cx, cy, R * 1.08, 0, Math.PI * 2);
            ctx.fillStyle = glowGrad;
            ctx.fill();

            // Thin circle outline
            ctx.beginPath();
            ctx.arc(cx, cy, R, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(41,98,255,0.12)";
            ctx.lineWidth = 1;
            ctx.stroke();

            // ── Arcs ──────────────────────────────────────────────────────
            for (const arc of arcs) {
                arc.progress += arc.speed;
                if (arc.progress > 1) arc.progress = 0;

                const fromXYZ = latLngToXYZ(arc.from.lat, arc.from.lng, R);
                const toXYZ = latLngToXYZ(arc.to.lat, arc.to.lng, R);

                // Build arc path (sample 40 points)
                const steps = 40;
                const pathPoints: Array<{ sx: number; sy: number; z: number }> = [];
                for (let i = 0; i <= steps; i++) {
                    let p = lerp3(fromXYZ, toXYZ, i / steps);
                    p = rotateX(p, rotX);
                    p = rotateY(p, rotY);
                    const persp = 1400 / (1400 + p.z);
                    pathPoints.push({ sx: cx + p.x * persp, sy: cy + p.y * persp, z: p.z });
                }

                // Only draw if at least mid-point is on front
                const midP = pathPoints[Math.floor(steps / 2)];
                if (midP.z > R * 0.5) continue; // behind globe

                // Draw arc line, fading across the path
                for (let i = 0; i < steps; i++) {
                    const a = pathPoints[i];
                    const b = pathPoints[i + 1];
                    const segT = i / steps;
                    // Fade: bright in trailing window behind particle
                    const dist = Math.abs(segT - arc.progress);
                    const wrappedDist = Math.min(dist, 1 - dist);
                    const alpha = Math.max(0, 0.7 - wrappedDist * 12) * 0.5;
                    if (alpha < 0.005) continue;
                    ctx.beginPath();
                    ctx.moveTo(a.sx, a.sy);
                    ctx.lineTo(b.sx, b.sy);
                    ctx.strokeStyle = arc.color.replace(")", `,${alpha.toFixed(3)})`).replace("rgb", "rgba").replace("rgba(rgba", "rgba");
                    // Handle hex colors
                    ctx.strokeStyle = hexToRgba(arc.color, alpha);
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }

                // Travelling particle
                let particleP = lerp3(fromXYZ, toXYZ, arc.progress);
                particleP = rotateX(particleP, rotX);
                particleP = rotateY(particleP, rotY);
                if (particleP.z < R * 0.6) {
                    const persp = 1400 / (1400 + particleP.z);
                    const px = cx + particleP.x * persp;
                    const py = cy + particleP.y * persp;
                    // Glowing particle
                    const pGlow = ctx.createRadialGradient(px, py, 0, px, py, 6);
                    pGlow.addColorStop(0, hexToRgba(arc.color, 1));
                    pGlow.addColorStop(0.4, hexToRgba(arc.color, 0.6));
                    pGlow.addColorStop(1, hexToRgba(arc.color, 0));
                    ctx.beginPath();
                    ctx.arc(px, py, 6, 0, Math.PI * 2);
                    ctx.fillStyle = pGlow;
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(px, py, 2, 0, Math.PI * 2);
                    ctx.fillStyle = "white";
                    ctx.fill();
                }
            }

            // ── Markers ───────────────────────────────────────────────────
            for (const marker of MARKERS) {
                let p = latLngToXYZ(marker.lat, marker.lng, R);
                p = rotateX(p, rotX);
                p = rotateY(p, rotY);
                if (p.z > R * 0.2) continue; // behind globe

                const persp = 1400 / (1400 + p.z);
                const mx = cx + p.x * persp;
                const my = cy + p.y * persp;

                // Pulsing ring
                const ringR = 5 + 3 * Math.sin(Date.now() * 0.003 + marker.lat);
                ctx.beginPath();
                ctx.arc(mx, my, ringR, 0, Math.PI * 2);
                ctx.strokeStyle = "rgba(77,122,255,0.5)";
                ctx.lineWidth = 1;
                ctx.stroke();

                // Dot
                ctx.beginPath();
                ctx.arc(mx, my, 3, 0, Math.PI * 2);
                ctx.fillStyle = "#4D7AFF";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(mx, my, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = "white";
                ctx.fill();

                // Label (only if clearly front)
                if (p.z < -R * 0.1) {
                    ctx.font = "10px Inter, sans-serif";
                    ctx.fillStyle = "rgba(148,163,184,0.7)";
                    ctx.fillText(marker.label, mx + 8, my - 5);
                }
            }

            animId = requestAnimationFrame(draw);
        };

        draw();

        // ── Drag interaction ────────────────────────────────────────────
        const onPointerDown = (e: PointerEvent) => {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            canvas.setPointerCapture(e.pointerId);
        };
        const onPointerMove = (e: PointerEvent) => {
            if (!isDragging) return;
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            velX = dx;
            velY = dy;
            rotY += dx * 0.006;
            rotX += dy * 0.006;
            lastX = e.clientX;
            lastY = e.clientY;
        };
        const onPointerUp = () => { isDragging = false; };

        canvas.addEventListener("pointerdown", onPointerDown);
        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerup", onPointerUp);
        canvas.addEventListener("pointercancel", onPointerUp);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("pointerdown", onPointerDown);
            canvas.removeEventListener("pointermove", onPointerMove);
            canvas.removeEventListener("pointerup", onPointerUp);
            canvas.removeEventListener("pointercancel", onPointerUp);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            style={{ touchAction: "none" }}
        />
    );
}

// ---------------------------------------------------------------------------
// Util: hex color → rgba string
// ---------------------------------------------------------------------------
function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}
