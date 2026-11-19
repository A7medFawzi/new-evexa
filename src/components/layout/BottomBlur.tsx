/**
 * Progressive blur fixed to the bottom 160px of the viewport: content
 * softly blurs as it scrolls under the bottom edge. Eight stacked layers,
 * each doubling the blur (0.08px → 10px) inside a sliding mask band.
 */
const LAYERS = 8;
const STEP = 100 / LAYERS; // 12.5%

function mask(i: number) {
  const a = (i - 1) * STEP;
  const stops = [`rgba(0, 0, 0, 0) ${a}%`, `rgba(0, 0, 0, 1) ${a + STEP}%`];
  if (i < LAYERS) stops.push(`rgba(0, 0, 0, 1) ${a + 2 * STEP}%`);
  if (i < LAYERS - 1) stops.push(`rgba(0, 0, 0, 0) ${a + 3 * STEP}%`);
  return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

export default function BottomBlur() {
  return (
    <div
      aria-hidden="true"
      data-bottom-blur=""
      style={{ position: "fixed", left: 0, right: 0, bottom: 0, height: 160, zIndex: 8, pointerEvents: "none" }}
    >
      {Array.from({ length: LAYERS }, (_, k) => {
        const i = k + 1;
        const blur = `blur(${0.078125 * 2 ** k}px)`;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: i,
              maskImage: mask(i),
              WebkitMaskImage: mask(i),
              backdropFilter: blur,
              WebkitBackdropFilter: blur,
            }}
          />
        );
      })}
    </div>
  );
}
