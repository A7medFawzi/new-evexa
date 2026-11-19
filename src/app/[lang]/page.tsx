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
import HomeWork from "@/components/home/HomeWork";
import BottomBlur from "@/components/layout/BottomBlur";
import CustomCursor from "@/components/motion/CustomCursor";
import { FlameIcon } from "@/components/ui/icons";
import CtaSection from "@/components/sections/CtaSection";
import FaqSection from "@/components/sections/FaqSection";
import { localizeHref, type Lang } from "@/config/site";
import { FAQS } from "@/content/faq";
import { HOME_COPY } from "@/content/home";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const copy = HOME_COPY[lang];

  return (
    <main style={{ position: "relative", backgroundColor: "#000" }}>
      <HomeHero copy={copy.hero} lang={lang} />
      <HomeAbout copy={copy.about} lang={lang} />
      <HomeCircle copy={copy.circle} />
      <HomeFeatures copy={copy.features} />
      <HomeServices copy={copy.services} lang={lang} />
      <HomeWork copy={copy.work} lang={lang} />
      <HomeProduct copy={copy.product} />
      <ApproachSection lang={lang} content={copy.why} id="why" variant="home" badgeIcon={<FlameIcon />} />
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
