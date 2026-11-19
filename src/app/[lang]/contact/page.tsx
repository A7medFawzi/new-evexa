import ContactHero from "@/components/contact/ContactHero";
import BottomBlur from "@/components/layout/BottomBlur";
import CtaSection from "@/components/sections/CtaSection";
import FaqSection from "@/components/sections/FaqSection";
import type { Lang } from "@/config/site";
import { CONTACT_COPY } from "@/content/contact";
import { FAQS } from "@/content/faq";

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const copy = CONTACT_COPY[lang];

  return (
    <main style={{ position: "relative", backgroundColor: "#000" }}>
      <ContactHero lang={lang} copy={copy} />
      <FaqSection content={FAQS.contact[lang]} badgeLabel={copy.faqBadge} />
      <CtaSection content={{ ...copy.cta, href: "#evexa-contact-form" }} />
      <BottomBlur />
    </main>
  );
}
