"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

function openWaitlist() {
    window.dispatchEvent(new CustomEvent("open-waitlist"));
}

const NAV_LINKS = [
    { label: "Solution", href: "/how-it-works" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Product", href: "/product" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close menu on route change
    useEffect(() => { setMenuOpen(false); }, [pathname]);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass-nav py-3" : "py-5"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

                    {/* ── Logo → home ───────────────────────────────────────────── */}
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="Neural Orbit Home">
                        <Image
                            src="/neuralorbit.svg"
                            alt="Neural Orbit"
                            width={160}
                            height={48}
                            priority
                            className="h-10 sm:h-12 w-auto"
                            style={{ filter: "brightness(0) invert(1)" }}
                        />
                    </Link>

                    {/* ── Desktop nav ──────────────────────────────────────────── */}
                    <div className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map(({ label, href }) => (
                            <Link
                                key={label}
                                href={href}
                                className={`text-sm transition-colors duration-200 ${pathname === href ? "text-blue-400" : "text-slate-500 hover:text-slate-200"
                                    }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* ── Desktop CTA ──────────────────────────────────────────── */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/demo"
                            className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                            id="nav-founder-demo"
                        >
                            Founder Demo
                        </Link>
                        <button
                            onClick={openWaitlist}
                            id="nav-join-cta"
                            className="btn-primary text-sm px-5 py-2"
                        >
                            Join Early Access
                        </button>
                    </div>

                    {/* ── Mobile: Join CTA + Hamburger ─────────────────────────── */}
                    <div className="flex md:hidden items-center gap-2">
                        <button
                            onClick={openWaitlist}
                            className="btn-primary text-xs px-4 py-2"
                        >
                            Join Access
                        </button>
                        <button
                            onClick={() => setMenuOpen(o => !o)}
                            aria-label="Toggle menu"
                            className="ml-1 p-2 text-slate-400 hover:text-white transition-colors"
                        >
                            {menuOpen ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>

                </div>
            </nav>

            {/* ── Mobile drawer ─────────────────────────────────────────────── */}
            <div
                className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                style={{ background: "rgba(0,0,8,0.95)", backdropFilter: "blur(20px)" }}
                onClick={() => setMenuOpen(false)}
            >
                <div
                    className="absolute top-20 left-4 right-4 rounded-2xl overflow-hidden"
                    style={{
                        background: "rgba(5,10,28,0.98)",
                        border: "1px solid rgba(41,98,255,0.2)",
                        boxShadow: "0 0 40px rgba(41,98,255,0.1)",
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Top glow line */}
                    <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(41,98,255,0.5),transparent)" }} />

                    <div className="p-6 space-y-1">
                        {NAV_LINKS.map(({ label, href }) => (
                            <Link
                                key={label}
                                href={href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === href
                                    ? "text-blue-400 bg-blue-500/10"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                    style={{ background: pathname === href ? "#2962FF" : "rgba(41,98,255,0.35)" }} />
                                {label}
                            </Link>
                        ))}

                        <div className="pt-2 border-t border-white/5 mt-2 space-y-2">
                            <Link
                                href="/demo"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/30 flex-shrink-0" />
                                Founder Demo
                            </Link>
                            <button
                                onClick={() => { setMenuOpen(false); openWaitlist(); }}
                                className="w-full px-4 py-3 rounded-xl text-sm font-bold text-white text-left"
                                style={{ background: "linear-gradient(135deg,#1a3a8f,#2962FF)" }}
                            >
                                Join Early Access →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
