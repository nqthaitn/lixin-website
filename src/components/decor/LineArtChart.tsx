"use client";

import { motion } from "motion/react";

/**
 * Self-drawing line-art "growth" motif — decorative, no image asset.
 * Strokes draw themselves when scrolled into view. Color via `text-*` on parent
 * (uses currentColor). Keep it faint/decorative behind content.
 */
export default function LineArtChart({ className = "" }: { className?: string }) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    show: {
      pathLength: 1,
      opacity: 1,
      transition: { pathLength: { duration: 1.8, ease: "easeInOut" }, opacity: { duration: 0.3 } },
    },
  } as const;

  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 200 120"
      fill="none"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      className={className}
    >
      {/* axes */}
      <motion.path
        d="M20 10 V100 H190"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeOpacity={0.4}
        variants={draw}
      />
      {/* growth line */}
      <motion.path
        d="M28 88 L66 70 L104 78 L142 44 L182 24"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw}
      />
      {/* data points */}
      {[
        [28, 88],
        [66, 70],
        [104, 78],
        [142, 44],
        [182, 24],
      ].map(([cx, cy], i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r={3.5}
          fill="currentColor"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 + i * 0.18, type: "spring", stiffness: 300, damping: 16 }}
        />
      ))}
    </motion.svg>
  );
}
