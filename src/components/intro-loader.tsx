"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getLenis } from "@/components/smooth-scroll";

const WORDS = ["Clarity", "Craft", "Interaction", "Abel Abebaw"];

export function IntroLoader() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    if (sessionStorage.getItem("introSeen")) return;

    getLenis()?.stop();
    document.body.style.overflow = "hidden";

    const total = 1500;
    const startedAt = performance.now();
    let rafId = 0;
    const tick = () => {
      const p = Math.min((performance.now() - startedAt) / total, 1);
      setShow(true);
      setCount(Math.round(p * 100));
      setWordIndex(Math.min(WORDS.length - 1, Math.floor(p * WORDS.length)));
      if (p < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const done = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("introSeen", "1");
      getLenis()?.start();
      document.body.style.overflow = "";
    }, total + 650);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(done);
      getLenis()?.start();
      document.body.style.overflow = "";
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 90,
            background: "var(--color-ink)",
            color: "var(--color-paper)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "clamp(1.5rem, 5vw, 4rem)",
          }}
        >
          <div className="text-label" style={{ opacity: 0.6 }}>
            Portfolio · 2026
          </div>

          <div style={{ overflow: "hidden" }}>
            <AnimatePresence mode="wait">
              <motion.h2
                key={wordIndex}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-display"
                style={{ fontSize: "clamp(2.5rem, 10vw, 8rem)", margin: 0 }}
              >
                {WORDS[wordIndex]}
                <span style={{ color: "var(--color-accent)" }}>.</span>
              </motion.h2>
            </AnimatePresence>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(1rem, 4vw, 2rem)",
            }}
          >
            {count.toString().padStart(3, "0")}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
