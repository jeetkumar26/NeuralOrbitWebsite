import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Privacy Policy — Neural Orbit",
    description: "Neural Orbit's privacy policy. Learn how we handle your data with transparency and care.",
};

const sections = [
    {
        title: "Information We Collect",
        content: `When you join our waitlist or request a demo, we collect your name, email address, company name, and the information you voluntarily provide. We also collect standard usage data (pages visited, device type, browser) through privacy-respecting analytics.`,
    },
    {
        title: "How We Use Your Information",
        content: `We use your information solely to: (1) communicate with you about Neural Orbit, (2) send product updates and early-access invitations you've opted into, (3) improve our product and onboarding experience, and (4) respond to your inquiries. We never use your data for advertising.`,
    },
    {
        title: "Data Sharing",
        content: `We do not sell, rent, or trade your personal information to third parties. We may share data with trusted service providers (email delivery, analytics) under strict data-processing agreements. All sub-processors are required to maintain equivalent privacy standards.`,
    },
    {
        title: "Data Security",
        content: `All data is encrypted in transit (TLS 1.3+) and at rest (AES-256). We use Supabase for secure database management and follow industry best practices for access control, logging, and incident response.`,
    },
    {
        title: "Your Rights",
        content: `You have the right to access, correct, export, or delete your personal data at any time. To exercise these rights, email us at privacy@neuralOrbit.ai and we'll respond within 48 hours.`,
    },
    {
        title: "Cookies",
        content: `We use minimal, essential cookies required for the site to function. We do not use tracking cookies or third-party advertising cookies. Our analytics are privacy-first and do not fingerprint users.`,
    },
    {
        title: "Changes to This Policy",
        content: `We may update this policy as our product evolves. We'll notify you of material changes via email. Continued use of Neural Orbit after changes constitutes acceptance.`,
    },
    {
        title: "Contact",
        content: `For any privacy-related questions, contact our Data Controller at: privacy@neuralOrbit.ai`,
    },
];

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#0B0F1A] overflow-x-hidden">
            <Navbar />

            <section className="pt-32 pb-24 px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="mb-14">
                        <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-4">Legal</p>
                        <h1 className="text-5xl font-black text-white mb-4">Privacy Policy</h1>
                        <p className="text-slate-500">Last updated: March 2026</p>
                        <p className="text-slate-400 mt-6 text-lg leading-relaxed">
                            At Neural Orbit, privacy isn&apos;t a checkbox — it&apos;s infrastructure. This policy explains clearly and honestly what data we collect, why, and how we protect it.
                        </p>
                    </div>

                    {/* Sections */}
                    <div className="space-y-10">
                        {sections.map((s, i) => (
                            <div key={s.title} className="border-b border-white/5 pb-10 last:border-0">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <span className="text-blue-500 font-mono text-sm">{String(i + 1).padStart(2, "0")}</span>
                                    {s.title}
                                </h2>
                                <p className="text-slate-400 leading-relaxed">{s.content}</p>
                            </div>
                        ))}
                    </div>

                    {/* Footer CTA */}
                    <div className="mt-16 glass-card rounded-2xl p-8 border border-blue-500/10 text-center">
                        <p className="text-white font-bold mb-2">Questions about this policy?</p>
                        <p className="text-slate-500 text-sm mb-5">We believe in radical transparency. Reach out anytime.</p>
                        <Link href="/contact" className="btn-primary inline-block px-8 py-3">Contact Us</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
