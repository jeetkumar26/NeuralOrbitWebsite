"use client";
import { useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// THREE.JS INTELLIGENCE ENVIRONMENT — PERFORMANCE-OPTIMISED
//
// Changes from v1:
//  • Device-quality scaling: mobile/tablet → 100 particles, no connections
//  • pixelRatio capped at 1.5
//  • Particle count: desktop 160, tablet 110, mobile 70
//  • Connection lines: only desktop, every 3 frames, frustum-clipped
//  • Smooth easing on camera (lerp + inertia, not raw scroll)
//  • requestAnimationFrame with delta-time cap (no spiral of death)
//  • Page-visibility pause
//  • Zero React re-renders in animation loop (all refs)
// ═══════════════════════════════════════════════════════════════════════════

function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

export default function ThreeScene() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const mount = mountRef.current;
        if (!mount) return;
        let cleanup: (() => void) | undefined;

        import("three").then((THREE) => {

            // ── Quality tier ─────────────────────────────────────────────────────
            const W0 = window.innerWidth;
            const isMobile = W0 < 640;
            const isTablet = W0 < 1024;
            const QUALITY = isMobile ? "low" : isTablet ? "mid" : "high";
            const PARTICLE_COUNT = isMobile ? 70 : isTablet ? 110 : 160;
            const DO_LINES = QUALITY === "high";
            const PR = Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.5);

            // ── Renderer ─────────────────────────────────────────────────────────
            const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: false, powerPreference: "high-performance" });
            renderer.setPixelRatio(PR);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x00000a, 1);
            mount.appendChild(renderer.domElement);

            const scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x000510, 0.0018);

            const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 2000);
            camera.position.set(0, 0, 80);

            // ── Glow sprite ──────────────────────────────────────────────────────
            const sCanvas = document.createElement("canvas");
            sCanvas.width = sCanvas.height = 48;
            const sc = sCanvas.getContext("2d")!;
            const sg = sc.createRadialGradient(24, 24, 0, 24, 24, 24);
            sg.addColorStop(0, "rgba(110,160,255,1)");
            sg.addColorStop(0.35, "rgba(41,98,255,0.65)");
            sg.addColorStop(1, "rgba(10,30,180,0)");
            sc.fillStyle = sg; sc.fillRect(0, 0, 48, 48);
            const spriteTex = new THREE.CanvasTexture(sCanvas);

            // ── Particle zones ───────────────────────────────────────────────────
            const ZONES = 4;
            const PZ = Math.floor(PARTICLE_COUNT / ZONES);
            const TOTAL = PZ * ZONES;
            const ZONE_Z = [0, -200, -400, -600];
            const SPREAD_X = 120, SPREAD_Y = 60, SPREAD_Z = 120;

            const zoneR = [0.08, 0.10, 0.16, 0.28];
            const zoneG = [0.12, 0.22, 0.38, 0.60];
            const zoneB = [0.28, 0.55, 1.00, 1.00];

            const positions = new Float32Array(TOTAL * 3);
            const pColors = new Float32Array(TOTAL * 3);
            const velocities = new Float32Array(TOTAL * 3);

            for (let i = 0; i < TOTAL; i++) {
                const z = Math.floor(i / PZ);
                positions[i * 3] = (Math.random() - 0.5) * SPREAD_X * 2;
                positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD_Y * 2;
                positions[i * 3 + 2] = ZONE_Z[z] + (Math.random() - 0.5) * SPREAD_Z;
                velocities[i * 3] = (Math.random() - 0.5) * 0.05;
                velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
                pColors[i * 3] = zoneR[z];
                pColors[i * 3 + 1] = zoneG[z];
                pColors[i * 3 + 2] = zoneB[z];
            }

            const pGeo = new THREE.BufferGeometry();
            pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
            pGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));
            const pMat = new THREE.PointsMaterial({
                size: isMobile ? 2.5 : 3.5,
                sizeAttenuation: true,
                vertexColors: true,
                transparent: true,
                opacity: 0.85,
                map: spriteTex,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });
            scene.add(new THREE.Points(pGeo, pMat));

            // ── Connection lines (desktop only) ──────────────────────────────────
            const MAX_SEGS = 800;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let lGeo: any = null;
            let linePos: Float32Array | null = null;
            if (DO_LINES) {
                linePos = new Float32Array(MAX_SEGS * 6);
                lGeo = new THREE.BufferGeometry();
                lGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3).setUsage(THREE.DynamicDrawUsage));
                const lMat = new THREE.LineBasicMaterial({
                    color: 0x2962FF,
                    transparent: true,
                    opacity: 0.14,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                });
                scene.add(new THREE.LineSegments(lGeo, lMat));
            }

            // ── Smooth scroll + mouse state ──────────────────────────────────────
            let rawScrollProgress = 0;
            let smoothProgress = 0;      // what drives camera
            let targetCamZ = 80;
            let currentCamZ = 80;
            let targetMouseX = 0, targetMouseY = 0;
            let smoothMouseX = 0, smoothMouseY = 0;

            const onScroll = () => {
                rawScrollProgress = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
            };
            const onMouseMove = (e: MouseEvent) => {
                targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
                targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            };
            const onResize = () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            };
            window.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener("mousemove", onMouseMove, { passive: true });
            window.addEventListener("resize", onResize, { passive: true });

            // ── Animation loop ────────────────────────────────────────────────────
            let animId: number;
            let frame = 0;
            let lastTime = 0;
            const CONN_SQ = 85 * 85;
            // Inertia factors
            const SCROLL_INERTIA = 0.035;   // how fast scroll drives camera
            const MOUSE_INERTIA = 0.055;   // mouse smoothing

            const onVisChange = () => {
                if (document.hidden) cancelAnimationFrame(animId);
                else { lastTime = 0; animId = requestAnimationFrame(draw); }
            };
            document.addEventListener("visibilitychange", onVisChange);

            function draw(now: number) {
                animId = requestAnimationFrame(draw);
                // Delta cap at 50ms (prevents spiral on tab return)
                const dt = Math.min((now - lastTime) || 16, 50);
                lastTime = now;
                frame++;

                // ── Smooth scroll progress (eased inertia, not raw) ──────────────
                smoothProgress += (rawScrollProgress - smoothProgress) * SCROLL_INERTIA;
                const eased = easeInOutCubic(Math.min(1, Math.max(0, smoothProgress)));

                // ── Camera target and lerp ────────────────────────────────────────
                targetCamZ = 80 - eased * 820;
                currentCamZ = lerp(currentCamZ, targetCamZ, SCROLL_INERTIA * 1.5);

                smoothMouseX = lerp(smoothMouseX, targetMouseX, MOUSE_INERTIA);
                smoothMouseY = lerp(smoothMouseY, targetMouseY, MOUSE_INERTIA);

                camera.position.z = currentCamZ;
                camera.position.x = lerp(camera.position.x, -smoothMouseX * 12, 0.045);
                camera.position.y = lerp(camera.position.y, smoothMouseY * 7, 0.045);
                camera.lookAt(0, 0, currentCamZ - 80);

                // ── Particle drift + mouse gravity ────────────────────────────────
                const pAttr = pGeo.attributes.position as { array: Float32Array; needsUpdate: boolean };
                const NEAR_Z = currentCamZ + 60;
                const FAR_Z = currentCamZ - 450;

                for (let i = 0; i < TOTAL; i++) {
                    const px = pAttr.array[i * 3];
                    const py = pAttr.array[i * 3 + 1];
                    const pz = pAttr.array[i * 3 + 2];

                    // Skip particles far from view
                    if (pz > NEAR_Z + 80 || pz < FAR_Z - 80) continue;

                    // Mouse gravity (desktop only)
                    if (!isMobile) {
                        const zDist = Math.abs(pz - currentCamZ);
                        if (zDist < 160) {
                            const inf = (1 - zDist / 160) * 0.0016;
                            velocities[i * 3] += (smoothMouseX * 50 - px) * inf;
                            velocities[i * 3 + 1] += (-smoothMouseY * 28 - py) * inf;
                        }
                    }

                    velocities[i * 3] *= 0.972;
                    velocities[i * 3 + 1] *= 0.972;

                    let nx = px + velocities[i * 3];
                    let ny = py + velocities[i * 3 + 1];

                    if (nx > SPREAD_X) nx = -SPREAD_X;
                    if (nx < -SPREAD_X) nx = SPREAD_X;
                    if (ny > SPREAD_Y) ny = -SPREAD_Y;
                    if (ny < -SPREAD_Y) ny = SPREAD_Y;

                    const zone = Math.floor(i / PZ);
                    const zC = ZONE_Z[zone];
                    if (pz > zC + SPREAD_Z * 0.5) pAttr.array[i * 3 + 2] -= 0.08;
                    if (pz < zC - SPREAD_Z * 0.5) pAttr.array[i * 3 + 2] += 0.08;
                    pAttr.array[i * 3] = nx;
                    pAttr.array[i * 3 + 1] = ny;
                }
                pAttr.needsUpdate = true;

                // ── Connection lines (desktop, every 3 frames) ────────────────────
                if (DO_LINES && lGeo && linePos && frame % 3 === 0) {
                    let si = 0;
                    for (let i = 0; i < TOTAL && si < MAX_SEGS - 1; i++) {
                        const ax = pAttr.array[i * 3], ay = pAttr.array[i * 3 + 1], az = pAttr.array[i * 3 + 2];
                        if (az > NEAR_Z || az < FAR_Z) continue;
                        for (let j = i + 1; j < TOTAL && si < MAX_SEGS - 1; j++) {
                            const bx = pAttr.array[j * 3], by = pAttr.array[j * 3 + 1], bz = pAttr.array[j * 3 + 2];
                            if (bz > NEAR_Z || bz < FAR_Z) continue;
                            const d2 = (ax - bx) * (ax - bx) + (ay - by) * (ay - by) + (az - bz) * (az - bz);
                            if (d2 < CONN_SQ) {
                                linePos[si * 6] = ax; linePos[si * 6 + 1] = ay; linePos[si * 6 + 2] = az;
                                linePos[si * 6 + 3] = bx; linePos[si * 6 + 4] = by; linePos[si * 6 + 5] = bz;
                                si++;
                            }
                        }
                    }
                    lGeo.attributes.position.needsUpdate = true;
                    lGeo.setDrawRange(0, si * 2);
                }

                renderer.render(scene, camera);
            }

            lastTime = performance.now();
            animId = requestAnimationFrame(draw);

            cleanup = () => {
                cancelAnimationFrame(animId);
                window.removeEventListener("scroll", onScroll);
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("resize", onResize);
                document.removeEventListener("visibilitychange", onVisChange);
                pGeo.dispose(); pMat.dispose(); lGeo?.dispose(); spriteTex.dispose();
                renderer.dispose();
                if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
            };
        });

        return () => cleanup?.();
    }, []);

    return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
