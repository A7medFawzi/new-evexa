"use client";

import { motion } from "framer-motion";
import styles from "./HomeHero.module.css";

/**
 * The blue planet-arc glow behind the hero. Eases in from 110% on load
 * (3s) and then breathes gently (tilt/skew/drift loop, see CSS).
 */
export default function HeroBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.backdropShade} />
      <motion.div
        className={styles.arc}
        initial={{ opacity: 0.001, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 3, bounce: 0 }}
      >
        <img className={styles.arcImage} src="/images/jzTMdaQ6X2Js2yDQdPP9o3L3XUA.webp" alt="" decoding="async" fetchPriority="high" />
      </motion.div>
    </div>
  );
}
