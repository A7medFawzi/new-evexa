/** JSON-LD helpers with no site data (safe to import from client components). */
import type { FaqContent } from "@/content/faq";

export function faqJsonLd(content: FaqContent) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Serialized for a <script type="application/ld+json"> tag. */
export function jsonLdHtml(data: object): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
