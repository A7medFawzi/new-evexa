import type { MetadataRoute } from "next";
import { LANGS, ROUTES, localizeHref } from "@/config/site";
import { absoluteUrl, languageAlternates } from "@/lib/seo";

const LEGAL = new Set<string>(["/terms-conditions", "/privacy-policy"]);

/** /sitemap.xml — every page in both languages, each with its hreflang pair. */
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap((route) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(route)).map(([lang, path]) => [lang, absoluteUrl(path)]),
    );
    return LANGS.map((lang) => ({
      url: absoluteUrl(localizeHref(route, lang)),
      changeFrequency: route === "/" ? "weekly" : "monthly",
      priority: route === "/" ? 1 : route.startsWith("/portfolio/") ? 0.7 : LEGAL.has(route) ? 0.3 : 0.8,
      alternates: { languages },
    }));
  });
}
