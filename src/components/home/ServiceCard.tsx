"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import styles from "./HomeServices.module.css";

const SPRING = { type: "spring", stiffness: 200, damping: 60, mass: 1 } as const;

/** One solution card; its corner arrow lights up on hover. */
export default function ServiceCard({
  href,
  icon,
  title,
  subtitle,
  text,
  image,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  text: string;
  image: string;
}) {
  return (
    <motion.div className={styles.cardWrap} initial="rest" animate="rest" whileHover="hover">
      <Link href={href} className={styles.card}>
        <span className={styles.cardHighlight} aria-hidden="true" />
        <img className={styles.cardDots} src="/images/jjGQmnCK9DnrLM4akTOerjVkp9A.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <img className={styles.cardGlow} src="/images/1xOqMa4sAAwBCrdkiSJfIXups.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <span className={styles.cardContent}>
          <span className={styles.cardTop}>
            <span className={styles.cardIcon}>{icon}</span>
            <motion.span className={styles.cardArrow} variants={{ rest: { opacity: 0.2 }, hover: { opacity: 1 } }} transition={SPRING}>
              <ArrowUpRightIcon size={24} />
            </motion.span>
          </span>
          <span className={styles.cardTitle}>
            <h4>{title}</h4>
            <span>{subtitle}</span>
          </span>
          <span className={styles.cardRule} aria-hidden="true" />
          <span className={styles.cardText}>{text}</span>
          <span className={styles.cardImage}>
            <img src={image} alt="" loading="lazy" decoding="async" />
            <span className={styles.cardImageOverlay} />
          </span>
        </span>
      </Link>
    </motion.div>
  );
}
