"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

const CONTACT_OPTIONS = [
    { icon: "📧", label: "Email Us", value: "hello@neuralorbit.ai", href: "mailto:hello@neuralorbit.ai" },
    { icon: "🐦", label: "Twitter / X", value: "@NeuralOrbit", href: "https://x.com/neuralOrbit" },
    { icon: "💼", label: "LinkedIn", value: "Neural Orbit", href: "https://linkedin.com" },
];

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "General Inquiry", message: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(prev => ({ ...prev, [f]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.email || !form.message) return;
        setStatus("loading");
        const { error } = await supabase.from("website_contact").insert({
            name: form.name.trim() || null,
            email: form.email.trim().toLowerCase(),
            subject: form.subject || "General Inquiry",
            message: form.message.trim(),
            status: "unread",
        });
        if (!error) setStatus("success");
        else { setErrorMsg("Something went wrong. Please try again."); setStatus("error"); }
    };

    return (
        <main className="min-h-screen bg-[#000009] overflow-x-hidden">
            <Navbar />
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(41,98,255,0.10) 0%, transparent 70%)" }} />
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-4">Get In Touch</p>
                        <h1 className="text-4xl sm:text-6xl font-black text-white mb-5">Let&apos;s Talk</h1>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto">
                            Whether you have a question, partnership idea, or just want to learn more — we&apos;re here.
                        </p>
                    </div>
                    <div className="grid lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {CONTACT_OPTIONS.map(c => (
                                <a key={c.label} href={c.href}
                                    className="glass-card rounded-2xl p-6 flex items-center gap-4 border border-white/5 hover:border-blue-500/30 transition-all duration-300 group block">
                                    <div className="text-3xl">{c.icon}</div>
                                    <div>
                                        <div className="text-slate-500 text-xs uppercase tracking-widest mb-1">{c.label}</div>
                                        <div className="text-white font-medium group-hover:text-blue-400 transition-colors">{c.value}</div>
                                    </div>
                                </a>
                            ))}
                            <div className="glass-card rounded-2xl p-6 border border-white/5">
                                <div className="text-2xl mb-3">⏱️</div>
                                <div className="text-white font-medium mb-1">Response Time</div>
                                <div className="text-slate-500 text-sm">Within 2 hours during business days (GMT+5:30).</div>
                            </div>
                        </div>
                        <div className="lg:col-span-3">
                            <div className="glass-card rounded-3xl p-8 border border-blue-500/10"
                                style={{ background: "linear-gradient(135deg,rgba(5,8,20,0.95),rgba(20,30,60,0.4))" }}>
                                {status === "success" ? (
                                    <div className="text-center py-10">
                                        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                                            style={{ background: "rgba(41,98,255,0.15)", border: "1px solid rgba(41,98,255,0.3)" }}>
                                            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-black text-white mb-3">Message sent!</h2>
                                        <p className="text-slate-400">We&apos;ll reply within 2 business hours.</p>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-slate-400 text-sm mb-2">Name</label>
                                                    <input type="text" placeholder="Your name" value={form.name} onChange={set("name")}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all" />
                                                </div>
                                                <div>
                                                    <label className="block text-slate-400 text-sm mb-2">Email *</label>
                                                    <input type="email" placeholder="you@company.com" value={form.email} onChange={set("email")} required
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-slate-400 text-sm mb-2">Subject</label>
                                                <select value={form.subject} onChange={set("subject")}
                                                    className="w-full bg-[#0F1525] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all">
                                                    <option>General Inquiry</option>
                                                    <option>Partnership</option>
                                                    <option>Press &amp; Media</option>
                                                    <option>Technical Support</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-slate-400 text-sm mb-2">Message *</label>
                                                <textarea rows={5} placeholder="Tell us what's on your mind..." value={form.message} onChange={set("message")} required
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none" />
                                            </div>
                                            {status === "error" && <p className="text-red-400 text-sm">{errorMsg}</p>}
                                            <button type="submit" disabled={status === "loading"}
                                                className="btn-primary w-full py-4 font-bold" id="contact-submit-btn">
                                                {status === "loading" ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Sending...
                                                    </span>
                                                ) : "Send Message →"}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
