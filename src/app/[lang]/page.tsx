import type { Metadata } from "next";
import { PAGE_SEO } from "@/content/seo";
import { pageMetadata } from "@/lib/seo";
import { jsonLdHtml, organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import HomeAbout from "@/components/home/HomeAbout";
import ApproachSection from "@/components/about/ApproachSection";
import HeroBackdrop from "@/components/home/HeroBackdrop";
import HomeCircle from "@/components/home/HomeCircle";
import HomeFeatures from "@/components/home/HomeFeatures";
import HomeHero from "@/components/home/HomeHero";
import HomeChallenge from "@/components/home/HomeChallenge";
import HomeIntegrations from "@/components/home/HomeIntegrations";
import HomeProcess from "@/components/home/HomeProcess";
import HomeProduct from "@/components/home/HomeProduct";
import HomeServices from "@/components/home/HomeServices";
import HomeStats from "@/components/home/HomeStats";
import HomeTrust from "@/components/home/HomeTrust";
import HomeWork from "@/components/home/HomeWork";
import BottomBlur from "@/components/layout/BottomBlur";
import CustomCursor from "@/components/motion/CustomCursor";
import { WhyIcon } from "@/components/ui/icons";
import CtaSection from "@/components/sections/CtaSection";
import FaqSection from "@/components/sections/FaqSection";
import { localizeHref, type Lang } from "@/config/site";
import { FAQS } from "@/content/faq";
import { HOME_COPY } from "@/content/home";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang as Lang;
  return pageMetadata({ lang, route: "/", ...PAGE_SEO.home[lang], absoluteTitle: true });
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const copy = HOME_COPY[lang];

  /* Organization structured data (schema.org) for search engines. */

  return (
    <main style={{ position: "relative", backgroundColor: "#000" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml([organizationJsonLd(lang), websiteJsonLd(lang)])} />
      <HomeHero copy={copy.hero} lang={lang} />
      <HomeStats stats={copy.trust.stats} />
      <HomeAbout copy={copy.about} lang={lang} />
      <HomeCircle copy={copy.circle} />
      <HomeFeatures copy={copy.features} />
      <HomeServices copy={copy.services} lang={lang} />
      <HomeWork copy={copy.work} lang={lang} />
      <HomeTrust copy={copy.trust} />
      <HomeProduct copy={copy.product} lang={lang} />
      <ApproachSection lang={lang} content={copy.why} id="why" variant="home" badgeIcon={<WhyIcon />} />
      <HomeIntegrations copy={copy.integrations} lang={lang} />
      <HomeProcess copy={copy.process} />
      <HomeChallenge copy={copy.challenge} lang={lang} />
      <FaqSection content={FAQS.home[lang]} badgeLabel={copy.faqBadge} tight />
      <CtaSection content={{ ...copy.cta, href: localizeHref(copy.cta.href, lang) }} />
      {/* painted after "About" so its edge fades don't cover the arc */}
      <HeroBackdrop />
      <BottomBlur />
      <CustomCursor />
    </main>
  );
}
