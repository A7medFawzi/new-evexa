import { GearIcon, StepDeliverIcon, StepEngineerIcon, StepUnderstandIcon } from "@/components/ui/icons";
import type { HomeProcessCopy } from "@/content/home";
import SectionHeading from "./SectionHeading";
import styles from "./HomeProcess.module.css";

const STEP_ICONS = [StepUnderstandIcon, StepEngineerIcon, StepDeliverIcon];

/** "Our Process": three steps inside one dark frame. */
export default function HomeProcess({ copy }: { copy: HomeProcessCopy }) {
  return (
    <section className={styles.section}>
      <img className={styles.rays} src="/images/HQiQT243MN1itZOX771FxR6euwI.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <div className={styles.fade} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.top}>
          <SectionHeading icon={<GearIcon />} badge={copy.badge} title={copy.title} body={copy.body} />
        </div>
        <ol className={styles.frame}>
          {copy.steps.map((step, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <li key={step.title} className={styles.step}>
                <span className={styles.highlight} aria-hidden="true" />
                <img className={styles.dots} src="/images/jjGQmnCK9DnrLM4akTOerjVkp9A.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                <img className={styles.glow} src="/images/1xOqMa4sAAwBCrdkiSJfIXups.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                <span className={styles.icon}>
                  <Icon size={34} />
                </span>
                <div className={styles.text}>
                  <h5>{step.title}</h5>
                  <p>{step.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
