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
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-blue-accent/30 mb-6 animate-pulse-glow">
                    <svg className="w-8 h-8 text-blue-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">You&apos;re early.</h3>
                <p className="text-slate-400 text-lg">We onboard founders personally.</p>
                <p className="text-slate-500 text-sm mt-2">Expect a message from our team.</p>
            </div>
        );
    }

    if (status === "duplicate") {
        return (
            <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-white mb-3">You&apos;re already on the list.</h3>
                <p className="text-slate-400">We&apos;ll be in touch soon.</p>
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
