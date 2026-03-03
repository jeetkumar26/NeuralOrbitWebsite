"use client";
import { useState } from "react";

const FEATURES = [
    {
        id: "decision-log",
        label: "Decision Log",
        icon: "⚡",
        copy: "Every AI-driven decision — logged, timestamped, explainable.",
        preview: [
            { time: "09:42", action: "Reallocated budget → Paid Search", impact: "+12% ROAS", tag: "Auto" },
            { time: "08:15", action: "Flagged churn risk → Segment A", impact: "Risk reduced", tag: "Alert" },
            { time: "07:30", action: "Scaled creative rotation", impact: "+8% CTR", tag: "Auto" },
        ],
    },
    {
        id: "reward-engine",
        label: "Reward Engine",
        icon: "🎯",
        copy: "Neural Orbit learns what works and reinforces it automatically.",
        preview: [
            { time: "Reward", action: "Lead quality score improved", impact: "+0.34 pts", tag: "Learn" },
            { time: "Reward", action: "CAC lowered below threshold", impact: "-18%", tag: "Learn" },
            { time: "Signal", action: "Identified high-LTV cohort", impact: "Prioritized", tag: "Auto" },
        ],
    },
    {
        id: "learning-timeline",
        label: "Learning Timeline",
        icon: "📈",
        copy: "See how your system intelligence has grown over time.",
        preview: [
            { time: "Week 1", action: "Baseline established", impact: "Score: 71.2", tag: "Init" },
            { time: "Week 3", action: "First optimisation cycle", impact: "Score: 84.5", tag: "Learn" },
            { time: "Week 6", action: "Full autonomy unlocked", impact: "Score: 94.2", tag: "Peak" },
        ],
    },
    {
        id: "autonomy-control",
        label: "Autonomy Control",
        icon: "🛡️",
        copy: "Set the level of AI autonomy that fits your risk tolerance.",
        preview: [
            { time: "Level 1", action: "Suggest only", impact: "Human decides", tag: "Safe" },
            { time: "Level 2", action: "Auto-execute low-risk", impact: "Supervised", tag: "Balanced" },
            { time: "Level 3", action: "Full AI autonomy", impact: "Continuous", tag: "Max" },
        ],
    },
];

export default function ProductCarousel() {
    const [active, setActive] = useState(0);

    const feature = FEATURES[active];

    return (
        <div className="w-full">
            {/* Tab nav */}
            <div className="flex gap-2 justify-center flex-wrap mb-8">
                {FEATURES.map((f, i) => (
                    <button
                        key={f.id}
                        onClick={() => setActive(i)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${i === active
                                ? "bg-blue-accent text-white shadow-lg"
                                : "glass-card text-slate-400 hover:text-white hover:border-blue-accent/30"
                            }`}
                        id={`carousel-tab-${f.id}`}
                    >
                        <span className="mr-2">{f.icon}</span>
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Card */}
            <div className="glass-card rounded-2xl p-6 max-w-2xl mx-auto border border-blue-accent/10 transition-all duration-500">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <span className="text-3xl mr-3">{feature.icon}</span>
                        <span className="text-white font-bold text-xl">{feature.label}</span>
                    </div>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-accent/10 text-blue-accent border border-blue-accent/20">
                        LIVE
                    </span>
                </div>
                <p className="text-slate-400 text-sm mb-5 mt-1">{feature.copy}</p>

                {/* Mock log rows */}
                <div className="space-y-2">
                    {feature.preview.map((row, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg"
                            style={{ background: "rgba(41,98,255,0.04)", border: "1px solid rgba(41,98,255,0.08)" }}
                        >
                            <span className="text-slate-600 text-xs font-mono w-14 shrink-0">{row.time}</span>
                            <span className="text-slate-300 text-sm flex-1">{row.action}</span>
                            <span className="text-green-400 text-xs font-medium">{row.impact}</span>
                            <span
                                className="px-2 py-0.5 rounded text-xs font-medium"
                                style={{ background: "rgba(41,98,255,0.15)", color: "#4D7AFF" }}
                            >
                                {row.tag}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-5">
                {FEATURES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-blue-accent" : "w-1.5 bg-slate-700"
                            }`}
                        id={`carousel-dot-${i}`}
                    />
                ))}
            </div>
        </div>
    );
}
