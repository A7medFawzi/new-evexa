"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./Marquee.module.css";

/**
 * Endless horizontal ticker. The item set is repeated until the track is
 * wider than the viewport plus one set, then the track slides by exactly
 * one set at `speed` px/s and loops seamlessly. Moves leftwards (rightwards
 * on RTL pages, or when `reverse`).
 */
export default function Marquee({
  children,
  speed = 24,
  gap = 0,
  reverse = false,
  className,
  trackClassName,
}: {
  /** one set of items */
  children: ReactNode;
  /** px per second */
  speed?: number;
  /** space between items (px) */
  gap?: number;
  reverse?: boolean;
  className?: string;
  trackClassName?: string;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const firstSet = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);
  const [setWidth, setSetWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      const set = firstSet.current?.getBoundingClientRect().width ?? 0;
      const vp = viewport.current?.clientWidth ?? 0;
      if (!set) return;
      const w = set + gap;
      setSetWidth(w);
      setCopies(Math.max(2, Math.ceil((vp + w) / w)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (viewport.current) ro.observe(viewport.current);
    if (firstSet.current) ro.observe(firstSet.current);
    return () => ro.disconnect();
  }, [gap]);

  const style = {
    "--marquee-gap": `${gap}px`,
    "--marquee-shift": `${setWidth}px`,
    animationDuration: setWidth ? `${setWidth / speed}s` : undefined,
  } as CSSProperties;

  return (
    <div ref={viewport} className={className ? `${styles.viewport} ${className}` : styles.viewport}>
      <div
        className={[styles.track, setWidth && styles.running, reverse && styles.reverse, trackClassName].filter(Boolean).join(" ")}
        style={style}
      >
        {Array.from({ length: copies }, (_, i) => (
          <div key={i} ref={i === 0 ? firstSet : undefined} className={styles.set} aria-hidden={i > 0 || undefined}>
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
