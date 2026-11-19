import styles from "./PhotoCard.module.css";

/** Photo in a dark rounded frame with a thin blue highlight on the bottom edge. */
export default function PhotoCard({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={className ? `${styles.frame} ${className}` : styles.frame}>
      <div className={styles.border}>
        <img className={styles.image} src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
      <span className={styles.highlight} aria-hidden="true" />
    </div>
  );
}
