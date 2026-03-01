import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    950: "#050810",
                    900: "#0B0F1A",
                    800: "#111827",
                    700: "#1a2235",
                },
                blue: {
                    accent: "#2962FF",
                    glow: "#4D7AFF",
                    muted: "#1a3a8f",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            animation: {
                "fade-up": "fadeUp 0.7s ease forwards",
                "pulse-glow": "pulseGlow 2s ease-in-out infinite",
                "orbit-spin": "orbitSpin 8s linear infinite",
                "score-cycle": "scoreCycle 3s ease-in-out infinite",
                "count-up": "countUp 2s ease-out forwards",
                "slide-in": "slideIn 0.6s ease forwards",
            },
            keyframes: {
                fadeUp: {
                    "0%": { opacity: "0", transform: "translateY(30px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                pulseGlow: {
                    "0%, 100%": { boxShadow: "0 0 10px rgba(41,98,255,0.3)" },
                    "50%": { boxShadow: "0 0 30px rgba(41,98,255,0.7), 0 0 60px rgba(41,98,255,0.2)" },
                },
                orbitSpin: {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                },
                slideIn: {
                    "0%": { opacity: "0", transform: "translateX(-20px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
            },
            backgroundImage: {
                "neural-grid": "radial-gradient(circle, rgba(41,98,255,0.15) 1px, transparent 1px)",
                "glow-radial": "radial-gradient(ellipse at center, rgba(41,98,255,0.08) 0%, transparent 70%)",
            },
            backgroundSize: {
                "grid-40": "40px 40px",
            },
        },
    },
    plugins: [],
};

export default config;
