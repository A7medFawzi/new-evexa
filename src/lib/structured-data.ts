/**
 * schema.org structured data (JSON-LD) for search engines and AI assistants:
 * the organization, the website, FAQ pages and breadcrumbs.
 */
import { SITE_NAME, SITE_URL, localizeHref, type Lang } from "@/config/site";
import { SOCIAL_LINKS } from "@/config/social";
import { OFFICES } from "@/content/offices";
import { SITE_SEO } from "@/content/seo";

const ORG_ID = `${SITE_URL}/#organization`;

export function organizationJsonLd(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/brand/favicon-512.png`,
    image: `${SITE_URL}/images/brand/og-image.jpg`,
    description: SITE_SEO[lang].description,
    email: "info@evexa.tech",
    telephone: "+966538614050",
    address: OFFICES.map((o) => ({ "@type": "PostalAddress", ...o.postal })),
    areaServed: ["SA", "EG", "AE", "KW", "QA", "BH", "OM", "JO"],
    knowsLanguage: ["ar", "en"],
    knowsAbout: [
      "Artificial intelligence",
      "AI assistants",
      "Arabic natural language processing",
      "Document automation",
      "Retrieval-augmented generation",
      "Business analytics",
      "Systems integration",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "info@evexa.tech",
      telephone: "+966538614050",
      availableLanguage: ["Arabic", "English"],
    },
    subOrganization: { "@type": "Organization", name: "Valien", url: "https://www.valien.tech/" },
    owns: { "@type": "SoftwareApplication", name: "Dealplier", url: "https://www.dealplier.com/", applicationCategory: "BusinessApplication" },
    sameAs: SOCIAL_LINKS.filter((s) => !s.href.startsWith("https://wa.me")).map((s) => s.href),
  };
}

export function websiteJsonLd(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: lang,
    publisher: { "@id": ORG_ID },
  };
}

/** Breadcrumb trail; `items` are [name, route without language prefix]. */
export function breadcrumbJsonLd(lang: Lang, items: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, route], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${SITE_URL}${localizeHref(route, lang)}`,
    })),
  };
}

export { faqJsonLd, jsonLdHtml } from "./jsonld";
