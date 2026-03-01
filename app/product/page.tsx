import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Product — Neural Orbit AI Operating System",
    description: "Explore the Neural Orbit product: Intelligence Score, Decision Log, Reward Engine, Autonomy Control, and Learning modules.",
};

const MODULES = [
    {
        id: "overview",
        num: "01",
        label: "Intelligence Overview",
        headline: "Your business intelligence, live.",
        body: "The Overview dashboard surfaces your Intelligence Score, Revenue Momentum, AI Confidence, and Risk Index — all updating in real time as Neural Orbit learns.",
        metrics: [
            { label: "Intelligence Score", value: "94.2", color: "#2962FF" },
            { label: "Revenue Momentum", value: "↑ 18%", color: "#22c55e" },
            { label: "Risk Index", value: "Low", color: "#f59e0b" },
            { label: "AI Confidence", value: "97.8%", color: "#6B9FFF" },
        ],
        image: "/dashboard/overview.png",
    },
    {
        id: "decision-log",
        num: "02",
        label: "Decision Log",
        headline: "Every decision, fully auditable.",
        body: "A timestamped log of everything Neural Orbit has observed and acted on. Impact %, risk score, and confidence are tracked for every single decision.",
        metrics: [
            { label: "Decisions Logged", value: "142", color: "#2962FF" },
            { label: "Avg Confidence", value: "96.4%", color: "#22c55e" },
            { label: "Avg Risk Score", value: "0.11", color: "#f59e0b" },
            { label: "Execution Rate", value: "88%", color: "#6B9FFF" },
        ],
        image: "/dashboard/decision-log.png",
    },
    {
        id: "patterns",
        num: "03",
        label: "Reward Engine",
        headline: "Patterns across every channel.",
        body: "The Reward Engine maps cross-channel correlations, builds your intelligence baseline, and assigns pattern strength scores to every signal.",
        metrics: [
            { label: "Patterns Found", value: "142", color: "#2962FF" },
            { label: "Pattern Strength", value: "99.1%", color: "#22c55e" },
            { label: "Channels Mapped", value: "6", color: "#f59e0b" },
            { label: "Anomalies", value: "3", color: "#6B9FFF" },
        ],
        image: "/dashboard/patterns.png",
    },
    {
        id: "autonomy",
        num: "04",
        label: "Autonomy Control",
        headline: "You set the autonomy level.",
        body: "Dial between Manual, Assisted, and Autonomous. You decide how much the system acts without review. Full audit trail on every autonomous action.",
        metrics: [
            { label: "Autonomy Level", value: "65%", color: "#2962FF" },
            { label: "Auto Actions/wk", value: "47", color: "#22c55e" },
            { label: "Pending Review", value: "8", color: "#f59e0b" },
            { label: "AI Threshold", value: "94.8%", color: "#6B9FFF" },
        ],
        image: "/dashboard/autonomy.png",
    },
];

export default function ProductPage() {
    return (
        <main className="min-h-screen overflow-x-hidden" style={{ background: "#000000" }}>
            <Navbar />

            {/* Hero */}
            <section className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(41,98,255,0.10) 0%, transparent 70%)"
                }} />
                <div className="max-w-3xl mx-auto relative z-10">
                    <p className="font-mono text-blue-400 text-xs tracking-widest uppercase mb-5">The Platform</p>
                    <h1 className="text-5xl sm:text-6xl font-black text-white mb-5 leading-tight">
                        Four Engines.<br />
                        <span className="text-transparent bg-clip-text"
                            style={{ backgroundImage: "linear-gradient(135deg,#4D7AFF,#2962FF)" }}>
                            One Intelligence Loop.
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto mb-3">
                        Intelligence Overview · Decision Log · Reward Engine · Autonomy Control
                    </p>
                    <p className="text-slate-600 text-sm">Each module feeds the next. The system continuously improves.</p>
                </div>

                {/* Module nav pills */}
                <div className="flex flex-wrap justify-center gap-3 mt-10 max-w-2xl mx-auto relative z-10">
                    {MODULES.map(m => (
                        <a
                            key={m.id}
                            href={`#${m.id}`}
                            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:border-blue-500/40"
                            style={{ background: "rgba(41,98,255,0.06)", border: "1px solid rgba(41,98,255,0.15)" }}
                        >
                            <span className="font-mono text-blue-500/50 text-xs">{m.num}</span>
                            <span className="text-slate-400 text-xs">{m.label}</span>
                        </a>
                    ))}
                </div>
            </section>

            {/* Modules */}
            <section className="px-6 pb-24">
                <div className="max-w-6xl mx-auto space-y-32">
                    {MODULES.map((mod, idx) => (
                        <div
                            key={mod.id}
                            id={mod.id}
                            className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center scroll-mt-24`}
                        >
                            {/* Text — alternates sides */}
                            <div className={idx % 2 === 1 ? "lg:order-2" : "lg:order-1"}>
                                <div className="flex items-center gap-3 mb-5">
                                    <span className="font-mono text-blue-500/50 text-xs tracking-widest">{mod.num}</span>
                                    <div className="w-6 h-px" style={{ background: "rgba(41,98,255,0.3)" }} />
                                    <span className="text-blue-400/70 text-xs font-medium tracking-widest uppercase">{mod.label}</span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-black text-white mb-5 leading-tight">
                                    {mod.headline}
                                </h2>
                                <p className="text-slate-400 leading-relaxed mb-8 max-w-md">{mod.body}</p>

                                {/* Live metric pills */}
                                <div className="grid grid-cols-2 gap-3">
                                    {mod.metrics.map(m => (
                                        <div key={m.label} className="p-4 rounded-xl"
                                            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                            <div className="text-xl font-black mb-1" style={{ color: m.color }}>{m.value}</div>
                                            <div className="text-slate-600 text-xs">{m.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Screenshot */}
                            <div className={`relative group ${idx % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                                <div className="absolute -inset-4 rounded-3xl pointer-events-none"
                                    style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(41,98,255,0.07) 0%, transparent 70%)" }} />
                                <div className="relative rounded-2xl overflow-hidden"
                                    style={{ border: "1px solid rgba(41,98,255,0.18)", boxShadow: "0 0 40px rgba(41,98,255,0.07)" }}>
                                    {/* Browser chrome */}
                                    <div className="flex items-center gap-2 px-4 py-2.5"
                                        style={{ background: "rgba(5,8,20,0.97)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f56" }} />
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#27c93f" }} />
                                        </div>
                                        <div className="flex-1 flex justify-center">
                                            <span className="font-mono text-slate-600 text-xs">NeuralOrbit / {mod.label}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                            <span className="font-mono text-green-400 text-xs">AI ACTIVE</span>
                                        </div>
                                    </div>
                                    <Image
                                        src={mod.image}
                                        alt={`Neural Orbit ${mod.label} dashboard`}
                                        width={800}
                                        height={500}
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 text-center" style={{
                background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(41,98,255,0.08) 0%, transparent 70%)"
            }}>
                <div className="max-w-xl mx-auto">
                    <h2 className="text-4xl font-black text-white mb-5">Ready to see it live?</h2>
                    <p className="text-slate-500 mb-10">Book a private 30-minute demo with the founding team.</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/demo" id="product-demo-cta"
                            className="px-10 py-4 rounded-xl font-bold text-white"
                            style={{ background: "linear-gradient(135deg,#1a3a8f,#2962FF)", boxShadow: "0 0 30px rgba(41,98,255,0.3)" }}>
                            Request Founder Demo →
                        </Link>
                        <Link href="/how-it-works"
                            className="px-10 py-4 rounded-xl font-medium text-slate-400 border border-white/8 hover:text-white hover:border-blue-500/30 transition-all">
                            See How It Works
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
