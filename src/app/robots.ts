import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/** /robots.txt — everything is crawlable except the API; points to the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
