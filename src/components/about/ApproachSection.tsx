import type { ReactNode } from "react";
import WordReveal from "@/components/motion/WordReveal";
import ScrollTransform from "@/components/motion/ScrollTransform";
import Badge from "@/components/ui/Badge";
import PhotoCard from "@/components/ui/PhotoCard";
import { FingerprintIcon, StepDeliverIcon, StepEngineerIcon, StepUnderstandIcon } from "@/components/ui/icons";
import { localizeHref, type Lang } from "@/config/site";
import type { AboutCopy } from "@/content/about";
import StepCard from "./StepCard";
import styles from "./AboutSections.module.css";

const STEP_ICONS = [<StepUnderstandIcon key="u" size={24} />, <StepEngineerIcon key="e" size={24} />, <StepDeliverIcon key="d" size={24} />];

/**
 * Sticky photo beside three step cards that zoom in while scrolling.
 * About page: "Understand the Work. Then Build the AI." (photo on the left).
 * Home page ("Why EVEXA"): `variant="home"` puts the photo on the right,
 * drops the top padding and closes the section with a second line.
 */
export default function ApproachSection({
  lang,
  content,
  id = "about",
  variant = "about",
  badgeIcon = <FingerprintIcon />,
}: {
  lang: Lang;
  content: AboutCopy["approach"];
  id?: string;
  variant?: "about" | "home";
  badgeIcon?: ReactNode;
}) {
  const home = variant === "home";
  const photo = (
    <div className={styles.stickyPhoto}>
      <PhotoCard src={content.image.src} alt={content.image.alt} />
    </div>
  );
  return (
    <section id={id} className={[styles.section, styles.approach, home && styles.home].filter(Boolean).join(" ")}>
      <div className={styles.line} />
      <div className={`${styles.container} ${styles.approachContainer}`}>
        {!home && photo}

        <div className={styles.column}>
          <div className={styles.top}>
            <Badge label={content.badge} icon={badgeIcon} />
            <div className={styles.title}>
              <WordReveal as="h2" text={content.title[0]} />
              <WordReveal as="h2" text={content.title[1]} delay={0.2} className={styles.dim} />
            </div>
            <p className={styles.lead}>{content.intro}</p>
          </div>

          <div className={styles.steps}>
            {content.steps.map((step, i) => (
              <ScrollTransform key={step.title} from={{ scale: 0.9 }} className={styles.step}>
                <StepCard
                  icon={STEP_ICONS[i]}
                  tag={step.tag}
                  title={step.title}
                  text={step.text}
                  tags={step.tags}
                  button={step.button && { label: step.button.label, href: localizeHref(step.button.href, lang) }}
                />
              </ScrollTransform>
            ))}
          </div>
        </div>
        {home && photo}
      </div>
      {home && <div className={styles.line} />}
    </section>
  );
}
