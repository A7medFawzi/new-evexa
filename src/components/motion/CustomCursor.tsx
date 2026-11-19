"use client";

import { animate } from "framer-motion";
import { useEffect, useRef } from "react";

const VARIANT_SPRING = { type: "spring", bounce: 0.2, duration: 0.4 } as const;
const STIFFNESS = 400;
const DAMPING = 60;

/**
 * Desktop-only custom cursor: a white dot that trails the pointer on a
 * spring, turning into a "View Now" pill over elements marked with
 * `data-cursor="view"`. Hidden on touch devices.
 */
export default function CustomCursor({ label = "View Now" }: { label?: string }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(any-hover: none)").matches) return;
    const dot = dotRef.current!;
    const pill = pillRef.current!;

    let px = -100, py = -100; // pointer
    let x = -100, y = -100, vx = 0, vy = 0; // dot spring state
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
        pill.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%)`;
      } else {
        [x, vx] = step(x, vx, px, dt);
        [y, vy] = step(y, vy, py, dt);
        dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, 0%)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const show = () => {
      if (visible) return;
      visible = true;
      animate(mode === "pill" ? pill : dot, { opacity: [0, 1] }, { duration: 0.2, ease: "linear" });
    };
    const hide = () => {
      if (!visible) return;
      visible = false;
      animate(dot, { opacity: 0 }, { duration: 0.2, ease: "linear" });
      animate(pill, { opacity: 0 }, { duration: 0.2, ease: "linear" });
    };

    const setMode = (next: "dot" | "pill") => {
      if (mode === next) return;
      mode = next;
      const w = pill.offsetWidth || 100;
      const h = pill.offsetHeight || 36;
      if (next === "pill") {
        animate(pill, { opacity: [0, 1], scaleX: [14 / w, 1], scaleY: [14 / h, 1] }, VARIANT_SPRING);
        animate(dot, { opacity: [1, 0] }, { duration: 0.15, ease: "linear" });
        document.body.style.cursor = "none";
        x = px; y = py; vx = 0; vy = 0;
      } else {
        animate(dot, { opacity: [0, 1] }, { duration: 0.2, ease: "linear" });
        animate(pill, { opacity: [1, 0], scaleX: 14 / w }, { duration: 0.15, ease: "linear" });
        document.body.style.cursor = "";
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      px = e.clientX;
      py = e.clientY;
      show();
      if (!modeRaf) {
        modeRaf = requestAnimationFrame(() => {
          modeRaf = 0;
          const target = document.elementFromPoint(px, py);
          setMode(target?.closest('[data-cursor="view"]') ? "pill" : "dot");
        });
      }
    };
    const onDown = () => mode === "dot" && animate(dot, { width: 10, height: 10, marginLeft: -5 }, VARIANT_SPRING);
    const onUp = () => mode === "dot" && animate(dot, { width: 14, height: 14, marginLeft: -7 }, VARIANT_SPRING);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("mouseleave", hide);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(modeRaf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.body.style.cursor = "";
    };
  }, []);

  const base = { position: "fixed", top: 0, left: 0, zIndex: 13, pointerEvents: "none", opacity: 0, willChange: "transform" } as const;
  return (
    <>
      <div ref={dotRef} aria-hidden="true" style={{ ...base, width: 14, height: 14, marginLeft: -7, borderRadius: 20, background: "#fff" }} />
      <div
        ref={pillRef}
        aria-hidden="true"
        style={{
          ...base,
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
        }}
      >
        {label}
      </div>
    </>
  );
}
