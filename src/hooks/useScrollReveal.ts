"use client";

import { useState, useCallback } from "react";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  /** Only trigger once */
  once?: boolean;
}

// WeakMap to store observer references outside of React's tracking
const observerMap = new WeakMap<HTMLElement, IntersectionObserver>();

/**
 * Custom hook to reveal elements on scroll using IntersectionObserver.
 * Uses a callback ref pattern for DOM attachment.
 * Respects prefers-reduced-motion automatically.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const { threshold = 0.15, rootMargin = "0px 0px -60px 0px", once = true } = options;
  const [isVisible, setIsVisible] = useState(false);

  const ref = useCallback(
    (node: T | null) => {
      if (!node) return;

      // Cleanup previous observer for this node
      const prevObserver = observerMap.get(node);
      if (prevObserver) {
        prevObserver.disconnect();
        observerMap.delete(node);
      }

      // Respect prefers-reduced-motion
      if (typeof window !== "undefined") {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mediaQuery.matches) {
          setIsVisible(true);
          return;
        }
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
              observerMap.delete(node);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(node);
      observerMap.set(node, observer);
    },
    [threshold, rootMargin, once]
  );

  return { ref, isVisible };
}

/**
 * Hook for staggered reveal of multiple child items.
 * Returns a callback ref for the container and isVisible state.
 * Use the `staggerIndex` with CSS transition-delay for each child.
 */
export function useStaggerReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const { threshold = 0.1, rootMargin = "0px 0px -40px 0px", once = true } = options;
  const [isVisible, setIsVisible] = useState(false);

  const ref = useCallback(
    (node: T | null) => {
      if (!node) return;

      const prevObserver = observerMap.get(node);
      if (prevObserver) {
        prevObserver.disconnect();
        observerMap.delete(node);
      }

      if (typeof window !== "undefined") {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mediaQuery.matches) {
          setIsVisible(true);
          return;
        }
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
              observerMap.delete(node);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(node);
      observerMap.set(node, observer);
    },
    [threshold, rootMargin, once]
  );

  return { ref, isVisible };
}
