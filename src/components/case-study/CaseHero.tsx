import Appear from "@/components/motion/Appear";
import WordReveal from "@/components/motion/WordReveal";
import Badge from "@/components/ui/Badge";
import Pill from "@/components/ui/Pill";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { localizeHref, type Lang } from "@/config/site";
import type { CaseStudyCopy } from "@/content/projects";
import styles from "./CaseStudy.module.css";

/**
 * Case-study header: badge, headline, intro and tags on one side, the
 * project facts card on the other.
 * Entrance: badge 0.2s → headline 0.5s → tags 1.1s → facts card 1.3s.
 */
export default function CaseHero({
  copy,
  lang,
  badge,
}: {
  copy: CaseStudyCopy;
  lang: Lang;
  badge: { chip: string; label: string };
}) {
  const external = /^https?:\/\//.test(copy.button.href);

  return (
    <div className={styles.details}>
      <div className={styles.left}>
        <div className={styles.heading}>
          <div className={styles.tagAndTitle}>
            <Appear delay={0.2}>
              <Badge chip={badge.chip} label={badge.label} />
            </Appear>
            <Appear delay={0.5}>
              <h1 className={styles.title}>
                {copy.title.map((line) => (
                  <span key={line} className={styles.titleLine}>
                    <span>{line}</span>
                  </span>
                ))}
              </h1>
            </Appear>
          </div>
          <WordReveal as="p" text={copy.intro} className={styles.intro} />
        </div>
        <Appear delay={1.1} className={styles.tags}>
          {copy.tags.map((tag) => (
            <Pill key={tag}>{tag}</Pill>
          ))}
        </Appear>
      </div>

      <Appear delay={1.3} className={styles.factsCard}>
        <dl className={styles.facts}>
          {copy.facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <PrimaryButton href={external ? copy.button.href : localizeHref(copy.button.href, lang)} external={external}>
          {copy.button.label}
        </PrimaryButton>
        <span className={styles.factsGlow} aria-hidden="true" />
      </Appear>
    </div>
  );
}
