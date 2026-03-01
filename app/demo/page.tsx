"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const VALUE_PROPS = [
    { icon: "🎯", title: "Personalised", desc: "Tailored to your exact business and stack" },
    { icon: "⚡", title: "30 Minutes", desc: "Focused, no fluff, respect for your time" },
    { icon: "🔒", title: "No Commitment", desc: "Zero pressure, full transparency" },
];

export default function DemoPage() {
    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "", company: "", teamSize: "", bottleneck: "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(f => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.email) return;
        setStatus("loading");
        try {
            const res = await fetch("/api/demo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setStatus("success");
            } else {
                setErrorMsg(data.error || "Something went wrong.");
                setStatus("error");
            }
        } catch {
            setErrorMsg("Network error. Please try again.");
            setStatus("error");
        }
    };

    return (
        <main className="min-h-screen bg-[#000009] overflow-x-hidden">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center overflow-hidden">
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(41,98,255,0.12) 0%, transparent 70%)" }} />

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-sm font-medium mb-8">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    Limited Founder Access
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight max-w-4xl">
                    See Neural Orbit<br />
                    <span className="text-transparent bg-clip-text"
                        style={{ backgroundImage: "linear-gradient(135deg, #4D7AFF, #2962FF, #6B9FFF)" }}>
                        in Your Business
                    </span>
                </h1>
                <p className="text-slate-400 text-base sm:text-lg max-w-2xl mb-12 px-2">
                    Get a private 30-minute session with our founding team. We&apos;ll show you exactly how Neural Orbit would integrate with your stack and what metrics it would improve — before you commit to anything.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 max-w-3xl w-full mb-16">
                    {VALUE_PROPS.map(v => (
                        <div key={v.title} className="glass-card rounded-2xl p-6 text-left border border-white/5">
                            <div className="text-3xl mb-3">{v.icon}</div>
                            <div className="text-white font-bold mb-1">{v.title}</div>
                            <div className="text-slate-500 text-sm">{v.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Form */}
            <section className="pb-32 px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="glass-card rounded-3xl p-8 sm:p-12 border border-blue-500/10"
                        style={{ background: "linear-gradient(135deg, rgba(5,8,20,0.98), rgba(20,30,60,0.5))" }}>

                        {status === "success" ? (
                            <div className="text-center py-10">
                                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                                    style={{ background: "rgba(41,98,255,0.15)", border: "1px solid rgba(41,98,255,0.3)" }}>
                                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-black text-white mb-3">Request received.</h2>
                                <p className="text-slate-400">We&apos;ll be in touch within 2 business hours.</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-black text-white mb-2">Book Your Demo</h2>
                                <p className="text-slate-500 text-sm mb-8">We respond within 2 business hours</p>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-slate-400 text-sm mb-2">First name</label>
                                            <input type="text" placeholder="Alex" value={form.firstName} onChange={set("firstName")}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-sm mb-2">Last name</label>
                                            <input type="text" placeholder="Johnson" value={form.lastName} onChange={set("lastName")}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-2">Work email *</label>
                                        <input type="email" placeholder="alex@company.com" value={form.email} onChange={set("email")} required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-2">Company</label>
                                        <input type="text" placeholder="Acme Corp" value={form.company} onChange={set("company")}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-2">Team size</label>
                                        <select value={form.teamSize} onChange={set("teamSize")}
                                            className="w-full bg-[#0F1525] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all">
                                            <option value="">Select range</option>
                                            <option>1–10 employees</option>
                                            <option>11–50 employees</option>
                                            <option>51–200 employees</option>
                                            <option>200+ employees</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-2">What&apos;s your biggest decision-making bottleneck?</label>
                                        <textarea rows={3} placeholder="E.g. We can't tell which marketing channels are actually driving revenue..."
                                            value={form.bottleneck} onChange={set("bottleneck")}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none" />
                                    </div>

                                    {status === "error" && (
                                        <p className="text-red-400 text-sm text-center">{errorMsg}</p>
                                    )}

                                    <button type="submit" disabled={status === "loading"}
                                        className="btn-primary w-full py-4 text-base font-bold" id="demo-submit-btn">
                                        {status === "loading" ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Submitting...
                                            </span>
                                        ) : "Request My Private Demo →"}
                                    </button>
                                </form>

                                <p className="text-center text-slate-600 text-xs mt-6">
                                    By submitting you agree to our{" "}
                                    <Link href="/privacy" className="text-slate-500 hover:text-blue-400 transition-colors">Privacy Policy</Link>.
                                    We never share your data.
                                </p>
                            </>
                        )}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-slate-600 text-sm mb-6">Trusted by forward-thinking teams at</p>
                        <div className="flex justify-center gap-8 flex-wrap">
                            {["Series A SaaS", "Growth Agencies", "Enterprise Teams", "AI-First Startups"].map(l => (
                                <span key={l} className="text-slate-700 text-sm font-medium">{l}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
