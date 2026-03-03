"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WaitlistForm() {
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus("loading");

        const { error } = await supabase.from("website_waitlist").insert({
            email: email.trim().toLowerCase(),
            company: company.trim() || null,
            role: role.trim() || null,
            source: "waitlist_modal",
        });

        if (!error) {
            setStatus("success");
        } else if (error.code === "23505") {
            setStatus("duplicate");
        } else {
            setErrorMsg("Something went wrong. Please try again.");
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="text-center py-12 px-4 flex flex-col items-center">
                {/* Glow ring + animated check */}
                <div className="relative mb-8">
                    {/* outer pulse ring */}
                    <span className="absolute inset-0 rounded-full animate-ping"
                        style={{ background: "rgba(41,98,255,0.15)", animationDuration: "1.6s" }} />
                    <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full"
                        style={{
                            background: "linear-gradient(135deg,rgba(41,98,255,0.18),rgba(77,122,255,0.08))",
                            border: "1.5px solid rgba(41,98,255,0.4)",
                            boxShadow: "0 0 40px rgba(41,98,255,0.25)",
                        }}>
                        <svg className="w-9 h-9 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                {/* Heading */}
                <h3 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
                    You&apos;re on the list. 🚀
                </h3>
                <p className="text-blue-400 font-semibold text-base mb-5 tracking-wide uppercase text-xs">
                    Early Access Confirmed
                </p>

                {/* Divider */}
                <div className="w-12 h-px mb-6" style={{ background: "rgba(41,98,255,0.4)" }} />

                {/* Body */}
                <p className="text-slate-300 text-base max-w-xs leading-relaxed mb-2">
                    We onboard every founder <span className="text-white font-semibold">personally</span>. Our team will reach out within <span className="text-white font-semibold">2 business hours</span>.
                </p>
                <p className="text-slate-500 text-sm">
                    In the meantime, follow us on{" "}
                    <a href="https://x.com/neuralOrbit" target="_blank" rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors">
                        X&nbsp;@NeuralOrbit
                    </a>
                </p>

                {/* bottom badge */}
                <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs text-slate-400"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Submission received by Neural Orbit
                </div>
            </div>
        );
    }

    if (status === "duplicate") {
        return (
            <div className="text-center py-12 px-4 flex flex-col items-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                    style={{
                        background: "rgba(250,204,21,0.08)",
                        border: "1.5px solid rgba(250,204,21,0.3)",
                    }}>
                    <svg className="w-7 h-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Already on the list!</h3>
                <p className="text-slate-400 text-sm max-w-xs">
                    Your email is already registered. We&apos;ll be reaching out soon — keep an eye on your inbox.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg mx-auto">
            <input className="input-field" type="email" placeholder="Work email *"
                value={email} onChange={e => setEmail(e.target.value)} required
                disabled={status === "loading"} id="waitlist-email" />
            <div className="grid grid-cols-2 gap-3">
                <input className="input-field" type="text" placeholder="Company"
                    value={company} onChange={e => setCompany(e.target.value)}
                    disabled={status === "loading"} id="waitlist-company" />
                <input className="input-field" type="text" placeholder="Your role"
                    value={role} onChange={e => setRole(e.target.value)}
                    disabled={status === "loading"} id="waitlist-role" />
            </div>
            {status === "error" && <p className="text-red-400 text-sm text-center">{errorMsg}</p>}
            <button type="submit" disabled={status === "loading"}
                className="btn-primary w-full text-base relative overflow-hidden" id="waitlist-submit">
                {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                    </span>
                ) : "Get Early Access to Neural Orbit"}
            </button>
            <p className="text-center text-slate-600 text-xs">
                No credit card required. We onboard founders personally.
            </p>
        </form>
    );
}
