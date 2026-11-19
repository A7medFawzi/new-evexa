import type { ReactNode } from "react";
import styles from "./GlowCard.module.css";

/**
 * Dark glass card with a blue glow above it (hero form / hero video).
 * `media` makes the inner area clip its content to the rounded corners.
 */
export default function GlowCard({ children, media, className }: { children: ReactNode; media?: boolean; className?: string }) {
  return (
    <div className={className ? `${styles.card} ${className}` : styles.card}>
      <div className={media ? `${styles.inner} ${styles.media}` : styles.inner}>
        {children}
        <span className={styles.innerBorder} aria-hidden="true" />
      </div>
    </div>
  );
}
