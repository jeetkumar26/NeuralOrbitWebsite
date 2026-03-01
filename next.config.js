/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Performance: compress output, optimise images
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24h
  },

  // Reduce JS bundle size: mark three.js as client-only (never SSR)
  experimental: {
    optimizePackageImports: ["three"],
  },

  // Headers: cache static assets aggressively
  async headers() {
    return [
      {
        source: "/:path*.svg",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/dashboard/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=3600" }],
      },
    ];
  },
};

module.exports = nextConfig;
