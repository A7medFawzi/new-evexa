import type { ReactNode } from "react";
import styles from "./GlowCard.module.css";

/**
 * Dark glass card with a blue glow above it (hero form / hero video).
 * `media` makes the inner area clip its content to the rounded corners;
 * `plain` drops the glow (same frame, no light around it).
 */
export default function GlowCard({
  children,
  media,
  plain,
  className,
}: {
  children: ReactNode;
  media?: boolean;
  plain?: boolean;
  className?: string;
}) {
  const cardClass = [styles.card, plain && styles.plain, className].filter(Boolean).join(" ");
  return (
    <div className={cardClass}>
      <div className={media ? `${styles.inner} ${styles.media}` : styles.inner}>
        {children}
        <span className={styles.innerBorder} aria-hidden="true" />
      </div>
    </div>
  );
}
