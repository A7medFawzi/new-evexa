import type { Metadata } from "next";
import { DEFAULT_LANG, LANGS, SITE_NAME, SITE_URL, localizeHref, type Lang } from "@/config/site";

export const OG_IMAGE = { url: "/images/brand/og-image.jpg", width: 1200, height: 630, alt: SITE_NAME };

const OG_LOCALE: Record<Lang, string> = { en: "en_US", ar: "ar_SA" };

/** Absolute URL for a site path ("/ar/about" -> "https://evexa.tech/ar/about"). */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

/** hreflang map for a route (without language prefix), x-default -> English. */
export function languageAlternates(route: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const lang of LANGS) languages[lang] = localizeHref(route, lang);
  languages["x-default"] = localizeHref(route, DEFAULT_LANG);
  return languages;
}

/**
 * Per-page metadata: title, description, canonical URL, hreflang links,
 * Open Graph and Twitter cards. `route` is the path without the language
 * prefix ("/", "/about", "/portfolio/albetar"). `absoluteTitle` bypasses the
 * layout's "%s | EVEXA" template (used by the home page).
 */
export function pageMetadata({
  lang,
  route,
  title,
  description,
  absoluteTitle = false,
}: {
  lang: Lang;
  route: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
}): Metadata {
  const url = localizeHref(route, lang);
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: languageAlternates(route) },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url,
      title: fullTitle,
      description,
      locale: OG_LOCALE[lang],
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
