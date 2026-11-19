import WordReveal from "@/components/motion/WordReveal";
import Badge from "@/components/ui/Badge";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { GiftIcon } from "@/components/ui/icons";
import { CIRCLE_IMAGES, type SectionIntro } from "@/content/home";
import styles from "./HomeCircle.module.css";

/**
 * A slowly turning ring of image tiles (one full turn every 50s) with the
 * "Features" heading in front of its upper half.
 */
export default function HomeCircle({ copy }: { copy: SectionIntro }) {
  return (
    <section className={styles.section}>
      <img className={styles.rays} src="/images/HQiQT243MN1itZOX771FxR6euwI.webp" alt="" aria-hidden="true" decoding="async" loading="lazy" />
      <div className={styles.wrap}>
        <div className={styles.spacer} />
        <div className={styles.circle} aria-hidden="true">
          {CIRCLE_IMAGES.map((src, i) => (
            <div key={src} className={styles.arm} style={{ transform: `rotate(${i * 15}deg)` }}>
              <Tile src={src} />
              <Tile src={src} flipped />
            </div>
          ))}
        </div>
        <div className={styles.fade} aria-hidden="true" />
      </div>

      <div className={styles.content}>
        <Badge label={copy.badge} icon={<GiftIcon />} />
        <div className={styles.text}>
          <WordReveal as="h2" text={copy.title} className={styles.title} />
          <p className={styles.body}>{copy.body}</p>
        </div>
        <PrimaryButton href={copy.button.href}>{copy.button.label}</PrimaryButton>
      </div>
    </section>
  );
}

function Tile({ src, flipped = false }: { src: string; flipped?: boolean }) {
  return (
    <div className={flipped ? `${styles.tile} ${styles.flipped}` : styles.tile}>
      <img className={styles.tileImage} src={src} alt="" loading="lazy" decoding="async" />
      <span className={styles.tileShine} />
    </div>
  );
}
