import Appear from "@/components/motion/Appear";
import Badge from "@/components/ui/Badge";
import PrimaryButton from "@/components/ui/PrimaryButton";
import type { Lang } from "@/config/site";
import type { ContactCopy } from "@/content/contact";
import ContactForm from "./ContactForm";
import styles from "./ContactHero.module.css";

/** Contact page hero: headline over a blue glow, then the inquiry form card. */
export default function ContactHero({ lang, copy }: { lang: Lang; copy: ContactCopy }) {
  return (
    <section className={styles.hero}>
      <div className={styles.spacer} />
      <div className={styles.container}>
        <div className={styles.glow} aria-hidden="true">
          <div className={styles.vignette} />
        </div>
        <div className={styles.glowFade} aria-hidden="true" />

        <div className={styles.top}>
          <div className={styles.text}>
            <div className={styles.tagAndTitle}>
              <Appear delay={0.2}>
                <Badge chip={copy.badgeChip} label={copy.badge} />
              </Appear>
              <h1 className={styles.title}>
                <Appear as="span" delay={0.5} className={styles.titleLine}>
                  <span>{copy.title[0]}</span>
                </Appear>
                <Appear as="span" delay={0.7} className={styles.titleLine}>
                  <span>{copy.title[1]}</span>
                </Appear>
              </h1>
            </div>
            <p className={styles.intro}>{copy.intro}</p>
          </div>
          <Appear delay={1.1} className={styles.buttons}>
            <PrimaryButton href="#evexa-contact-form">{copy.button}</PrimaryButton>
          </Appear>
        </div>

        <Appear delay={1.0} className={styles.bottom}>
          <div className={styles.card}>
            <div className={styles.cardInner}>
              <div className={styles.cardContent}>
                <ContactForm lang={lang} copy={copy} />
              </div>
            </div>
          </div>
        </Appear>
      </div>
    </section>
  );
}
