/**
 * /llms.txt — a plain-text summary of EVEXA for AI assistants and
 * generative search engines (llmstxt.org format), built from the site's
 * own content so it stays in sync with the pages.
 */
import { SITE_URL } from "@/config/site";
import { ABOUT_COPY } from "@/content/about";
import { FAQS } from "@/content/faq";
import { OFFICES } from "@/content/offices";
import { CASE_STUDIES } from "@/content/projects";
import { SITE_SEO } from "@/content/seo";

export const dynamic = "force-static";

export function GET() {
  const about = ABOUT_COPY.en;
  const capabilities = about.capabilities.points.map((p) => `- ${p.title}: ${p.text}`).join("\n");
  const projects = CASE_STUDIES.map((c) => {
    const e = c.copy.en;
    const facts = e.facts.map((f) => `${f.label}: ${f.value}`).join("; ");
    return `- [${e.name}](${SITE_URL}/en/portfolio/${c.slug}): ${e.intro} (${facts})`;
  }).join("\n");
  const offices = OFFICES.map((o) => `- ${o.copy.en.city}, ${o.copy.en.country}: ${o.copy.en.address.replace(/\n/g, " ")}`).join("\n");
  const faq = FAQS.about.en.items.map((i) => `- ${i.question} ${i.answer}`).join("\n");

  const body = `# EVEXA

> ${SITE_SEO.en.description}

EVEXA designs, builds and integrates custom AI solutions into business systems, from defining the need to everyday operation. It works in Arabic and English with clients across the Arab world. Its software house, Valien (https://www.valien.tech/), builds business systems, platforms and digital applications. Its own product, Dealplier (https://www.dealplier.com/), is an AI sales assistant for B2B suppliers.

## What EVEXA builds
${capabilities}

## Selected projects
${projects}

## Offices
${offices}

## Contact
- Contact form: ${SITE_URL}/en/contact (Arabic: ${SITE_URL}/ar/contact)
- Email: info@evexa.tech
- WhatsApp: +966 53 861 4050
- Free discovery session; replies within two working days.

## Pages
- [Home](${SITE_URL}/en): custom AI solutions built around how a business works
- [About](${SITE_URL}/en/about): who EVEXA is and how it works
- [Our Work](${SITE_URL}/en/portfolio): selected projects
- [Contact](${SITE_URL}/en/contact): contact form and offices
- Arabic versions of every page are under ${SITE_URL}/ar

## FAQ
${faq}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
