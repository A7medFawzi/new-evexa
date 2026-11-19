import type { ReactNode } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Pill from "@/components/ui/Pill";
import styles from "./StepCard.module.css";

/** One step of the approach: icon + step name, title, text, then tags or a button. */
export default function StepCard({
  icon,
  tag,
  title,
  text,
  tags,
  button,
}: {
  icon: ReactNode;
  tag: string;
  title: string;
  text: string;
  tags?: string[];
  button?: { label: string; href: string };
}) {
  return (
    <article className={styles.frame}>
      <div className={styles.panel}>
        <span className={styles.glow} aria-hidden="true" />
        <div className={styles.head}>
          <span className={styles.icon}>
            <span className={styles.iconGlow} aria-hidden="true" />
            {icon}
          </span>
          <Pill tone="grey">{tag}</Pill>
        </div>
        <div className={styles.body}>
          <h4 className={styles.title}>{title}</h4>
          <span className={styles.divider} aria-hidden="true" />
          <p className={styles.text}>{text}</p>
        </div>
        {tags && (
          <div className={styles.tags}>
            {tags.map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </div>
        )}
        {button && (
          <div className={styles.tags}>
            <PrimaryButton href={button.href}>{button.label}</PrimaryButton>
          </div>
        )}
      </div>
    </article>
  );
}
