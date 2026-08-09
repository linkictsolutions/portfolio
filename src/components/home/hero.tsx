"use client";

import { motion, useReducedMotion } from "motion/react";
import { ShaderField } from "@/components/shader-field";
import { siteConfig } from "@/content/site";

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        background: "var(--color-ink)",
        color: "var(--color-paper)",
      }}
    >
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <ShaderField />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(11,11,13,0.35), rgba(11,11,13,0.05) 30%, rgba(11,11,13,0.75))",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "clamp(1.5rem, 5vw, 4rem)",
          paddingBottom: "clamp(2rem, 5vw, 4rem)",
        }}
      >
        <div style={{ maxWidth: 1600, margin: "0 auto", width: "100%" }}>
          <motion.p
            className="text-label"
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.4, duration: 0.8 }}
            style={{ marginBottom: "1.5rem", mixBlendMode: "difference" }}
          >
            {siteConfig.role} — {siteConfig.location}
          </motion.p>

          <h1
            className="text-display"
            style={{
              fontSize: "clamp(3rem, 13vw, 13rem)",
              margin: 0,
              mixBlendMode: "difference",
            }}
          >
            <Line delay={0.5}>Design you</Line>
            <Line delay={0.62}>
              can <span style={{ fontStyle: "italic", fontWeight: 500 }}>feel</span>
              <span style={{ color: "var(--color-accent)" }}>.</span>
            </Line>
          </h1>

          <div
            style={{
              marginTop: "clamp(1.5rem, 4vw, 3rem)",
              display: "flex",
              flexWrap: "wrap",
              gap: "1.5rem",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <motion.p
              initial={reduced ? undefined : { opacity: 0 }}
              animate={reduced ? undefined : { opacity: 1 }}
              transition={{ delay: reduced ? 0 : 1, duration: 1 }}
              style={{ maxWidth: 460, fontSize: "clamp(1rem, 1.4vw, 1.25rem)", lineHeight: 1.5 }}
            >
              {siteConfig.tagline} I turn static mockups into living, interactive
              experiences — explore a few below.
            </motion.p>

            <motion.div
              initial={reduced ? undefined : { opacity: 0 }}
              animate={reduced ? undefined : { opacity: 1 }}
              transition={{ delay: reduced ? 0 : 1.15, duration: 1 }}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: "var(--color-lime)",
                  boxShadow: "0 0 16px var(--color-lime)",
                }}
              />
              <span className="text-label">{siteConfig.availability}</span>
            </motion.div>
          </div>
        </div>
      </div>

      {!reduced && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.4, duration: 1 }}
          style={{
            position: "absolute",
            top: "50%",
            right: "clamp(1.5rem, 5vw, 4rem)",
            zIndex: 1,
            writingMode: "vertical-rl",
          }}
          className="text-label"
        >
          Scroll to explore ↓
        </motion.div>
      )}
    </section>
  );
}

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  const reduced = useReducedMotion();
  if (reduced) return <span style={{ display: "block" }}>{children}</span>;
  return (
    <span style={{ display: "block", overflow: "hidden" }}>
      <motion.span
        style={{ display: "block", willChange: "transform" }}
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
