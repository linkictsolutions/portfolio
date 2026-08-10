"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PhoneFrame } from "@/components/device-frame";
import { medyAccent } from "@/content/medytic";

const MODES = [
  {
    id: "family" as const,
    label: "Family View",
    src: "/projects/medytic/overview-family.png",
    note: "One glance: who’s healthy, who’s alerting, what to do next.",
  },
  {
    id: "individual" as const,
    label: "Individual View",
    src: "/projects/medytic/overview-individual.png",
    note: "Alerts, AI coach, mood, appointments — denser for one member.",
  },
];

/** Signature system: Family ↔ Individual — real screens, touchable toggle. */
export function MedyFamilySystem() {
  const [mode, setMode] = useState<"family" | "individual">("family");
  const reduced = useReducedMotion();
  const active = MODES.find((m) => m.id === mode)!;

  return (
    <section
      style={{
        padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 4vw, 3.5rem)",
        background: "var(--color-paper)",
        color: "var(--color-ink)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p className="text-label" style={{ color: medyAccent }}>
          (Interactive · Overview)
        </p>
        <h2
          className="text-display"
          style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)", margin: "0.75rem 0 0", lineHeight: 0.95 }}
        >
          One product.
          <br />
          Two modes of care.
        </h2>
        <p style={{ marginTop: "1rem", maxWidth: 520, opacity: 0.7, lineHeight: 1.5 }}>
          Toggle Family / Individual — the same design language, different density.
          This is the overview (not a dashboard dump).
        </p>

        <div
          style={{
            marginTop: "2.5rem",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(260px, 340px)",
            gap: "clamp(1.5rem, 4vw, 3rem)",
            alignItems: "center",
          }}
          className="medy-split"
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                padding: 4,
                borderRadius: 999,
                background: "#e8f4ff",
                border: "1px solid #b7dcff",
                gap: 4,
              }}
            >
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  data-cursor="hover"
                  onClick={() => setMode(m.id)}
                  style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "12px 20px",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    background:
                      mode === m.id
                        ? "linear-gradient(90deg, #7dff9a, #c8fa3c)"
                        : "transparent",
                    color: "#0b0b0d",
                    transition: "background 0.3s",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={mode}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                style={{ marginTop: "1.75rem", fontSize: "1.15rem", lineHeight: 1.45, maxWidth: 420 }}
              >
                {active.note}
              </motion.p>
            </AnimatePresence>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "2rem 0 0",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {[
                "Family Mode + Premium as status, not clutter",
                "Snapshot cards for members before deep links",
                "Primary actions: Add · Remind · Book — always visible",
              ].map((t) => (
                <li
                  key={t}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    fontSize: "0.95rem",
                    opacity: 0.75,
                  }}
                >
                  <span style={{ color: medyAccent, fontWeight: 800 }}>→</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ maxWidth: 340, margin: "0 auto", width: "100%" }}>
            <PhoneFrame>
              <AnimatePresence mode="wait">
                <motion.img
                  key={active.src}
                  src={active.src}
                  alt={active.label}
                  initial={reduced ? false : { opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                    display: "block",
                  }}
                />
              </AnimatePresence>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
