"use client";

import { Fragment, useEffect, useRef, type ElementType } from "react";

const unitStyle = (lit: boolean) => ({ color: lit ? "#fff" : "#666", transition: "color 0.3s ease-in-out" });

/** First characters (Latin) / words (Arabic) that start already lit. */
const LIT_CHARS = 40;
const LIT_WORDS = 5;

/**
 * Statement that lights up from grey (#666) to white as it scrolls through
 * the viewport: progress 0 when its top is at 75% of the viewport height,
 * 1 when it reaches 15%. Latin text fades per character; Arabic per word
 * (splitting joined Arabic script into letters would break its shaping).
 */
export default function ScrollFillText({
  text,
  as: Tag = "p",
  perWord = false,
  className,
}: {
  text: string;
  as?: ElementType;
  /** animate whole words (use for Arabic) */
  perWord?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const units = [...root.querySelectorAll<HTMLElement>("[data-unit]")];
    const wordCount = words.length;
    // each word owns an equal slice of the progress; its characters split that slice
    const timeline = units.map((el) => {
      const w = Number(el.dataset.word);
      const n = Number(el.dataset.count);
      const i = Number(el.dataset.i);
      const start = w / wordCount + i * (1 / wordCount / n);
      return { el, start, end: start + 1 / wordCount / n, lit: Number(el.dataset.unit) < (perWord ? LIT_WORDS : LIT_CHARS) };
    });

    const paint = (progress: number) => {
      for (const u of timeline) {
        const t = u.lit ? 1 : Math.min(1, Math.max(0, (progress - u.start) / (u.end - u.start)));
        const v = Math.round(0x66 + (0xff - 0x66) * t);
        u.el.style.color = `rgb(${v}, ${v}, ${v})`;
      }
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      const top = root.getBoundingClientRect().top;
      const vh = window.innerHeight || 1;
      paint(Math.min(1, Math.max(0, (0.75 * vh - top) / (0.6 * vh))));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [words.length, perWord]);

  // index of each word's first character in the whole text (Latin: +1 per space)
  const wordStarts = words.reduce<number[]>((starts, word, i) => {
    starts.push(i === 0 ? 0 : starts[i - 1] + [...words[i - 1]].length + 1);
    return starts;
  }, []);
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, w) => {
        const isLast = w === words.length - 1;
        if (perWord) {
          // the space is its own flex item, so a line can end right after a word
          return (
            <Fragment key={w}>
              <span aria-hidden="true" data-unit={w} data-word={w} data-count={1} data-i={0} style={unitStyle(w < LIT_WORDS)}>
                {word}
              </span>
              {isLast ? null : "\u00a0"}
            </Fragment>
          );
        }
        const chars = [...word];
        const base = wordStarts[w];
        return (
          <span key={w} aria-hidden="true">
            {chars.map((c, i) => (
              <span key={i} data-unit={base + i} data-word={w} data-count={chars.length} data-i={i} style={unitStyle(base + i < LIT_CHARS)}>
                {c}
              </span>
            ))}
            {isLast ? null : " "}
          </span>
        );
      })}
    </Tag>
  );
}
