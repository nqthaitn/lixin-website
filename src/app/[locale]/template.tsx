"use client";

import { motion } from "motion/react";

/**
 * Per-navigation entrance animation. A template (unlike a layout) re-mounts on
 * every route change, so each page fades/slides in. Lives below the layout, so
 * the fixed Header/Footer are not affected.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
