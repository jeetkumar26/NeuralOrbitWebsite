import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export const metadata: Metadata = {
    title: "How Neural Orbit Works — AI Operating System",
    description: "See how Neural Orbit learns your business: Connect your stack, observe decisions, detect patterns, then operate autonomously.",
};

// ── Step data ────────────────────────────────────────────────────────────────
const STEPS = [
    {
        num: "01",
        label: "Connect Your Stack",
        headline: "Five-minute setup.\nZero rip-and-replace.",
        body: "Neural Orbit syncs to your existing tools — CRM, ad platforms, analytics, and revenue data — through native integrations. No data migration. No new workflows. Just intelligence layered on top of everything you already use.",
        bullets: ["CRM ingestion & activity sync", "Marketing channel data pull", "Revenue event tracking", "Decision history import", "Real-time ops data stream"],
        image: "/dashboard/overview.png",
        imageAlt: "Neural Orbit Intelligence Overview dashboard showing connected data sources and metrics",
        tooltips: [
            { label: "Intelligence Score", value: "94.2", pos: "top-4 right-4" },
            { label: "Revenue Momentum", value: "↑ 18%", pos: "bottom-12 left-4" },
        ],
        flip: false,
    },
    {
        num: "02",
        label: "Observe & Log Every Decision",
        headline: "Every signal.\nEvery anomaly.\nAll logged.",
        body: "Neural Orbit runs silently in the background, logging every business signal against its decision model. Nothing is guessed. Everything is measured. The Decision Log gives you full visibility into what the AI observed and why it acted.",
        bullets: ["Timestamped decision audit trail", "AI confidence score per decision", "Risk assessment at every step", "Impact % tracked against outcomes"],
        image: "/dashboard/decision-log.png",
        imageAlt: "Neural Orbit Decision Log showing AI decisions with confidence scores and impact percentages",
        tooltips: [
            { label: "AI Confidence", value: "97.3%", pos: "top-4 left-4" },
            { label: "Risk Score", value: "0.12 ↓", pos: "bottom-8 right-8" },
        ],
        flip: true,
    },
    {
        num: "03",
        label: "Detect Patterns & Build Baseline",
        headline: "142 patterns\ndetected across\n6 data channels.",
        body: "As data accumulates, Neural Orbit identifies cross-channel correlations that no human analyst could catch at speed. A dynamic intelligence baseline is built — and continuously updated as your business evolves.",
        bullets: ["Dynamic intelligence baseline", "Cross-channel signal correlation", "Anomaly detection in real time", "Pattern strength scoring"],
        image: "/dashboard/patterns.png",
        imageAlt: "Neural Orbit pattern detection network showing connected business signals and intelligence score graph",
        tooltips: [
            { label: "Patterns Found", value: "142", pos: "top-4 right-4" },
            { label: "Pattern Strength", value: "99.1%", pos: "bottom-8 left-4" },
        ],
        flip: false,
    },
    {
        num: "04",
        label: "Autonomous Optimization",
        headline: "Manual → Assisted\n→ Autonomous.",
        body: "Once AI confidence crosses your approval threshold, Neural Orbit can execute improvements automatically. You control how much autonomy the system has — from fully manual review to fully autonomous operation. You decide the level.",
        bullets: ["Configurable autonomy threshold", "Founder-approved autonomous actions", "Full audit trail of executed decisions", "One-click rollback on any action"],
        image: "/dashboard/autonomy.png",
        imageAlt: "Neural Orbit Autonomy Control dashboard showing autonomy level slider and live activity feed",
        tooltips: [
            { label: "Autonomous Actions", value: "47 this week", pos: "top-4 left-4" },
            { label: "Autonomy Level", value: "65% ↑", pos: "bottom-8 right-8" },
        ],
        flip: true,
    },
];

// ── Tooltip overlay ──────────────────────────────────────────────────────────
function Tooltip({ label, value, pos }: { label: string; value: string; pos: string }) {
    return (
        <div className={`absolute ${pos} backdrop-blur-sm rounded-lg px-3 py-2 border pointer-events-none hidden group-hover:flex items-center gap-2`}
            style={{
                background: "rgba(5,8,20,0.92)",
                border: "1px solid rgba(41,98,255,0.35)",
                boxShadow: "0 0 12px rgba(41,98,255,0.12)",
                zIndex: 20,
            }}>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
            <span className="text-slate-400 text-xs whitespace-nowrap">{label}</span>
            <span className="text-blue-400 text-xs font-bold font-mono">{value}</span>
        </div>
    );
}

// ── Step component ────────────────────────────────────────────────────────────
function Step({ step, index }: { step: typeof STEPS[number]; index: number }) {
    return (
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-20 lg:py-28
      ${index > 0 ? "border-t" : ""}`}
            style={{ borderColor: "rgba(255,255,255,0.05)" }}>

            {/* Text — flipped on even steps */}
            <div className={step.flip ? "lg:order-2" : "lg:order-1"}>
                <div className="flex items-center gap-3 mb-5">
                    <span className="font-mono text-blue-500/50 text-xs tracking-widest">{step.num}</span>
                    <div className="w-6 h-px" style={{ background: "rgba(41,98,255,0.3)" }} />
                    <span className="text-blue-400/70 text-xs font-medium tracking-widest uppercase">{step.label}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-white mb-5 leading-tight whitespace-pre-line">
                    {step.headline}
                </h2>
                <p className="text-slate-400 leading-relaxed mb-7 max-w-md">{step.body}</p>

                <ul className="space-y-2.5 mb-8">
                    {step.bullets.map(b => (
                        <li key={b} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                            <span className="text-slate-500 text-sm">{b}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Screenshot */}
            <div className={`relative group ${step.flip ? "lg:order-1" : "lg:order-2"}`}>
                {/* Glow */}
                <div className="absolute -inset-4 rounded-3xl pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(41,98,255,0.08) 0%, transparent 70%)" }} />

                {/* Frame */}
                <div className="relative rounded-2xl overflow-hidden"
                    style={{
                        border: "1px solid rgba(41,98,255,0.18)",
                        boxShadow: "0 0 40px rgba(41,98,255,0.08)",
                    }}>
                    {/* Top bar */}
                    <div className="flex items-center gap-2 px-4 py-2.5"
                        style={{ background: "rgba(5,8,20,0.95)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f56" }} />
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#27c93f" }} />
                        </div>
                        <div className="flex-1 flex justify-center">
                            <span className="font-mono text-slate-600 text-xs">NeuralOrbit / {step.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="font-mono text-green-400 text-xs">AI ACTIVE</span>
                        </div>
                    </div>

                    {/* Screenshot */}
                    <div className="relative">
                        <Image
                            src={step.image}
                            alt={step.imageAlt}
                            width={800}
                            height={500}
                            className="w-full h-auto"
                            style={{ display: "block" }}
                        />

                        {/* Hover tooltips */}
                        {step.tooltips.map(t => (
                            <Tooltip key={t.label} label={t.label} value={t.value} pos={t.pos} />
                        ))}

                        {/* Subtle hover overlay with instruction */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 pointer-events-none"
                            style={{ background: "linear-gradient(to top, rgba(5,8,20,0.6) 0%, transparent 50%)" }}>
                            <span className="text-slate-400 text-xs font-mono">hover to inspect metrics</span>
                        </div>
                    </div>
                </div>

                {/* Step number watermark */}
                <div className="absolute -right-4 -bottom-4 font-black text-8xl pointer-events-none select-none"
                    style={{ color: "rgba(41,98,255,0.04)", lineHeight: 1, zIndex: -1 }}>
                    {step.num}
                </div>
            </div>
        </div>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function HowItWorksPage() {
    return (
        <main className="min-h-screen overflow-x-hidden" style={{ background: "#000000" }}>
            <Navbar />

            {/* Hero */}
            <section className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(41,98,255,0.09) 0%, transparent 70%)"
                }} />
                <div className="max-w-3xl mx-auto relative z-10">
                    <p className="font-mono text-blue-400 text-xs tracking-widest uppercase mb-5">Product Walkthrough</p>
                    <h1 className="text-5xl sm:text-6xl font-black text-white mb-5 leading-tight">
                        How Neural Orbit<br />
                        <span className="text-transparent bg-clip-text"
                            style={{ backgroundImage: "linear-gradient(135deg,#4D7AFF,#2962FF)" }}>
                            Learns Your Business
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto mb-4">
                        This isn't automation.<br />This is intelligence training.
                    </p>
                    <p className="text-slate-600 text-sm">
                        Four stages. From connection to autonomy.
                    </p>
                </div>

                {/* Stage pills */}
                <div className="flex flex-wrap justify-center gap-3 mt-10 max-w-2xl mx-auto relative z-10">
                    {STEPS.map(s => (
                        <div key={s.num} className="flex items-center gap-2 px-4 py-2 rounded-full"
                            style={{ background: "rgba(41,98,255,0.06)", border: "1px solid rgba(41,98,255,0.15)" }}>
                            <span className="font-mono text-blue-500/50 text-xs">{s.num}</span>
                            <span className="text-slate-400 text-xs">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Steps */}
            <section className="px-6 pb-24">
                <div className="max-w-6xl mx-auto">
                    {STEPS.map((step, i) => (
                        <Step key={step.num} step={step} index={i} />
                    ))}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 px-6 text-center" style={{
                background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(41,98,255,0.08) 0%, transparent 70%)"
            }}>
                <div className="max-w-2xl mx-auto">
                    <p className="font-mono text-blue-400 text-xs tracking-widest uppercase mb-4">Ready to begin</p>
                    <h2 className="text-4xl font-black text-white mb-5">
                        Enter the Intelligence Layer.
                    </h2>
                    <p className="text-slate-500 mb-10">
                        limited cohort · 50 founding businesses · personal founder review
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/" id="hiw-enter-cta" className="px-10 py-4 rounded-xl font-bold text-white"
                            style={{
                                background: "linear-gradient(135deg,#1a3a8f,#2962FF)",
                                boxShadow: "0 0 30px rgba(41,98,255,0.3)",
                            }}>
                            Request Early Access →
                        </Link>
                        <Link href="/demo" className="px-10 py-4 rounded-xl font-medium text-slate-400 border border-white/8 hover:text-white hover:border-blue-500/30 transition-all">
                            Book a Live Demo
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
