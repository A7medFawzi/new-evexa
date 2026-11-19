import HomeAbout from "@/components/home/HomeAbout";
import HeroBackdrop from "@/components/home/HeroBackdrop";
import HomeCircle from "@/components/home/HomeCircle";
import HomeFeatures from "@/components/home/HomeFeatures";
import HomeHero from "@/components/home/HomeHero";
import HomeServices from "@/components/home/HomeServices";
import HomeWork from "@/components/home/HomeWork";
import BottomBlur from "@/components/layout/BottomBlur";
import CustomCursor from "@/components/motion/CustomCursor";
import type { Lang } from "@/config/site";
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
      {/* painted after "About" so its edge fades don't cover the arc */}
      <HeroBackdrop />
      <BottomBlur />
      <CustomCursor />
    </main>
  );
}
