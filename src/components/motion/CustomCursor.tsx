"use client";

import { animate } from "framer-motion";
import { useEffect, useRef } from "react";

const VARIANT_SPRING = { type: "spring", bounce: 0.2, duration: 0.4 } as const;
const FADE = { duration: 0.15, ease: "linear" } as const;
const STIFFNESS = 400;
const DAMPING = 60;
const DOT = 14;

/**
 * Desktop-only custom cursor: a white dot that trails the pointer on a
 * spring, turning into a "View Now" pill over elements marked with
 * `data-cursor="view"`. Hidden on touch devices.
 *
 * Each cursor is two layers: an outer element that only carries the
 * position (written every frame) and an inner element that framer-motion
 * animates (opacity / scale / size). Keeping them apart means the two never
 * fight over the same `transform`, which used to throw the pill to the
 * top-left corner mid-animation.
 */
export default function CustomCursor({ label = "View Now" }: { label?: string }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const dotInnerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const pillInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(any-hover: none)").matches) return;
    const dot = dotRef.current!;
    const dotInner = dotInnerRef.current!;
    const pill = pillRef.current!;
    const pillInner = pillInnerRef.current!;

    let px = 0, py = 0; // pointer
    let x = 0, y = 0, vx = 0, vy = 0; // dot spring state
    let hasPointer = false;
    let last = performance.now();
    let mode: "dot" | "pill" = "dot";
    let visible = false;
    let raf = 0;
    let modeRaf = 0;

    const step = (pos: number, vel: number, target: number, dt: number): [number, number] => {
      const a = -STIFFNESS * (pos - target) - DAMPING * vel;
      const v = vel + a * dt;
      return [pos + v * dt, v];
    };

    const frame = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000) || 0.016;
      last = now;
      if (mode === "pill") {
        // The dot is hidden: keep it on the pointer so it doesn't fly in
        // from an old position when the pill turns back into the dot.
        x = px; y = py; vx = 0; vy = 0;
      } else {
        [x, vx] = step(x, vx, px, dt);
        [y, vy] = step(y, vy, py, dt);
      }
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      pill.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    animate(pillInner, { scale: 0.3 }, { duration: 0 });

    const fadeIn = () =>
      mode === "pill" ? animate(pillInner, { opacity: 1, scale: 1 }, VARIANT_SPRING) : animate(dotInner, { opacity: 1 }, FADE);

    const show = () => {
      if (visible) return;
      visible = true;
      fadeIn();
    };
    const hide = () => {
      if (!visible) return;
      visible = false;
      animate(dotInner, { opacity: 0 }, FADE);
      animate(pillInner, { opacity: 0 }, FADE);
    };

    const setMode = (next: "dot" | "pill") => {
      if (mode === next) return;
      mode = next;
      if (!visible) return; // applied by fadeIn() when the pointer comes back
      if (next === "pill") {
        animate(pillInner, { opacity: 1, scale: 1 }, VARIANT_SPRING);
        animate(dotInner, { opacity: 0 }, FADE);
        document.body.style.cursor = "none";
      } else {
        animate(pillInner, { opacity: 0, scale: 0.3 }, FADE);
        animate(dotInner, { opacity: 1 }, FADE);
        document.body.style.cursor = "";
      }
    };

    /** Re-check what is under the pointer (on move and on scroll), once per frame. */
    const scheduleModeCheck = () => {
      if (modeRaf || !hasPointer) return;
      modeRaf = requestAnimationFrame(() => {
        modeRaf = 0;
        const target = document.elementFromPoint(px, py);
        setMode(target?.closest('[data-cursor="view"]') ? "pill" : "dot");
      });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      px = e.clientX;
      py = e.clientY;
      if (!hasPointer) {
        // First event: start the dot on the pointer instead of the corner.
        hasPointer = true;
        x = px; y = py;
      }
      show();
      scheduleModeCheck();
    };
    const onDown = () => mode === "dot" && animate(dotInner, { scale: 10 / DOT }, VARIANT_SPRING);
    const onUp = () => animate(dotInner, { scale: 1 }, VARIANT_SPRING);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("scroll", scheduleModeCheck, { passive: true });
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("mouseleave", hide);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(modeRaf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", scheduleModeCheck);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.body.style.cursor = "";
    };
  }, []);

  const layer = { position: "fixed", top: 0, left: 0, zIndex: 13, pointerEvents: "none", willChange: "transform" } as const;
  return (
    <>
      <div ref={dotRef} aria-hidden="true" style={layer}>
        {/* centred horizontally, hanging just below the pointer tip */}
        <div
          ref={dotInnerRef}
          style={{ width: DOT, height: DOT, marginLeft: -DOT / 2, borderRadius: 20, background: "#fff", opacity: 0 }}
        />
      </div>
      <div ref={pillRef} aria-hidden="true" style={layer}>
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
    </>
  );
}
