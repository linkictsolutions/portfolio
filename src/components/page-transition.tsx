"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

/**
 * Route transition: on each pathname change a bold curtain wipes up and off,
 * revealing the new page, while the content fades/slides in beneath it.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) {
    return <>{children}</>;
  }

  return (
    <div style={{ position: "relative" }}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
      >
        {children}
      </motion.div>

      <motion.div
        key={`curtain-${pathname}`}
        aria-hidden
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "fixed",
          inset: 0,
          transformOrigin: "top",
          zIndex: 80,
          pointerEvents: "none",
          background: "var(--color-ink)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-display"
          style={{ color: "var(--color-accent)", fontSize: "clamp(2rem, 8vw, 6rem)" }}
        >
          ✦
        </motion.span>
      </motion.div>
    </div>
  );
}
