import type { NextConfig } from "next";
import { CASE_STUDIES } from "./src/content/projects";

const nextConfig: NextConfig = {
  output: "standalone",
  // TypeScript is checked during `next build` (tsc --noEmit passes cleanly).
  reactStrictMode: false,
  devIndicators: false,
  // 404 page for URLs outside the language layout (src/app/global-not-found.tsx)
  experimental: { globalNotFound: true },
  // case studies moved from the template slugs to the project names
  // (unprefixed URLs get their language from src/proxy.ts first)
  async redirects() {
    return CASE_STUDIES.map((c) => ({
      source: `/:lang(en|ar)/portfolio/${c.legacySlug}`,
      destination: `/:lang/portfolio/${c.slug}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
