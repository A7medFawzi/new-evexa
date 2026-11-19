"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Muted looping video. Only metadata loads up front; it plays while at
 * least a quarter of it is on screen and pauses otherwise.
 *
 * With `soundLabels`, a small button in the corner turns the sound on/off
 * (browsers only allow autoplay while muted, so sound is opt-in). Turning
 * it on restarts the video from the beginning so the speaker is heard from
 * the start.
 */
export default function AutoplayVideo({
  src,
  className,
  poster,
  soundLabels,
}: {
  src: string;
  className?: string;
  poster?: string;
  /** [label to turn sound on, label to turn it off]; omit for a silent background video */
  soundLabels?: [string, string];
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(video);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, []);

  const toggleSound = () => {
    const video = ref.current;
    if (!video) return;
    const next = !muted;
    video.muted = next;
    if (!next) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
    setMuted(next);
  };

  const video = (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden={soundLabels ? undefined : true}
    />
  );
  if (!soundLabels) return video;

  return (
    <>
      {video}
      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={!muted}
        style={{
          position: "absolute",
          insetInlineEnd: 16,
          bottom: 16,
          zIndex: 2,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 999,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(8px)",
          color: "#fff",
          font: "inherit",
          fontSize: 14,
          lineHeight: "20px",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" />
          {muted ? <path d="m22 9-6 6M16 9l6 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />}
        </svg>
        {muted ? soundLabels[0] : soundLabels[1]}
      </button>
    </>
  );
}
