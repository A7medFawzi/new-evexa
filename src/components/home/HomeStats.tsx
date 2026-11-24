import type { HomeTrustCopy } from "@/content/home";
import CountUp from "./CountUp";
import styles from "./HomeStats.module.css";

/** Slim strip of headline figures right under the hero. */
export default function HomeStats({ stats }: { stats: HomeTrustCopy["stats"] }) {
  return (
    <section className={styles.section} aria-label="EVEXA in numbers">
      <dl className={styles.strip}>
        <span className={styles.highlight} aria-hidden="true" />
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <dd>
              <CountUp value={stat.value} suffix={stat.suffix} />
            </dd>
            <dt>{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
