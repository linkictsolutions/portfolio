"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PhoneFrame } from "@/components/device-frame";
import { medyAccent, medyScreens } from "@/content/medytic";

/** Cynx-inspired: click a screen → expands with decision caption. */
export function MedyExpandGallery() {
  const [active, setActive] = useState<(typeof medyScreens)[number] | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <section
      style={{
        padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 4vw, 3.5rem)",
        background: "var(--color-paper)",
        color: "var(--color-ink)",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <p className="text-label" style={{ color: medyAccent }}>
          (Screens · expand)
        </p>
        <h2
          className="text-display"
          style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)", margin: "0.75rem 0 0", lineHeight: 0.95 }}
        >
          Browse the product.
          <br />
          Expand a decision.
        </h2>

        <div
          style={{
            marginTop: "2.75rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))",
            gap: "clamp(1.25rem, 2.5vw, 2rem)",
          }}
        >
          {medyScreens.map((s, i) => (
            <button
              key={s.id}
              type="button"
              data-cursor="view"
              data-cursor-label="Expand"
              onClick={() => setActive(s)}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <motion.div
                whileHover={reduced ? undefined : { y: -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                <PhoneFrame>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.src}
                    alt={s.label}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top center",
                    }}
                  />
                </PhoneFrame>
                <div
                  className="text-label"
                  style={{ marginTop: 10, opacity: 0.55 }}
                >
                  {(i + 1).toString().padStart(2, "0")} · {s.label}
                </div>
              </motion.div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 90,
              background: "rgba(7,8,12,0.92)",
              display: "grid",
              placeItems: "center",
              padding: "clamp(1rem, 4vw, 2.5rem)",
            }}
          >
            <button
              type="button"
              aria-label="Close expanded screen"
              onClick={() => setActive(null)}
              style={{ position: "absolute", inset: 0, border: "none", background: "transparent" }}
            />
            <motion.div
              initial={reduced ? false : { scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={reduced ? undefined : { scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              style={{
                position: "relative",
                zIndex: 91,
                display: "grid",
                gridTemplateColumns: "minmax(240px, 340px) minmax(0, 360px)",
                gap: "clamp(1.5rem, 4vw, 3rem)",
                alignItems: "center",
                maxWidth: 900,
                width: "100%",
                color: "#f3efe6",
              }}
              className="medy-lightbox"
              onClick={(e) => e.stopPropagation()}
            >
              <PhoneFrame>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.src}
                  alt={active.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                />
              </PhoneFrame>
              <div>
                <p className="text-label" style={{ color: medyAccent }}>
                  Decision
                </p>
                <h3
                  className="text-display"
                  style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", margin: "0.5rem 0 0" }}
                >
                  {active.label}
                </h3>
                <p style={{ marginTop: "1rem", fontSize: "1.1rem", lineHeight: 1.5, opacity: 0.8 }}>
                  {active.caption}
                </p>
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => setActive(null)}
                  style={{
                    marginTop: "2rem",
                    border: "1px solid rgba(243,239,230,0.35)",
                    borderRadius: 999,
                    padding: "12px 22px",
                    background: "transparent",
                    color: "#f3efe6",
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  Close · Esc
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
