"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import styles from "./PrimaryButton.module.css";

const SPRING = { type: "spring", stiffness: 200, damping: 60, mass: 1 } as const;

/** Brand-gradient button; a soft blue ring grows around it on hover. */
export default function PrimaryButton({
  href,
  children,
  arrow = false,
  className,
  onClick,
}: {
  href: string;
  children: ReactNode;
  /** trailing ↗ arrow that nudges on hover */
  arrow?: boolean;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <motion.div
      className={className ? `${styles.wrap} ${className}` : styles.wrap}
      initial={false}
      style={{ boxShadow: "0px 0px 0px 0px rgba(0, 49, 213, 0.3)" }}
      whileHover={{ boxShadow: "0px 0px 0px 5px rgba(0, 49, 213, 0.3)" }}
      transition={SPRING}
    >
      <Link href={href} className={styles.button} onClick={onClick}>
        {children}
        {arrow && (
          <svg className={styles.arrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17L17 7" />
            <path d="M9 7h8v8" />
          </svg>
        )}
      </Link>
    </motion.div>
  );
}
