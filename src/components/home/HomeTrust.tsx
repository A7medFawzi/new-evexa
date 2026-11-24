import WordReveal from "@/components/motion/WordReveal";
import Marquee from "@/components/motion/Marquee";
import Badge from "@/components/ui/Badge";
import { CheckBadgeIcon } from "@/components/ui/icons";
import { TRUST_LOGOS, type HomeTrustCopy } from "@/content/home";
import CountUp from "./CountUp";
import styles from "./HomeTrust.module.css";

/**
 * "Trusted by clients": a blue card with the headline figures, then three
 * rows of client and partner logos sliding in alternate directions.
 */
export default function HomeTrust({ copy }: { copy: HomeTrustCopy }) {
  return (
    <section className={styles.section} id="clients">
      <div className={styles.card}>
        <span className={styles.stripes} aria-hidden="true" />
        <span className={styles.glow} aria-hidden="true" />
        <div className={styles.heading}>
          <Badge label={copy.badge} icon={<CheckBadgeIcon size={13} />} />
          <div className={styles.title}>
            <WordReveal as="h2" text={copy.title[0]} />
            <WordReveal as="h2" text={copy.title[1]} delay={0.2} className={styles.dim} />
          </div>
          <p className={styles.body}>{copy.body}</p>
        </div>
        <dl className={styles.stats}>
          {copy.stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <dd>
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt>{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      <div className={styles.logos}>
        {TRUST_LOGOS.map((row, i) => (
          <Marquee key={i} className={styles.row} gap={72} speed={26 + i * 4} reverse={i % 2 === 1}>
            {row.map((logo) => (
              <img key={logo.src} className={styles.logo} src={logo.src} width={logo.width} height={logo.height} alt={logo.alt} loading="lazy" decoding="async" />
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
