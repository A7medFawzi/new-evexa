import styles from "./HomeHero.module.css";

/**
 * The blue planet-arc glow behind the hero. Eases in from 110% on load
 * (3s) and then breathes gently (tilt/skew/drift loop). Both animations
 * are plain CSS, so the glow paints with the first frame instead of
 * waiting for JavaScript (it is the page's largest element).
 */
export default function HeroBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.backdropShade} />
      <div className={`${styles.arc} ${styles.arcIn}`}>
        <img className={styles.arcImage} src="/images/jzTMdaQ6X2Js2yDQdPP9o3L3XUA.webp" alt="" decoding="async" fetchPriority="high" />
      </div>
    </div>
  );
}
