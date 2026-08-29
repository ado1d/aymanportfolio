import type { NextConfig } from "next";

/**
 * `output: "standalone"` is only needed for self-hosted deployments
 * (Docker / Caddy). On Vercel it must be OFF — Vercel builds its own
 * server bundle, and standalone mode skips generating the
 * `next-server.js.nft.json` file Vercel's deployment step expects,
 * which fails the build with ENOENT on Next.js 16.3+.
 */
const isVercel = !!process.env.VERCEL;

const nextConfig: NextConfig = {
  ...(isVercel ? {} : { output: "standalone" as const }),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "userpic.codeforces.org" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
