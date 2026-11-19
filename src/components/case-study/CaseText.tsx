import type { CaseBlock } from "@/content/projects";
import styles from "./CaseStudy.module.css";

/** One chapter of the story (analysis / challenge / solution). */
export default function CaseText({ block }: { block: CaseBlock }) {
  return (
    <section className={styles.textBlock}>
      <div className={styles.mainText}>
        <h3>{block.title}</h3>
        <span className={styles.textLine} aria-hidden="true" />
        <p>{block.text}</p>
      </div>
      {block.subs.map((sub) => (
        <div key={sub.title} className={styles.subText}>
          <div className={styles.subHeading}>
            <h4>{sub.title}</h4>
            {sub.chip && <span className={styles.chip}>{sub.chip}</span>}
          </div>
          <p>{sub.text}</p>
        </div>
      ))}
    </section>
  );
}
