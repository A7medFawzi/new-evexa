import ScrollFillText from "@/components/motion/ScrollFillText";
import Badge from "@/components/ui/Badge";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { AboutIcon } from "@/components/ui/icons";
import { localizeHref, type Lang } from "@/config/site";
import type { HomeAboutCopy } from "@/content/home";
import styles from "./HomeAbout.module.css";

/** "About EVEXA": a statement that lights up as it scrolls into view. */
export default function HomeAbout({ copy, lang }: { copy: HomeAboutCopy; lang: Lang }) {
  return (
    <section className={styles.section}>
      <div className={`${styles.fade} ${styles.fadeTop}`} aria-hidden="true" />
      <div className={`${styles.fade} ${styles.fadeBottom}`} aria-hidden="true" />
      <div className={`${styles.fade} ${styles.fadeLeft}`} aria-hidden="true" />
      <div className={`${styles.fade} ${styles.fadeRight}`} aria-hidden="true" />
      <div className={styles.content}>
        <Badge label={copy.badge} icon={<AboutIcon />} />
        <ScrollFillText text={copy.statement} perWord={lang === "ar"} className={styles.statement} />
        <PrimaryButton href={localizeHref(copy.button.href, lang)}>{copy.button.label}</PrimaryButton>
      </div>
      <span className={styles.line} aria-hidden="true" />
    </section>
  );
}
