"use client";

import { useEffect, useRef, useState } from "react";
import { AnalyticsIcon, CalendarCheckIcon, InboxIcon, QuotationIcon } from "@/components/ui/icons";
import type { Lang } from "@/config/site";
import styles from "./HomeProduct.module.css";

type Screen = { src: string; small: string; title: string; text: string; callout: string };

/** Tab icons, in screen order (RFQ inbox, my day, opportunities, team dashboard). */
const ICONS = [InboxIcon, CalendarCheckIcon, QuotationIcon, AnalyticsIcon];

/** Seconds each screen stays before the next one (matches the progress bar). */
const STEP = 6;

/**
 * Product window that steps through the Dealplier screens. The active tab's
 * progress bar runs while the window is on screen and not hovered; when it
 * ends the next screen shows. Clicking a tab picks a screen and stops the
 * rotation. Visitors who prefer reduced motion get no rotation.
 */
export default function ProductShowcase({ screens, lang }: { screens: Screen[]; lang: Lang }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(false);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = auto && visible && !hover;
  const current = screens[active];

  return (
    <div
      className={styles.showcase}
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ["--step" as string]: `${STEP}s` }}
    >
      <div className={styles.stage}>
        <span className={styles.glow} aria-hidden="true" />
        <div className={styles.window}>
          <div className={styles.chrome} aria-hidden="true">
            <span className={styles.dots}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.address}>app.dealplier.com</span>
          </div>
          <div className={styles.screen}>
            {screens.map((s, i) => (
              <img
                key={s.src}
                src={s.src}
                srcSet={`${s.small} 900w, ${s.src} 1600w`}
                sizes="(max-width: 1199px) 100vw, 1120px"
                alt={`Dealplier · ${s.title}`}
                width={1600}
                height={1000}
                loading="lazy"
                decoding="async"
                className={i === active ? styles.shown : undefined}
                aria-hidden={i !== active}
              />
            ))}
          </div>
        </div>
        <span key={active} className={styles.callout} dir={lang === "ar" ? "rtl" : "ltr"}>
          <span className={styles.calloutIcon} aria-hidden="true">
            <span className={styles.mark} />
          </span>
          {current.callout}
        </span>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Dealplier">
        {screens.map((s, i) => {
          const Icon = ICONS[i];
          const on = i === active;
          return (
            <button
              key={s.src}
              type="button"
              role="tab"
              aria-selected={on}
              className={on ? `${styles.tab} ${styles.tabOn}` : styles.tab}
              onClick={() => {
                setActive(i);
                setAuto(false);
              }}
            >
              <span className={styles.tabHead}>
                <span className={styles.tabIcon} aria-hidden="true">
                  {Icon && <Icon size={16} />}
                </span>
                {s.title}
              </span>
              <span className={styles.tabText}>{s.text}</span>
              <span className={styles.progress} aria-hidden="true">
                {on && (
                  <span
                    className={styles.bar}
                    style={auto ? { animationPlayState: running ? "running" : "paused" } : { animation: "none" }}
                    onAnimationEnd={() => setActive((a) => (a + 1) % screens.length)}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
      <p className={styles.tabTextPhone}>{current.text}</p>
    </div>
  );
}
