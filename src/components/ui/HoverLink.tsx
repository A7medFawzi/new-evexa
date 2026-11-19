"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, type MouseEvent, type ReactNode } from "react";
import styles from "./HoverLink.module.css";

const SPRING = { type: "spring", stiffness: 400, damping: 60, mass: 1 } as const;

/**
 * Text link whose label rests dimmed and brightens to full opacity on
 * hover (spring 400/60). An active link stays at full opacity.
 */
export default function HoverLink({
  href,
  children,
  active = false,
  restOpacity = 0.6,
  external = false,
  className,
  labelClassName,
  after,
  onClick,
}: {
  href: string;
  children: ReactNode;
  active?: boolean;
  restOpacity?: number;
  external?: boolean;
  className?: string;
  labelClassName?: string;
  /** extra content after the label, inside the animated wrapper (icons) */
  after?: ReactNode;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const [hovered, setHovered] = useState(false);
  // page changes switch the active state instantly; only hover animates
  const [prevActive, setPrevActive] = useState(active);
  const [instant, setInstant] = useState(false);
  if (prevActive !== active) {
    setPrevActive(active);
    setInstant(true);
  }

  const content = (
    <motion.span
      className={styles.inner}
      initial={false}
      animate={{ opacity: active || hovered ? 1 : restOpacity }}
      transition={instant ? { duration: 0 } : SPRING}
    >
      <span className={labelClassName ? `${styles.label} ${labelClassName}` : styles.label}>{children}</span>
      {after}
    </motion.span>
  );

  const shared = {
    className: className ? `${styles.link} ${className}` : styles.link,
    onClick,
    onPointerEnter: () => {
      setInstant(false);
      setHovered(true);
    },
    onPointerLeave: () => {
      setInstant(false);
      setHovered(false);
    },
  };

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...shared}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} aria-current={active ? "page" : undefined} {...shared}>
      {content}
    </Link>
  );
}
