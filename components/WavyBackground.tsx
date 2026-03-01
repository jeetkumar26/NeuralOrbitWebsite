"use client";
import { useEffect, useRef } from "react";

// ─── Wavy Background (Aceternity style) ────────────────────────────────────
// Animated canvas with smooth flowing sine-wave lines, coloured with
// the Neural Orbit blue palette + warm sun accent.

interface WavyBackgroundProps {
    className?: string;
    waveColors?: string[];
    speed?: "slow" | "fast";
    waveOpacity?: number;
    blur?: number;
}

export default function WavyBackground({
    className = "",
    waveColors = ["#2962FF", "#4D7AFF", "#6B9FFF", "#1a3a8f", "#38bdf8"],
    speed = "slow",
    waveOpacity = 0.5,
    blur = 10,
}: WavyBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        let t = 0;
        const speedMul = speed === "fast" ? 0.004 : 0.0018;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const drawWave = (color: string, amplitude: number, wavelength: number, phaseOffset: number, yBase: number) => {
            ctx.beginPath();
            ctx.moveTo(0, yBase);
            for (let x = 0; x <= canvas.width + 10; x += 4) {
                const y =
                    yBase +
                    Math.sin((x / wavelength) + t + phaseOffset) * amplitude +
                    Math.sin((x / (wavelength * 0.6)) + t * 1.3 + phaseOffset) * (amplitude * 0.4);
                ctx.lineTo(x, y);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.globalAlpha = waveOpacity / waveColors.length;
            ctx.fill();
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1;

            const H = canvas.height;
            waveColors.forEach((color, i) => {
                const yBase = H * 0.45 + i * (H * 0.06);
                const amplitude = 30 + i * 8;
                const wavelength = 220 + i * 40;
                const phaseOffset = (i / waveColors.length) * Math.PI * 2;
                drawWave(color, amplitude, wavelength, phaseOffset, yBase);
            });

            ctx.globalAlpha = 1;
            t += speedMul;
            animId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", render);
        };
    }, [waveColors, speed, waveOpacity]);

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-full ${className}`}
            style={{ filter: `blur(${blur}px)` }}
        />
    );
}
