/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lint is not wired yet (roadmap); don't block production builds on it.
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Allow remote placeholder/CDN images. Tighten this in production.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
