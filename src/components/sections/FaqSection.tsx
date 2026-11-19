"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import WordReveal from "@/components/motion/WordReveal";
import Badge from "@/components/ui/Badge";
import { FingerprintIcon } from "@/components/ui/icons";
import type { FaqContent } from "@/content/faq";
import styles from "./FaqSection.module.css";

const SPRING = { type: "spring", stiffness: 500, damping: 60, mass: 1 } as const;
const BORDER = (alpha: number) => `inset 0 0 0 1px rgba(255, 255, 255, ${alpha})`;

/** "Frequently Asked Questions" — intro on one side, accordion on the other. */
export default function FaqSection({
  content,
  badgeLabel,
  tight = false,
  roomy = false,
}: {
  content: FaqContent;
  badgeLabel: string;
  /** 100px instead of 120px above the section on desktop */
  tight?: boolean;
  /** keep 120px above the section on tablets too */
  roomy?: boolean;
}) {
  return (
    <section id="faq" className={[styles.section, tight && styles.tight, roomy && styles.roomy].filter(Boolean).join(" ")}>
      <img className={styles.rays} src="/images/HQiQT243MN1itZOX771FxR6euwI.webp" width={2398} height={1558} alt="" aria-hidden="true" decoding="async" loading="lazy" />
      <div className={styles.container}>
        <div className={styles.intro}>
          <Badge label={badgeLabel} icon={<FingerprintIcon />} />
          <div className={styles.title}>
            <WordReveal as="h2" text={content.title[0]} />
            <WordReveal as="h2" text={content.title[1]} delay={0.2} className={styles.dim} />
          </div>
          <p className={styles.lead}>{content.intro}</p>
        </div>
        <div className={styles.list}>
          {content.items.map((item) => (
            <FaqItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className={styles.card}
      initial={false}
      animate={{ boxShadow: BORDER(open ? 0.15 : 0.07) }}
      transition={SPRING}
    >
      <button type="button" className={styles.row} aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className={styles.question}>{question}</span>
        <motion.span className={styles.icon} initial={false} animate={{ rotate: open ? 45 : 0 }} transition={SPRING}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" />
          </svg>
        </motion.span>
      </button>
      <motion.div
        className={styles.answer}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={SPRING}
      >
        <p>{answer}</p>
      </motion.div>
    </motion.div>
  );
}
