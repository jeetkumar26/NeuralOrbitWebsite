/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Static export for GitHub Pages ──────────────────────────────────
  output: "export",

  // GitHub Pages serves from /NeuralOrbitWebsite/ subdirectory
  basePath: "/NeuralOrbitWebsite",
  assetPrefix: "/NeuralOrbitWebsite/",

  // Custom image loader that prepends basePath
  images: {
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
  },

  // Performance
  compress: true,

  experimental: {
    optimizePackageImports: ["three"],
  },
};

module.exports = nextConfig;
