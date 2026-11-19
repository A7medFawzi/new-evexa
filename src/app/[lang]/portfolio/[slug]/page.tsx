import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseHero from "@/components/case-study/CaseHero";
import CaseText from "@/components/case-study/CaseText";
import MoreWork from "@/components/case-study/MoreWork";
import styles from "@/components/case-study/CaseStudy.module.css";
import BottomBlur from "@/components/layout/BottomBlur";
import Appear from "@/components/motion/Appear";
import CustomCursor from "@/components/motion/CustomCursor";
import CtaSection from "@/components/sections/CtaSection";
import FaqSection from "@/components/sections/FaqSection";
import GlowCard from "@/components/ui/GlowCard";
import TopGlow from "@/components/ui/TopGlow";
import { LANGS, localizeHref, type Lang } from "@/config/site";
import { FAQS } from "@/content/faq";
import { CASE_STUDIES, CASE_STUDY_UI, getCaseStudy } from "@/content/projects";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ lang: string; slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.flatMap((lang) => CASE_STUDIES.map((c) => ({ lang, slug: c.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const copy = study.copy[lang as Lang];
  return pageMetadata({
    lang: lang as Lang,
    route: `/portfolio/${slug}`,
    title: copy.title.join(" "),
    description: copy.intro,
  });
}

function Photo({ src, className, glow = false }: { src: string; className?: string; glow?: boolean }) {
  return (
    <GlowCard media plain={!glow} className={className}>
      <img className={styles.image} src={src} alt="" loading={glow ? "eager" : "lazy"} decoding="async" />
    </GlowCard>
  );
}

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { lang: langParam, slug } = await params;
  const lang = langParam as Lang;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const copy = study.copy[lang];
  const ui = CASE_STUDY_UI[lang];
  const [analysis, challenge, solution] = copy.blocks;
  const others = CASE_STUDIES.filter((c) => c.slug !== slug).map((c) => ({
    href: localizeHref(`/portfolio/${c.slug}`, lang),
    title: c.copy[lang].name,
    tag: c.copy[lang].cardTag,
    image: c.images.card ?? c.images.cover,
  }));

  return (
    <main style={{ position: "relative", backgroundColor: "#000" }}>
      <TopGlow />
      <section className={styles.main}>
        <div className={styles.spacer} />
        <div className={styles.container}>
          <div className={styles.story}>
            <CaseHero copy={copy} lang={lang} badge={{ chip: ui.badgeChip, label: ui.badge }} />
            <Appear delay={1.0} style={{ width: "100%" }}>
              <Photo src={study.images.cover} className={styles.cover} glow />
            </Appear>
            <CaseText block={analysis} />
            <div className={styles.pair}>
              <Photo src={study.images.pair[0]} />
              <Photo src={study.images.pair[1]} />
            </div>
            <CaseText block={challenge} />
            <Photo src={study.images.wide} className={styles.wide} />
            <CaseText block={solution} />
          </div>
          <span className={styles.separator} aria-hidden="true" />
          <MoreWork
            title={ui.moreTitle}
            button={{ label: ui.moreButton, href: localizeHref("/portfolio", lang) }}
            items={others}
          />
        </div>
      </section>
      <FaqSection content={FAQS[study.faqKey][lang]} badgeLabel={ui.faqBadge} roomy />
      <CtaSection content={{ ...copy.cta, href: localizeHref(copy.cta.href, lang) }} />
      <BottomBlur />
      <CustomCursor />
    </main>
  );
}
