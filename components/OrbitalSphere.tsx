"use client";
// OrbitalSphere — CSS-animated orbiting rings + dots
// GPU-accelerated via transform: rotate(). Smooth 60fps, no canvas needed.

export default function OrbitalSphere() {
    return (
        <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>

            {/* ── Outer glow aura ── */}
            <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(41,98,255,0.15) 0%, transparent 70%)", filter: "blur(20px)" }} />

            {/* ── Ring 1 — outermost, slow CW ── */}
            <div className="absolute rounded-full border" style={{
                width: 260, height: 260, top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                border: "1px dashed rgba(41,98,255,0.25)",
                animation: "orbit-cw 18s linear infinite",
            }}>
                {/* dot on ring 1 */}
                <span className="absolute rounded-full" style={{
                    width: 8, height: 8, top: -4, left: "50%", marginLeft: -4,
                    background: "#4D7AFF",
                    boxShadow: "0 0 8px 3px rgba(77,122,255,0.8)",
                }} />
            </div>

            {/* ── Ring 2 — mid, medium CCW ── */}
            <div className="absolute rounded-full border" style={{
                width: 196, height: 196, top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                border: "1px solid rgba(41,98,255,0.35)",
                animation: "orbit-ccw 11s linear infinite",
            }}>
                {/* dot on ring 2 */}
                <span className="absolute rounded-full" style={{
                    width: 10, height: 10, bottom: -5, right: "20%",
                    background: "#2962FF",
                    boxShadow: "0 0 12px 4px rgba(41,98,255,0.9)",
                }} />
                {/* second dot on ring 2, offset 180° */}
                <span className="absolute rounded-full" style={{
                    width: 6, height: 6, top: -3, left: "20%",
                    background: "rgba(120,160,255,0.8)",
                    boxShadow: "0 0 6px 2px rgba(120,160,255,0.6)",
                }} />
            </div>

            {/* ── Ring 3 — inner, fast CW ── */}
            <div className="absolute rounded-full border" style={{
                width: 130, height: 130, top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                border: "1px solid rgba(77,122,255,0.5)",
                animation: "orbit-cw 7s linear infinite",
            }}>
                <span className="absolute rounded-full" style={{
                    width: 7, height: 7, top: -3, right: "30%",
                    background: "#6B9FFF",
                    boxShadow: "0 0 10px 3px rgba(107,159,255,0.9)",
                }} />
            </div>

            {/* ── Core sphere ── */}
            <div className="relative z-10 rounded-full flex items-center justify-center" style={{
                width: 72, height: 72,
                background: "linear-gradient(135deg,#3a70ff 0%,#1a3aaf 60%,#0a1a60 100%)",
                boxShadow: "0 0 30px 8px rgba(41,98,255,0.5), 0 0 60px 16px rgba(41,98,255,0.18), inset 0 1px 1px rgba(255,255,255,0.25)",
                animation: "pulse-core 3s ease-in-out infinite",
            }}>
                {/* inner white dot */}
                <div className="rounded-full" style={{
                    width: 18, height: 18,
                    background: "rgba(255,255,255,0.95)",
                    boxShadow: "0 0 12px 4px rgba(255,255,255,0.6)"
                }} />
            </div>

            {/* CSS keyframes injected via style tag */}
            <style>{`
        @keyframes orbit-cw  { from{transform:translate(-50%,-50%) rotate(0deg)}   to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes orbit-ccw { from{transform:translate(-50%,-50%) rotate(0deg)}   to{transform:translate(-50%,-50%) rotate(-360deg)} }
        @keyframes pulse-core {
          0%,100%{ box-shadow:0 0 30px 8px rgba(41,98,255,0.5),0 0 60px 16px rgba(41,98,255,0.18),inset 0 1px 1px rgba(255,255,255,0.25); }
          50%    { box-shadow:0 0 45px 14px rgba(41,98,255,0.7),0 0 80px 24px rgba(41,98,255,0.28),inset 0 1px 1px rgba(255,255,255,0.25); }
        }
      `}</style>
        </div>
    );
}
