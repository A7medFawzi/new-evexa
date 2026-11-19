import type { ReactNode } from "react";
import Appear from "@/components/motion/Appear";
import WordReveal from "@/components/motion/WordReveal";
import Badge from "@/components/ui/Badge";
import PrimaryButton from "@/components/ui/PrimaryButton";
import styles from "./PageHero.module.css";

export interface PageHeroContent {
  badgeChip: string;
  badge: string;
  /** two-line headline */
  title: [string, string];
  intro: string;
  button: { label: string; href: string };
}

/**
 * Inner-page hero: badge, two-line gradient headline, intro and button
 * over a blue glow, followed by a large card (`children`).
 * Entrance: badge 0.2s → line 1 0.5s → line 2 0.7s → card 1.0s → button 1.1s.
 */
export default function PageHero({
  content,
  size = "lg",
  introReveal = false,
  flush = false,
  cardGap = 70,
  cardGapPhone,
  cardRotateX,
  children,
}: {
  content: PageHeroContent;
  /** headline size on desktop: lg = 86px, md = 80px */
  size?: "lg" | "md";
  /** reveal the intro word by word */
  introReveal?: boolean;
  /** no space below the card */
  flush?: boolean;
  /** space between the button and the card (px); phones may differ */
  cardGap?: number;
  cardGapPhone?: number;
  /** card flips up from this angle on entrance */
  cardRotateX?: number;
  children: ReactNode;
}) {
  const heroClass = [styles.hero, flush && styles.flush, size === "md" && styles.md].filter(Boolean).join(" ");

  return (
    <section
      className={heroClass}
      style={{ "--card-gap": `${cardGap}px`, "--card-gap-phone": `${cardGapPhone ?? cardGap}px` } as React.CSSProperties}
    >
      <div className={styles.spacer} />
      <div className={styles.container}>
        <div className={styles.glow} aria-hidden="true">
          <div className={styles.vignette} />
        </div>
        <div className={styles.glowFade} aria-hidden="true" />

        <div className={styles.top}>
          <div className={styles.text}>
            <div className={styles.tagAndTitle}>
              <Appear delay={0.2}>
                <Badge chip={content.badgeChip} label={content.badge} />
              </Appear>
              <h1 className={styles.title}>
                <Appear as="span" delay={0.5} className={styles.titleLine}>
                  <span>{content.title[0]}</span>
                </Appear>
                <Appear as="span" delay={0.7} className={styles.titleLine}>
                  <span>{content.title[1]}</span>
                </Appear>
              </h1>
            </div>
            {introReveal ? (
              <WordReveal as="p" text={content.intro} className={styles.intro} />
            ) : (
              <p className={styles.intro}>{content.intro}</p>
            )}
          </div>
          <Appear delay={1.1} className={styles.buttons}>
            <PrimaryButton href={content.button.href}>{content.button.label}</PrimaryButton>
          </Appear>
        </div>

        <Appear delay={1.0} rotateX={cardRotateX} className={styles.bottom}>
          {children}
        </Appear>
      </div>
    </section>
  );
}
