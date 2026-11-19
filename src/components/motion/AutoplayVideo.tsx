"use client";

import { useEffect, useRef } from "react";

/**
 * Muted looping background video. Only metadata loads up front; it plays
 * while at least a quarter of it is on screen and pauses otherwise.
 */
export default function AutoplayVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

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

  return <video ref={ref} className={className} src={src} muted loop playsInline preload="metadata" aria-hidden="true" />;
}
