"use client";

import { useEffect, useRef, useState } from "react";
import type { HomeTrustCopy } from "@/content/home";
import styles from "./HomeStats.module.css";

const DURATION = 1600;
/* ring geometry (viewBox 200x200) */
const R = 88;
const CIRC = 2 * Math.PI * R;
/** the arc stops short of a full circle, leaving a small gap like an orbit */
const ARC = 0.86;

/**
 * Headline figures under the hero, each inside an orbit ring that echoes
 * the hero arc: when the strip scrolls into view the rings draw, a glowing
 * dot travels along each one and the numbers count up. Reduced-motion
 * visitors (and the server HTML) get the finished state.
 */
export default function HomeStats({ stats }: { stats: HomeTrustCopy["stats"] }) {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setProgress(0);
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          setProgress(1 - Math.pow(1 - t, 3));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const arc = CIRC * ARC * progress;
  // dot position at the end of the arc (arc starts at the top, clockwise)
  const angle = -Math.PI / 2 + 2 * Math.PI * ARC * progress;
  const dot = { x: 100 + R * Math.cos(angle), y: 100 + R * Math.sin(angle) };

  return (
    <section ref={ref} className={styles.section} aria-label="EVEXA in numbers">
      <dl className={styles.stats}>
        {stats.map((stat, i) => (
          <div key={stat.label} className={styles.stat}>
            <div className={styles.orbit}>
              <svg viewBox="0 0 200 200" aria-hidden="true">
                <defs>
                  <linearGradient id={`orbit-${i}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgb(0, 128, 255)" />
                    <stop offset="100%" stopColor="rgb(150, 168, 255)" />
                  </linearGradient>
                </defs>
                <circle className={styles.track} cx="100" cy="100" r={R} />
                <circle
                  className={styles.arc}
                  cx="100"
                  cy="100"
                  r={R}
                  stroke={`url(#orbit-${i})`}
                  strokeDasharray={`${arc} ${CIRC}`}
                  transform="rotate(-90 100 100)"
                />
                <circle className={styles.dot} cx={dot.x} cy={dot.y} r="5" />
              </svg>
              <dd className={styles.value} dir="ltr">
                {Math.round(stat.value * progress)}
                <span>{stat.suffix}</span>
              </dd>
            </div>
            <dt className={styles.label}>{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
