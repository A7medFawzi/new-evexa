import Appear from "@/components/motion/Appear";
import Marquee from "@/components/motion/Marquee";
import WordReveal from "@/components/motion/WordReveal";
import Badge from "@/components/ui/Badge";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { localizeHref, type Lang } from "@/config/site";
import { HERO_LOGOS, type HomeHeroCopy } from "@/content/home";
import styles from "./HomeHero.module.css";

/**
 * Home hero: badge, two-line headline, intro, two buttons and a strip of
 * logos, over the animated blue arc.
 * Entrance: badge 0.2s → line 1 0.5s → line 2 0.7s → buttons 1.1s → logos 1.2s.
 */
export default function HomeHero({ copy, lang }: { copy: HomeHeroCopy; lang: Lang }) {
  const href = (h: string) => (h.startsWith("#") ? h : localizeHref(h, lang));

  return (
    <>
      <section id="top" className={styles.hero}>
        <div className={styles.spacer} />
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.text}>
              <div className={styles.tagAndTitle}>
                <Appear delay={0.2}>
                  <Badge chip={copy.badgeChip} label={copy.badge} />
                </Appear>
                <h1 className={styles.title}>
                  <Appear as="span" delay={0.5} className={styles.titleLine}>
                    <span>{copy.title[0]}</span>
                  </Appear>
                  <Appear as="span" delay={0.7} className={styles.titleLine}>
                    <span>{copy.title[1]}</span>
                  </Appear>
                </h1>
              </div>
              <WordReveal as="p" text={copy.intro} className={`${styles.intro} ${styles.introWide}`} />
              <WordReveal as="p" text={copy.introPhone} className={`${styles.intro} ${styles.introPhone}`} />
            </div>
            <Appear delay={1.1} className={styles.buttons}>
              <PrimaryButton href={href(copy.primary.href)} tone="white">
                {copy.primary.label}
              </PrimaryButton>
              <PrimaryButton href={href(copy.secondary.href)} tone="grey">
                {copy.secondary.label}
              </PrimaryButton>
            </Appear>
          </div>

          <Appear delay={1.2} className={styles.logos}>
            <span className={styles.logosLine} aria-hidden="true" />
            <Marquee className={styles.logoStrip} gap={40} speed={24}>
              {[...HERO_LOGOS, ...HERO_LOGOS].map((src, i) => (
                <img key={i} className={styles.logo} src={src} width={80} height={80} alt="" decoding="async" />
              ))}
            </Marquee>
          </Appear>
        </div>
      </section>
    </>
  );
}
