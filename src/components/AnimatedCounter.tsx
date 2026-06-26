"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  /** Target numeric value (e.g. 200) */
  target: number;
  /** Suffix to display after number (e.g. "+") */
  suffix?: string;
  /** Duration in ms */
  duration?: number;
  /** Optional override: start immediately when true. If omitted, the counter
   *  self-detects when it scrolls into view. */
  isVisible?: boolean;
  className?: string;
}

/**
 * Counts from 0 to target the first time it enters the viewport (or when
 * `isVisible` is forced true). easeOutCubic for a smooth, visible climb.
 * Self-contained via IntersectionObserver — no parent wiring required.
 */
export default function AnimatedCounter({
  target,
  suffix = "",
  duration = 2000,
  isVisible,
  className = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (started.current) return;
      started.current = true;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setCount(target);
        return;
      }

      const startTime = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    // Forced-visible override (e.g. element already in view on load).
    if (isVisible) {
      run();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, isVisible]);

  return (
    <span ref={ref} className={className}>
      {count}
      {suffix}
    </span>
  );
}
