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

/** "Understand the Work. Then Build the AI." — sticky photo beside three step cards. */
export default function ApproachSection({ lang, content }: { lang: Lang; content: AboutCopy["approach"] }) {
  return (
    <section id="about" className={`${styles.section} ${styles.approach}`}>
      <div className={styles.line} />
      <div className={`${styles.container} ${styles.approachContainer}`}>
        <div className={styles.stickyPhoto}>
          <PhotoCard src={content.image.src} alt={content.image.alt} />
        </div>

        <div className={styles.column}>
          <div className={styles.top}>
            <Badge label={content.badge} icon={<FingerprintIcon />} />
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
      </div>
    </section>
  );
}
