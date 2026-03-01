/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Static export for GitHub Pages ──────────────────────────────────
  output: "export",

  // GitHub Pages serves from /NeuralOrbitWebsite/ subdirectory
  basePath: "/NeuralOrbitWebsite",
  assetPrefix: "/NeuralOrbitWebsite/",

  // Disable image optimisation (not available in static export)
  images: {
    unoptimized: true,
  },

  // Performance
  compress: true,

  experimental: {
    optimizePackageImports: ["three"],
  },
};

module.exports = nextConfig;
