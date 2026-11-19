import type { Metadata } from "next";
import { PAGE_SEO } from "@/content/seo";
import { pageMetadata } from "@/lib/seo";
import BottomBlur from "@/components/layout/BottomBlur";
import CustomCursor from "@/components/motion/CustomCursor";
import ProjectList from "@/components/portfolio/ProjectList";
import CtaSection from "@/components/sections/CtaSection";
import FaqSection from "@/components/sections/FaqSection";
import PageHero from "@/components/sections/PageHero";
import { localizeHref, type Lang } from "@/config/site";
import { FAQS } from "@/content/faq";
import { PORTFOLIO_COPY } from "@/content/portfolio";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang as Lang;
  return pageMetadata({ lang, route: "/portfolio", ...PAGE_SEO.portfolio[lang] });
}

export default async function PortfolioPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const copy = PORTFOLIO_COPY[lang];

  return (
    <main style={{ position: "relative", backgroundColor: "#000" }}>
      <PageHero
        content={{ ...copy.hero, button: { ...copy.hero.button, href: localizeHref(copy.hero.button.href, lang) } }}
        introReveal
        cardGap={60}
        cardGapPhone={50}
      >
        <ProjectList lang={lang} projects={copy.projects} />
      </PageHero>
      <FaqSection content={FAQS.portfolio[lang]} badgeLabel={copy.faqBadge} tight />
      <CtaSection content={{ ...copy.cta, href: localizeHref(copy.cta.href, lang) }} />
      <BottomBlur />
      <CustomCursor />
    </main>
  );
}
