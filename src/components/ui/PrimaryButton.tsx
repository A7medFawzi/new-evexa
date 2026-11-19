"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import { scrollToSection } from "@/lib/scroll";
import styles from "./PrimaryButton.module.css";

const SPRING = { type: "spring", stiffness: 200, damping: 60, mass: 1 } as const;

const RING_HOVER = {
  initial: { boxShadow: "0px 0px 0px 0px rgba(0, 49, 213, 0.3)" },
  hover: { boxShadow: "0px 0px 0px 5px rgba(0, 49, 213, 0.3)" },
};
const FADE_HOVER = { initial: { opacity: 1 }, hover: { opacity: 0.6 } };

/**
 * Site button. Purple (brand gradient): a soft blue ring grows around it
 * on hover. White / grey (hero): fades to 60% on hover.
 */
export default function PrimaryButton({
  href,
  children,
  arrow = false,
  thin = false,
  tone = "purple",
  external = false,
  className,
  onClick,
}: {
  href: string;
  children: ReactNode;
  /** trailing ↗ arrow that nudges on hover */
  arrow?: boolean;
  /** 1px border (header/footer) instead of the 3px used in page sections */
  thin?: boolean;
  tone?: "purple" | "white" | "grey";
  /** opens in a new tab (links to other sites) */
  external?: boolean;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const hover = tone === "purple" ? RING_HOVER : FADE_HOVER;
  const buttonClass = [styles.button, thin && styles.thin, tone !== "purple" && styles[tone]].filter(Boolean).join(" ");
  return (
    <motion.div
      className={className ? `${styles.wrap} ${className}` : styles.wrap}
      initial={false}
      style={hover.initial}
      whileHover={hover.hover}
      transition={SPRING}
    >
      <Link
        href={href}
        className={buttonClass}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={(e) => {
          onClick?.(e);
          // in-page anchors ("#section") scroll smoothly
          if (!e.defaultPrevented && href.startsWith("#") && scrollToSection(href.slice(1))) e.preventDefault();
        }}
      >
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
