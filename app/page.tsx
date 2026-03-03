"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import WaitlistForm from "@/components/WaitlistForm";
import MetricCard from "@/components/MetricCard";

// Dynamic imports (SSR: false)
const BootSequence = dynamic(() => import("@/components/BootSequence"), { ssr: false });
const ThreeScene = dynamic(() => import("@/components/ThreeScene"), { ssr: false });

// ── Depth stages ────────────────────────────────────────────────────────────
// 5 scroll bands: 0 = hero, 1-4 = the 4 intelligence layers
const STAGES = [
    {
        badge: "INTELLIGENCE LAYER • NEURAL ORBIT",
        headline: ["Your Business.", <span key="s" className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">Smarter Daily.</span>],
        sub: "An AI Operating System that sits on your business. Observes. Learns. Decides. Autonomously.",
        detail: null,
        showCTA: true,
    },
    {
        badge: "01 · SIGNAL DETECTION",
        headline: ["System Is", <span key="s" className="text-blue-400"> Watching.</span>],
        sub: "Neural Orbit connects to your stack and begins mapping every signal — silent, continuous, precise.",
        detail: ["CRM data stream active", "Ad signal processing", "Revenue patterns mapped", "Ops data indexed"],
        showCTA: false,
    },
    {
        badge: "02 · PATTERN RECOGNITION",
        headline: ["Patterns", <span key="s" className="text-blue-400"> Detected.</span>],
        sub: "Hidden correlations surface. Your intelligence baseline is established. The system knows your business.",
        detail: ["142 patterns identified", "Signal accuracy: 99.1%", "3.2× faster decisions", "Zero manual analysis"],
        showCTA: false,
    },
    {
        badge: "03 · DECISION OPTIMIZATION",
        headline: ["Decisions", <span key="s" className="text-blue-400"> Improving.</span>],
        sub: "Micro-optimisations run automatically. Intelligence Score climbs. Revenue momentum follows.",
        detail: null,
        showMetrics: true,
        showCTA: false,
    },
    {
        badge: "04 · AUTONOMOUS CORE",
        headline: ["System.", <span key="s" className="text-blue-400"> Alive.</span>],
        sub: "Neural Orbit operates at full autonomy. Your business improves while you focus on what matters.",
        detail: null,
        showCTA: true,
        isFinal: true,
    },
];

// ── Holographic Waitlist Modal ───────────────────────────────────────────────
function WaitlistModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [submitted, setSubmitted] = useState(false);
    useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,5,0.88)", backdropFilter: "blur(16px)" }}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md rounded-2xl overflow-hidden"
                style={{
                    background: "linear-gradient(135deg,rgba(5,8,20,0.98),rgba(10,18,45,0.98))",
                    border: "1px solid rgba(41,98,255,0.25)",
                    boxShadow: "0 0 80px rgba(41,98,255,0.14), 0 0 2px rgba(41,98,255,0.4)",
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Top edge glow */}
                <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(41,98,255,0.6),transparent)" }} />

                <div className="p-8">
                    {/* System header */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="font-mono text-blue-400/80 text-xs tracking-[0.25em] uppercase">
                            Network Access Protocol
                        </span>
                        <button onClick={onClose} className="ml-auto text-slate-600 hover:text-white text-xl leading-none transition-colors">×</button>
                    </div>

                    {submitted ? (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
                                style={{ background: "rgba(41,98,255,0.15)", border: "1px solid rgba(41,98,255,0.3)" }}>
                                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            </div>
                            <p className="font-mono text-blue-400 text-sm mb-2">Access logged.</p>
                            <p className="font-mono text-slate-500 text-sm">Founder onboarding pending.</p>
                            <p className="text-slate-700 text-xs mt-4">You'll hear from us within 24 hours.</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-black text-white mb-1">Identity Required.</h2>
                            <p className="text-slate-500 text-sm mb-7 font-mono">For network access authorization.</p>
                            <WaitlistForm />
                            <p className="text-slate-700 text-xs mt-5 text-center">
                                Limited cohort of 50 founders. Reviewed individually.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Stage content overlay ────────────────────────────────────────────────────
function StagePanel({
    stage, visible, onOpenWaitlist
}: {
    stage: typeof STAGES[number];
    visible: boolean;
    onOpenWaitlist: () => void;
}) {
    const s = stage as typeof STAGES[number] & { showMetrics?: boolean; isFinal?: boolean };

    return (
        <div
            className="absolute inset-0 flex items-center pointer-events-none"
            style={{
                opacity: visible ? 1 : 0,
                transition: "opacity 0.65s ease",
                transform: visible ? "none" : "translateY(10px)",
            }}
        >
            <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-16 grid lg:grid-cols-2 gap-10 items-center">

                {/* Left — text */}
                <div style={{ pointerEvents: visible ? "all" : "none" }}>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5 max-w-[90vw] truncate"
                        style={{ border: "1px solid rgba(41,98,255,0.22)", background: "rgba(41,98,255,0.06)" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
                        <span className="text-blue-400 text-[10px] sm:text-xs font-mono tracking-wider truncate">{s.badge}</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.02] text-white mb-4">
                        {s.headline}
                    </h1>

                    {/* Subtext */}
                    <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-lg mb-6 pr-2">{s.sub}</p>

                    {/* Detail list */}
                    {s.detail && (
                        <div className="space-y-2 mb-6">
                            {(s.detail as string[]).map(d => (
                                <div key={d} className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                    <span className="text-slate-500 text-sm font-mono">{d}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Metrics */}
                    {s.showMetrics && (
                        <div className="grid grid-cols-2 gap-3 mb-6 max-w-sm">
                            <MetricCard label="Intelligence Score" value="94.2" change="+6.9%" positive index={0} />
                            <MetricCard label="Revenue Momentum" value="↑ 18%" change="+3.2%" positive index={1} />
                        </div>
                    )}

                    {/* Autonomous status */}
                    {s.isFinal && (
                        <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
                            style={{ background: "rgba(41,98,255,0.08)", border: "1px solid rgba(41,98,255,0.2)" }}>
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="font-mono text-green-400 text-xs tracking-widest">AUTONOMOUS MODE ACTIVE</span>
                        </div>
                    )}

                    {/* CTA buttons */}
                    {s.showCTA && (
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                            <button
                                id={s.isFinal ? "final-enter-cta" : "hero-enter-cta"}
                                onClick={onOpenWaitlist}
                                className="group relative overflow-hidden px-7 py-3.5 rounded-xl font-bold text-white text-sm sm:text-base"
                                style={{
                                    background: "linear-gradient(135deg,#1a3a8f,#2962FF)",
                                    boxShadow: "0 0 30px rgba(41,98,255,0.35)",
                                }}
                            >
                                <span className="relative z-10">
                                    {s.isFinal ? "Request Network Access →" : "Enter the Intelligence Layer"}
                                </span>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ background: "linear-gradient(135deg,#2962FF,#4D7AFF)" }} />
                            </button>
                            {!s.isFinal && (
                                <Link href="/demo" className="px-7 py-3.5 rounded-xl font-medium text-slate-400 border border-white/8 hover:border-blue-500/30 hover:text-white transition-all text-sm sm:text-base text-center">
                                    Request Demo
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Right — depth indicator (desktop only) */}
                <div className="hidden lg:flex flex-col items-end justify-center gap-4">
                    {STAGES.map((_, i) => {
                        const active = STAGES.indexOf(s) === i;
                        return (
                            <div key={i} className="flex items-center gap-3 transition-all duration-500"
                                style={{ opacity: STAGES.indexOf(s) >= i ? 1 : 0.2 }}>
                                <span className="font-mono text-xs text-slate-600 tracking-widest">
                                    {String(i).padStart(2, "0")}
                                </span>
                                <div className="h-px transition-all duration-700"
                                    style={{
                                        width: active ? 48 : 24,
                                        background: active ? "#2962FF" : "rgba(41,98,255,0.25)",
                                        boxShadow: active ? "0 0 6px rgba(41,98,255,0.8)" : "none",
                                    }} />
                                <div className="w-1.5 h-1.5 rounded-full transition-all"
                                    style={{ background: active ? "#4D7AFF" : "rgba(41,98,255,0.25)" }} />
                            </div>
                        );
                    })}
                    <div className="mt-4 text-right">
                        <span className="font-mono text-blue-500 text-xs block">DEPTH</span>
                        <span className="font-mono text-white font-bold text-2xl">
                            {String(STAGES.indexOf(s) * 200).padStart(4, "0")}m
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function Home() {
    const [booted, setBooted] = useState(false);
    const [showBoot, setShowBoot] = useState(false);
    const [activeStage, setActiveStage] = useState(0);
    const [waitlistOpen, setWaitlistOpen] = useState(false);

    // Listen for Navbar "Join Early Access" event (works across any route)
    useEffect(() => {
        const handler = () => setWaitlistOpen(true);
        window.addEventListener("open-waitlist", handler);
        return () => window.removeEventListener("open-waitlist", handler);
    }, []);

    // Boot: plays on EVERY page load / refresh
    useEffect(() => {
        setShowBoot(true);
    }, []);

    const onBootComplete = useCallback(() => {
        setShowBoot(false);
        setBooted(true);
    }, []);

    // Scroll → active stage (6 bands over 500vh)
    useEffect(() => {
        const onScroll = () => {
            const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            setActiveStage(Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length)));
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            {/* ── Boot sequence ── */}
            {showBoot && <BootSequence onComplete={onBootComplete} />}

            {/* ── Waitlist modal ── */}
            <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />

            {/* ── Scroll driver (500vh creates the scroll space) ── */}
            <div style={{ height: "500vh", background: "transparent" }} />

            {/* ── Everything fixed to viewport ── */}
            <div
                className="fixed inset-0"
                style={{ opacity: booted ? 1 : 0, transition: "opacity 0.7s ease", zIndex: 10 }}
            >
                {/* Three.js WebGL scene — behind everything, pointer-events: none */}
                <div className="absolute inset-0 z-0">
                    <ThreeScene />
                </div>

                {/* Navbar */}
                <div className="absolute top-0 left-0 right-0 z-50">
                    <Navbar />
                </div>

                {/* Vignette */}
                <div className="absolute inset-0 z-[1] pointer-events-none" style={{
                    background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, rgba(0,0,10,0.55) 100%)"
                }} />

                {/* Stage content overlays */}
                <div className="absolute inset-0 z-[5]">
                    {STAGES.map((stage, i) => (
                        <StagePanel
                            key={i}
                            stage={stage}
                            visible={activeStage === i}
                            onOpenWaitlist={() => setWaitlistOpen(true)}
                        />
                    ))}
                </div>

                {/* Left-side scroll hint */}
                <div className="absolute left-8 bottom-10 z-20 hidden lg:flex flex-col items-center gap-2"
                    style={{ opacity: 0.4 }}>
                    <div className="w-px flex-1 min-h-[48px]"
                        style={{ background: "linear-gradient(to bottom, rgba(41,98,255,0.6), transparent)" }} />
                    <span className="font-mono text-slate-700 text-[10px] writing-mode-vertical tracking-widest rotate-180"
                        style={{ writingMode: "vertical-rl" }}>
                        SCROLL TO DESCEND
                    </span>
                </div>

                {/* Bottom-right: live intelligence counter */}
                <div className="absolute right-8 bottom-8 z-20 text-right hidden lg:block">
                    <p className="font-mono text-[10px] text-slate-700 tracking-widest mb-1">INTELLIGENCE SCORE</p>
                    <p className="font-mono text-blue-400 text-2xl font-black" style={{ textShadow: "0 0 20px rgba(41,98,255,0.5)" }}>
                        {(90 + activeStage * 1.05).toFixed(1)}
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-green-400 text-xs font-mono">LIVE</span>
                    </div>
                </div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-20 z-[2] pointer-events-none"
                    style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,5,0.4))" }} />
            </div>
        </>
    );
}
