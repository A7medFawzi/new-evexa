import type { Metadata } from "next";
import { PAGE_SEO } from "@/content/seo";
import { pageMetadata } from "@/lib/seo";
import ApproachSection from "@/components/about/ApproachSection";
import CapabilitiesSection from "@/components/about/CapabilitiesSection";
import BottomBlur from "@/components/layout/BottomBlur";
import CustomCursor from "@/components/motion/CustomCursor";
import AutoplayVideo from "@/components/motion/AutoplayVideo";
import CtaSection from "@/components/sections/CtaSection";
import FaqSection from "@/components/sections/FaqSection";
import PageHero from "@/components/sections/PageHero";
import GlowCard from "@/components/ui/GlowCard";
import { localizeHref, type Lang } from "@/config/site";
import { ABOUT_COPY } from "@/content/about";
import { FAQS } from "@/content/faq";
import styles from "./page.module.css";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang as Lang;
  return pageMetadata({ lang, route: "/about", ...PAGE_SEO.about[lang] });
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const copy = ABOUT_COPY[lang];

  return (
    <main style={{ position: "relative", backgroundColor: "#000" }}>
      <PageHero
        content={{ ...copy.hero, button: { ...copy.hero.button, href: localizeHref(copy.hero.button.href, lang) } }}
        size="md"
        introReveal
        flush
        cardGap={20}
        cardRotateX={30}
      >
        <GlowCard media className={styles.videoCard}>
          <AutoplayVideo src="/videos/hero-video.mp4" className={styles.video} />
        </GlowCard>
      </PageHero>
      <ApproachSection lang={lang} content={copy.approach} />
      <CapabilitiesSection lang={lang} content={copy.capabilities} />
      <FaqSection content={FAQS.about[lang]} badgeLabel={copy.faqBadge} tight />
      <CtaSection content={{ ...copy.cta, href: localizeHref(copy.cta.href, lang) }} />
      <BottomBlur />
      <CustomCursor />
    </main>
  );
}
