import LightRays from "@/components/motion/LightRays";
import WordReveal from "@/components/motion/WordReveal";
import Badge from "@/components/ui/Badge";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { SealCheckIcon } from "@/components/ui/icons";
import styles from "./CtaSection.module.css";

export interface CtaContent {
  badge: string;
  /** two-line heading; the second line is dimmed */
  title: [string, string];
  text: string;
  button: string;
  href: string;
}

/** Closing call-to-action card with animated light rays. */
export default function CtaSection({ content }: { content: CtaContent }) {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <img className={styles.dots} src="/images/1xOqMa4sAAwBCrdkiSJfIXups.webp" width={5071} height={3425} alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <LightRays className={styles.rays} position={50} reach={30} fallbackImage="/images/glow/glow-cta.webp" />
        <div className={styles.content}>
          <Badge label={content.badge} icon={<SealCheckIcon />} />
          <div className={styles.title}>
            <WordReveal as="h2" text={content.title[0]} />
            <WordReveal as="h2" text={content.title[1]} delay={0.2} className={styles.dim} />
          </div>
          <p className={styles.text}>{content.text}</p>
          <PrimaryButton href={content.href}>{content.button}</PrimaryButton>
        </div>
      </div>
    </section>
  );
}
