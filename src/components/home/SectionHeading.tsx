import type { ReactNode } from "react";
import WordReveal from "@/components/motion/WordReveal";
import Badge from "@/components/ui/Badge";
import PrimaryButton from "@/components/ui/PrimaryButton";
import styles from "./SectionHeading.module.css";

/**
 * Centered section heading used across the home page: icon badge,
 * two-line title (second line dimmed, both revealed word by word),
 * intro text and a button.
 */
export default function SectionHeading({
  icon,
  badge,
  title,
  body,
  button,
  className,
}: {
  icon: ReactNode;
  badge: string;
  title: [string, string];
  body: string;
  button?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div className={className ? `${styles.heading} ${className}` : styles.heading}>
      <div className={styles.top}>
        <Badge label={badge} icon={icon} />
        <div className={styles.title}>
          <WordReveal as="h2" text={title[0]} />
          <WordReveal as="h2" text={title[1]} delay={0.2} className={styles.dim} />
        </div>
      </div>
      <p className={styles.body}>{body}</p>
      {button && (
        <PrimaryButton href={button.href} external={/^https?:\/\//.test(button.href)}>
          {button.label}
        </PrimaryButton>
      )}
    </div>
  );
}
