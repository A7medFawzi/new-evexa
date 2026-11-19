"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import styles from "./Badge.module.css";

const LINE_SPRING = { type: "spring", stiffness: 300, damping: 60, mass: 1, delay: 0.2 } as const;

/**
 * Small glass pill shown above section headings.
 *  - chip:  "EVEXA | LET'S TALK" — a blue text chip before the label
 *  - icon:  a round blue icon before the label, with a blue glow line on
 *           the top edge that pops in once the badge is fully visible
 */
export default function Badge({ label, chip, icon }: { label: string; chip?: string; icon?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const fullyVisible = useInView(ref, { once: true, amount: 1 });

  return (
    <div ref={ref} className={`${styles.badge} ${icon ? styles.withIcon : styles.withChip}`}>
      <div className={styles.overlay} />
      {chip && <span className={styles.chip}>{chip}</span>}
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{label}</span>
      {icon && (
        <motion.span
          className={styles.line}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={fullyVisible ? { opacity: 1, scale: 1 } : undefined}
          transition={LINE_SPRING}
        />
      )}
    </div>
  );
}
