import styles from "./TopGlow.module.css";

/** Atmospheric blue glow behind the top 1400px of a page (legal, case studies). */
export default function TopGlow() {
  return (
    <div className={styles.glow} aria-hidden="true">
      <div className={styles.vignette} />
      <div className={styles.fade} />
    </div>
  );
}
