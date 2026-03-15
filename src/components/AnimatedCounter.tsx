"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  /** Target numeric value (e.g. 200) */
  target: number;
  /** Suffix to display after number (e.g. "+") */
  suffix?: string;
  /** Duration in ms */
  duration?: number;
  /** Whether to start counting */
  isVisible: boolean;
  className?: string;
}

/**
 * Animated counting component.
 * Counts from 0 to target when isVisible becomes true.
 * Uses easeOutExpo for a satisfying deceleration effect.
 */
export default function AnimatedCounter({
  target,
  suffix = "",
  duration = 2000,
  isVisible,
  className = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      queueMicrotask(() => setCount(target));
      return;
    }

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo curve — fast start, smooth deceleration
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = Math.round(eased * target);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);

  return (
    <span className={className}>
      {count}
      {suffix}
    </span>
  );
}
