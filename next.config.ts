import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // TypeScript is checked during `next build` (tsc --noEmit passes cleanly).
  reactStrictMode: false,
  devIndicators: false,
};

export default nextConfig;
