import Marquee from "@/components/motion/Marquee";
import { IntegrationsIcon } from "@/components/ui/icons";
import { localizeHref, type Lang } from "@/config/site";
import { INTEGRATION_LOGOS, type HomeCopy } from "@/content/home";
import SectionHeading from "./SectionHeading";
import styles from "./HomeIntegrations.module.css";

/** "Integrations": heading, then a strip of tool logos drifting past a pulsing check mark. */
export default function HomeIntegrations({ copy, lang }: { copy: HomeCopy["integrations"]; lang: Lang }) {
  return (
    <section className={styles.section}>
      <img className={styles.rays} src="/images/LkFP2vozPwqgvdBNBGGOe2WEkcI.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <div className={styles.fade} aria-hidden="true" />
      <div className={styles.top}>
        <SectionHeading
          icon={<IntegrationsIcon />}
          badge={copy.badge}
          title={copy.title}
          body={copy.body}
          button={{ label: copy.button.label, href: localizeHref(copy.button.href, lang) }}
        />
      </div>
      <div className={styles.bottom} aria-hidden="true">
        <div className={styles.ticker}>
          <Marquee className={styles.strip} gap={40} speed={24}>
            {INTEGRATION_LOGOS.map((src) => (
              <span key={src} className={styles.logo}>
                <img src={src} width={48} height={48} alt="" loading="lazy" decoding="async" />
                <span className={styles.logoShine} />
              </span>
            ))}
          </Marquee>
          <span className={`${styles.pulse} ${styles.pulse1}`} />
          <span className={`${styles.pulse} ${styles.pulse2}`} />
          <span className={`${styles.pulse} ${styles.pulse3}`} />
          <img className={styles.check} src="/images/i3lRpYZPF6l5tginmGCGm4k6Fo.svg" width={74} height={74} alt="" />
        </div>
      </div>
    </section>
  );
}
