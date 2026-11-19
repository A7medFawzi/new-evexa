import styles from "./Pill.module.css";

/** Small rounded label: grey (step name) or purple (topic tag). */
export default function Pill({ children, tone = "purple" }: { children: string; tone?: "grey" | "purple" }) {
  return (
    <span className={`${styles.pill} ${styles[tone]}`}>
      <span className={styles.overlay} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
    </span>
  );
}
