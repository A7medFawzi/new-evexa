/**
 * Site-wide configuration: supported languages, routes and navigation.
 * Single source of truth — every component that needs a route or the
 * language list reads it from here.
 */

export const LANGS = ["en", "ar"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "en";

/**
 * Public origin of the site (no trailing slash). Used for canonical URLs,
 * hreflang links, Open Graph and the sitemap. Set NEXT_PUBLIC_SITE_URL in
 * each environment; production falls back to the evexa.tech domain.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://evexa.tech").replace(/\/+$/, "");
export const SITE_NAME = "EVEXA";

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

export function dirOf(lang: Lang): "ltr" | "rtl" {
  return lang === "ar" ? "rtl" : "ltr";
}

/** Every page route of the site (without the language prefix). */
export const ROUTES = [
  "/",
  "/about",
  "/portfolio",
  "/contact",
  "/terms-conditions",
  "/privacy-policy",
  "/portfolio/albetar",
  "/portfolio/mohami-smart",
  "/portfolio/business-operations",
] as const;

export type NavKey = "home" | "about" | "portfolio" | "contact" | "faq";

/** Header navigation, in display order. */
export const NAV_ITEMS: ReadonlyArray<{ key: NavKey; href: string; desktopOnly?: boolean }> = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "portfolio", href: "/portfolio" },
  { key: "contact", href: "/contact" },
  { key: "faq", href: "/#faq", desktopOnly: true },
];

export const CONTACT_HREF = "/contact";

/** Prefix an internal href with the language: "/about" -> "/ar/about". */
export function localizeHref(href: string, lang: Lang): string {
  if (href.startsWith("/#")) return `/${lang}#${href.slice(2)}`;
  if (href === "/") return `/${lang}`;
  return `/${lang}${href}`;
}

/** Strip the language prefix from a pathname: "/ar/about" -> "/about". */
export function stripLang(pathname: string): string {
  return pathname.replace(/^\/(?:en|ar)(?=\/|$)/, "") || "/";
}

/** Which header item is active for a given pathname (FAQ is never active). */
export function activeNavKey(pathname: string): NavKey | null {
  const path = stripLang(pathname);
  if (path === "/") return "home";
  if (path === "/about") return "about";
  if (path === "/portfolio" || path.startsWith("/portfolio/")) return "portfolio";
  if (path === "/contact") return "contact";
  return null;
}
