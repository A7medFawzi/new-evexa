import WordReveal from "@/components/motion/WordReveal";
import Badge from "@/components/ui/Badge";
import PhotoCard from "@/components/ui/PhotoCard";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { GiftIcon } from "@/components/ui/icons";
import { localizeHref, type Lang } from "@/config/site";
import type { AboutCopy } from "@/content/about";
import styles from "./AboutSections.module.css";

/** "Making Information Useful. Making Work Simpler." — what EVEXA builds, beside a photo. */
export default function CapabilitiesSection({ lang, content }: { lang: Lang; content: AboutCopy["capabilities"] }) {
  return (
    <section className={`${styles.section} ${styles.capabilities}`}>
      <div className={styles.line} />
      <div className={`${styles.container} ${styles.capabilitiesContainer}`}>
        <div className={styles.column}>
          <div className={styles.top}>
            <Badge label={content.badge} icon={<GiftIcon />} />
            <div className={`${styles.title} ${styles.titleCompact}`}>
              <WordReveal as="h2" text={content.title[0]} />
              <WordReveal as="h2" text={content.title[1]} delay={0.2} className={styles.dim} />
            </div>
          </div>

          <div className={styles.points}>
            <span className={styles.divider} aria-hidden="true" />
            {content.points.map((point) => (
              <div key={point.title} className={styles.point}>
                <h4>{point.title}</h4>
                <p>{point.text}</p>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <PrimaryButton href={localizeHref(content.button.href, lang)}>{content.button.label}</PrimaryButton>
          </div>
        </div>

        <div className={styles.photo}>
          <PhotoCard src={content.image.src} alt={content.image.alt} />
        </div>
      </div>
      <div className={styles.line} />
    </section>
  );
}
