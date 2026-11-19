import type { Metadata } from "next";
import { PAGE_SEO } from "@/content/seo";
import { pageMetadata } from "@/lib/seo";
import ContactForm from "@/components/contact/ContactForm";
import BottomBlur from "@/components/layout/BottomBlur";
import CustomCursor from "@/components/motion/CustomCursor";
import CtaSection from "@/components/sections/CtaSection";
import FaqSection from "@/components/sections/FaqSection";
import PageHero from "@/components/sections/PageHero";
import GlowCard from "@/components/ui/GlowCard";
import type { Lang } from "@/config/site";
import { CONTACT_COPY } from "@/content/contact";
import { FAQS } from "@/content/faq";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang as Lang;
  return pageMetadata({ lang, route: "/contact", ...PAGE_SEO.contact[lang] });
}

const FORM_ANCHOR = "#evexa-contact-form";

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const copy = CONTACT_COPY[lang];

  return (
    <main style={{ position: "relative", backgroundColor: "#000" }}>
      <PageHero
        content={{
          badgeChip: copy.badgeChip,
          badge: copy.badge,
          title: copy.title,
          intro: copy.intro,
          button: { label: copy.button, href: FORM_ANCHOR },
        }}
      >
        <GlowCard>
          <ContactForm lang={lang} copy={copy} />
        </GlowCard>
      </PageHero>
      <FaqSection content={FAQS.contact[lang]} badgeLabel={copy.faqBadge} />
      <CtaSection content={{ ...copy.cta, href: FORM_ANCHOR }} />
      <BottomBlur />
      <CustomCursor />
    </main>
  );
}
