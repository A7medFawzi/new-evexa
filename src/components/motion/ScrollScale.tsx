"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Grows from `from` (default 0.9) to full size while the element scrolls
 * into view: from its top touching the bottom of the viewport until its
 * bottom does.
 */
export default function ScrollScale({ from = 0.9, className, children }: { from?: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [from, 1]);
  return (
    <motion.div ref={ref} className={className} style={{ scale, willChange: "transform" }}>
      {children}
    </motion.div>
  );
}
