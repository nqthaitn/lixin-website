import type { Variants } from "motion/react";

// Shared Framer Motion variants for scroll-in reveals + stagger.
// Pair with: initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// Shared viewport config so reveals trigger once, slightly before fully in view.
export const inViewOnce = { once: true, margin: "-80px" } as const;
