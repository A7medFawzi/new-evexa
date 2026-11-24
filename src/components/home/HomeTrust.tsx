import Marquee from "@/components/motion/Marquee";
import { CheckBadgeIcon } from "@/components/ui/icons";
import { TRUST_LOGOS, type HomeTrustCopy } from "@/content/home";
import SectionHeading from "./SectionHeading";
import styles from "./HomeTrust.module.css";

/**
 * "Trusted by clients": heading, then three rows of client and partner
 * logos sliding in alternate directions. (The figures sit under the hero.)
 */
export default function HomeTrust({ copy }: { copy: HomeTrustCopy }) {
  return (
    <section className={styles.section} id="clients">
      <SectionHeading icon={<CheckBadgeIcon size={13} />} badge={copy.badge} title={copy.title} body={copy.body} />
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
