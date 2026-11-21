"use client";

import { motion, useInView } from "framer-motion";
import { Fragment, useRef, type ElementType } from "react";

const WORD_SPRING = { type: "spring", stiffness: 300, damping: 50, mass: 1 } as const;
const STAGGER = 0.05;

/**
 * In Arabic text, runs of Latin words ("BDCC HRMS") stay in one span:
 * separate inline-block spans would each be placed right-to-left and
 * reverse the run's word order.
 */
function groupLatin(words: string[], arabic: boolean): string[] {
  if (!arabic) return words;
  const out: string[] = [];
  let latinRun = false;
  for (const word of words) {
    const latin = /[A-Za-z0-9]/.test(word) && !/[\u0600-\u06FF]/.test(word);
    if (latin && latinRun) out[out.length - 1] += ` ${word}`;
    else out.push(word);
    latinRun = latin;
  }
  return out;
}

/**
 * Text that reveals word by word (blur 10px + 10px rise + fade) once half
 * of it is in view. Each word is an inline-block span, like the original.
 */
export default function WordReveal({
  text,
  as: Tag = "span",
  delay = 0,
  className,
}: {
  text: string;
  as?: ElementType;
  /** start delay in seconds (alternating headings use 0 / 0.2) */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const words = groupLatin(text.split(" "), /[\u0600-\u06FF]/.test(text));

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ opacity: 0.001, y: 10, filter: "blur(10px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
            transition={{ ...WORD_SPRING, delay: delay + i * STAGGER }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
