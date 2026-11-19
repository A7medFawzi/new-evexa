"use client";

import { animate } from "framer-motion";
import { useEffect, useRef } from "react";

const POP = { type: "spring", bounce: 0.2, duration: 0.4 } as const;
const FADE = { duration: 0.15, ease: "linear" } as const;

/**
 * "View Now" pill that replaces the cursor over elements marked with
 * `data-cursor="view"` (project cards). Desktop / mouse only.
 *
 * The everyday cursor is the EVEXA image cursor set in globals.css, which
 * the operating system draws with no lag. This component only adds the
 * pill: it sits exactly on the pointer (no spring, no trailing), and while
 * it is shown `html.cursor-view` hides the system cursor.
 *
 * Two layers: the outer one carries the position (written every frame),
 * the inner one is what framer-motion animates (opacity / scale), so the
 * two never fight over the same `transform`.
 */
export default function CustomCursor({ label = "View Now" }: { label?: string }) {
  const pillRef = useRef<HTMLDivElement>(null);
  const pillInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(any-hover: none)").matches) return;
    const pill = pillRef.current!;
    const pillInner = pillInnerRef.current!;
    const root = document.documentElement;

    let px = 0, py = 0;
    let hasPointer = false;
    let shown = false;
    let raf = 0;
    let checkRaf = 0;

    const frame = () => {
      pill.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    animate(pillInner, { scale: 0.3 }, { duration: 0 });

    const setShown = (next: boolean) => {
      if (shown === next) return;
      shown = next;
      root.classList.toggle("cursor-view", next);
      if (next) animate(pillInner, { opacity: 1, scale: 1 }, POP);
      else animate(pillInner, { opacity: 0, scale: 0.3 }, FADE);
    };

    /** Re-check what is under the pointer (on move and on scroll), once per frame. */
    const check = () => {
      if (checkRaf || !hasPointer) return;
      checkRaf = requestAnimationFrame(() => {
        checkRaf = 0;
        setShown(!!document.elementFromPoint(px, py)?.closest('[data-cursor="view"]'));
      });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      px = e.clientX;
      py = e.clientY;
      hasPointer = true;
      check();
    };
    const hide = () => setShown(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("blur", hide);
    root.addEventListener("mouseleave", hide);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(checkRaf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", check);
      window.removeEventListener("blur", hide);
      root.removeEventListener("mouseleave", hide);
      root.classList.remove("cursor-view");
    };
  }, []);

  return (
    <div
      ref={pillRef}
      aria-hidden="true"
      style={{ position: "fixed", top: 0, left: 0, zIndex: 13, pointerEvents: "none", willChange: "transform" }}
    >
      <div
        ref={pillInnerRef}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5px 15px",
          borderRadius: 45,
          background: "#fff",
          boxShadow: "0px 4px 12px 0px rgba(0, 0, 0, 0.1)",
          color: "#080808",
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "18px",
          whiteSpace: "pre",
          opacity: 0,
        }}
      >
        {label}
      </div>
    </div>
  );
}
