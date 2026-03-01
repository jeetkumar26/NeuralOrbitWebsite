import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Neural Orbit — AI Operating System",
    description: "Neural Orbit is an AI Operating System that learns how your business runs and improves it automatically. Powered by OneLayer.",
    keywords: "AI operating system, business intelligence, AI automation, OneLayer, Neural Orbit",
    icons: {
        icon: [
            { url: "/favicon.svg", type: "image/svg+xml" },
        ],
        shortcut: "/favicon.svg",
        apple: "/favicon.svg",
    },
    openGraph: {
        title: "Neural Orbit — AI Operating System",
        description: "An intelligence layer for your company. Neural Orbit continuously evaluates your business and upgrades its decision-making automatically.",
        type: "website",
        siteName: "Neural Orbit",
    },
    twitter: {
        card: "summary_large_image",
        title: "Neural Orbit — AI Operating System",
        description: "An intelligence layer for your company. Powered by OneLayer.",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <head>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#000009" />
            </head>
            <body className="bg-[#000009] text-slate-200 antialiased overflow-x-hidden">
                {children}
            </body>
        </html>
    );
}
