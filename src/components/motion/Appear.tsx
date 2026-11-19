"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

/** Page-load entrance spring used across the site (stiffness 200, damping 60). */
export const APPEAR_SPRING = { type: "spring", stiffness: 200, damping: 60, mass: 1 } as const;

/**
 * Fades its content in on page load after `delay` seconds.
 * Server-rendered at opacity 0.001 so nothing flashes before hydration.
 * `rotateX` adds the "flip up" entrance (perspective 4000px).
 */
export default function Appear({
  as = "div",
  delay,
  rotateX,
  className,
  style,
  children,
}: {
  as?: "div" | "span";
  delay: number;
  rotateX?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const Tag = as === "span" ? motion.span : motion.div;
  return (
    <Tag
      className={className}
      style={rotateX ? { ...style, transformPerspective: 4000 } : style}
      initial={rotateX ? { opacity: 0.001, rotateX } : { opacity: 0.001 }}
      animate={rotateX ? { opacity: 1, rotateX: 0 } : { opacity: 1 }}
      transition={{ ...APPEAR_SPRING, delay }}
    >
      {children}
    </Tag>
  );
}
