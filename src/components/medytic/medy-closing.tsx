"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useReducedMotion,
  animate,
} from "motion/react";
import { PhoneFrame } from "@/components/device-frame";
import { Media } from "@/components/media";
import { medyAccent, medyBrief } from "@/content/medytic";
import type { Project } from "@/content/projects";

function CountUp({
  value,
  active,
}: {
  value: string;
  active: boolean;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const match = value.match(/^(\d+)/);
  const target = match ? Number(match[1]) : null;
  const suffix = value.replace(/^\d+/, "");

  useEffect(() => {
    if (!active || reduced || target === null) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.15,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [active, value, reduced, target, suffix]);

  if (target === null) return <>{value}</>;
  return <>{display}</>;
}

/** Closing beat: proof metrics + next-project portal. */
export function MedyClosing({ next }: { next: Project }) {
  const reduced = useReducedMotion();
  const outcomeRef = useRef<HTMLElement>(null);
  const inView = useInView(outcomeRef, { once: true, amount: 0.4 });

  return (
    <>
      <section
        ref={outcomeRef}
        style={{
          padding: "clamp(3.5rem, 8vw, 6rem) clamp(1.25rem, 4vw, 3.5rem)",
          background: "#07080c",
          color: "#f3efe6",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p className="text-label" style={{ color: medyAccent, margin: 0 }}>
            (Outcome)
          </p>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={inView ? { opacity: 0.65, y: 0 } : undefined}
            transition={{ duration: 0.45, delay: 0.05 }}
            style={{
              marginTop: "0.85rem",
              maxWidth: 520,
              fontSize: "1.05rem",
              lineHeight: 1.5,
            }}
          >
            From brief to shipped product — a family-care system patients and
            caregivers can actually use.
          </motion.p>

          <div
            style={{
              marginTop: "2.25rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "clamp(1.5rem, 3vw, 2.5rem)",
            }}
          >
            {medyBrief.outcomes.map((o, i) => (
              <motion.div
                key={o.label}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{
                  duration: 0.5,
                  delay: 0.12 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  borderTop: `3px solid ${medyAccent}`,
                  paddingTop: "1.1rem",
                }}
              >
                <div
                  className="text-display"
                  style={{ fontSize: "clamp(2.75rem, 6.5vw, 4.75rem)", lineHeight: 0.95 }}
                >
                  <CountUp value={o.metric} active={inView} />
                </div>
                <div style={{ marginTop: 10, opacity: 0.55 }}>{o.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Link
        href={`/work/${next.slug}`}
        data-cursor="view"
        data-cursor-label="Next"
        style={{ display: "block", textDecoration: "none" }}
      >
        <motion.section
          initial="rest"
          whileHover="hover"
          style={{
            position: "relative",
            background: next.accent,
            color: next.tone === "dark" ? "#f3efe6" : "#0b0b0d",
            padding: "clamp(3.5rem, 9vw, 6.5rem) clamp(1.25rem, 4vw, 3.5rem)",
            overflow: "hidden",
          }}
        >
          <motion.div
            variants={{
              rest: { x: "28%", opacity: 0.35 },
              hover: { x: "8%", opacity: 0.95 },
            }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
            aria-hidden
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              width: "min(280px, 42vw)",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <PhoneFrame finish="black-metal" screenBg="#0b0b0d">
              <div style={{ width: "100%", height: "100%", minHeight: 420 }}>
                <Media item={next.cover} accent={next.accent} fill />
              </div>
            </PhoneFrame>
          </motion.div>

          <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <span className="text-label">(Next)</span>
            <motion.h2
              variants={{ rest: { x: 0 }, hover: { x: 14 } }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="text-display"
              style={{
                fontSize: "clamp(2.5rem, 10vw, 7rem)",
                margin: "0.75rem 0 0",
                lineHeight: 0.92,
              }}
            >
              {next.title} ↗
            </motion.h2>
            <motion.p
              variants={{ rest: { opacity: 0.55 }, hover: { opacity: 0.85 } }}
              style={{
                marginTop: "1rem",
                maxWidth: 360,
                fontSize: "1rem",
                lineHeight: 1.45,
              }}
            >
              {next.subtitle}
            </motion.p>
          </div>
        </motion.section>
      </Link>
    </>
  );
}
