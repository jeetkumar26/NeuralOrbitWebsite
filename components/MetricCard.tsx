"use client";

interface Props {
    label: string;
    value: string;
    change?: string;
    positive?: boolean;
    index?: number;
}

export default function MetricCard({ label, value, change, positive = true, index = 0 }: Props) {
    const delays = [0, 100, 200, 300];
    const delay = delays[index % 4];

    return (
        <div
            className="glass-card rounded-xl p-4 animate-pulse-glow flex flex-col gap-2"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">{label}</span>
                {change && (
                    <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${positive
                                ? "text-green-400 bg-green-400/10"
                                : "text-red-400 bg-red-400/10"
                            }`}
                    >
                        {change}
                    </span>
                )}
            </div>
            <div
                className="text-2xl font-bold font-mono"
                style={{ color: "#4D7AFF", textShadow: "0 0 20px rgba(41,98,255,0.4)" }}
            >
                {value}
            </div>
            {/* Mini sparkline */}
            <svg viewBox="0 0 80 20" className="w-full h-5 opacity-40">
                <polyline
                    points={positive
                        ? "0,18 15,14 30,15 45,10 60,8 75,4"
                        : "0,4 15,8 30,7 45,12 60,14 75,18"}
                    fill="none"
                    stroke="#2962FF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}
