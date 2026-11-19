import styles from "./GlowLabel.module.css";

/** Small dark label with a faint blue inner glow (project cards). */
export default function GlowLabel({ children }: { children: string }) {
  return (
    <span className={styles.label}>
      <span className={styles.glow} aria-hidden="true" />
      <span className={styles.text}>{children}</span>
    </span>
  );
}
