"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import WordReveal from "@/components/motion/WordReveal";
import GlowLabel from "@/components/ui/GlowLabel";
import PrimaryButton from "@/components/ui/PrimaryButton";
import styles from "./CaseStudy.module.css";

const HOVER_SPRING = { type: "spring", stiffness: 400, damping: 60, mass: 1 } as const;

export interface MoreWorkItem {
  href: string;
  title: string;
  tag: string;
  image: string;
}

/** "Explore More Work": links to the other case studies. */
export default function MoreWork({
  title,
  button,
  items,
}: {
  title: string;
  button: { label: string; href: string };
  items: MoreWorkItem[];
}) {
  return (
    <section className={styles.moreWork}>
      <div className={styles.moreTop}>
        <WordReveal as="h2" text={title} className={styles.moreTitle} />
        <PrimaryButton href={button.href}>{button.label}</PrimaryButton>
      </div>
      <div className={styles.moreGrid}>
        {items.map((item) => (
          <motion.div key={item.href} initial="rest" animate="rest" whileHover="hover" className={styles.moreItem}>
            <Link href={item.href} className={styles.moreCard} data-cursor="view">
              <div className={styles.moreBorder}>
                <div className={styles.moreContent}>
                  <motion.img
                    className={styles.moreImage}
                    src={item.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    variants={{ rest: { opacity: 1 }, hover: { opacity: 0.6 } }}
                    transition={HOVER_SPRING}
                  />
                  <span className={styles.moreTint} aria-hidden="true" />
                  <div className={styles.moreBar}>
                    <span className={styles.moreBarShade} aria-hidden="true" />
                    <h4 className={styles.moreName}>{item.title}</h4>
                    <GlowLabel>{item.tag}</GlowLabel>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
