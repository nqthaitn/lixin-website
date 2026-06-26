"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Card that tilts in 3D toward the cursor and lifts on hover (spring physics).
 * Wrap in a parent with `perspective` (e.g. style={{ perspective: 900 }}) for
 * the 3D effect. Respects reduced-motion: tilt simply stays at rest if the OS
 * disables it (Framer Motion honors prefers-reduced-motion for transforms).
 */
export default function TiltCard({
  children,
  className,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), {
    stiffness: 200,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), {
    stiffness: 200,
    damping: 18,
  });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
