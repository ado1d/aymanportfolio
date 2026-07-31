import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // allowedDevOrigins is auto-configured; this comment forces a server reload
  // when the Prisma client is regenerated (e.g. after adding a new model).
};

export default nextConfig;
