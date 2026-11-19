"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Pose = { scale?: number; rotate?: number; y?: number; opacity?: number };

/**
 * Moves its content from the `from` pose to the resting pose while it
 * scrolls into view: from its top touching the bottom of the viewport
 * until its bottom does. Used for card zoom-ins and slide/tilt entrances.
 */
export default function ScrollTransform({ from, className, style, children }: { from: Pose; className?: string; style?: React.CSSProperties; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [from.scale ?? 1, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [from.rotate ?? 0, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [from.y ?? 0, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [from.opacity ?? 1, 1]);
  return (
    <motion.div ref={ref} className={className} style={{ ...style, scale, rotate, y, opacity, willChange: "transform" }}>
      {children}
    </motion.div>
  );
}
