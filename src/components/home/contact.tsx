"use client";

import { motion } from "motion/react";
import { siteConfig } from "@/content/site";
import { WordReveal } from "@/components/reveal";
import { getLenis } from "@/components/smooth-scroll";

export function Contact() {
  const backToTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="contact"
      style={{
        background: "var(--color-accent)",
        color: "var(--color-ink)",
        padding: "clamp(4rem, 10vw, 9rem) clamp(1.5rem, 5vw, 4rem) clamp(2rem, 4vw, 3rem)",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ maxWidth: 1600, margin: "0 auto", width: "100%" }}>
        <span className="text-label">(Contact)</span>
        <h2
          className="text-display"
          style={{ fontSize: "clamp(2.5rem, 9vw, 8rem)", margin: "1.5rem 0 0", lineHeight: 0.95 }}
        >
          <WordReveal text="Have an idea worth" />
          <br />
          <WordReveal text="feeling? Let's talk." delay={0.2} />
        </h2>

        <a
          href={`mailto:${siteConfig.email}`}
          data-cursor="hover"
          style={{ display: "inline-block", marginTop: "clamp(2rem, 5vw, 4rem)" }}
        >
          <motion.span
            whileHover={{ x: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-display"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "1rem",
              fontSize: "clamp(1.5rem, 5vw, 4rem)",
              borderBottom: "3px solid var(--color-ink)",
              paddingBottom: "0.25rem",
            }}
          >
            {siteConfig.email} <span>↗</span>
          </motion.span>
        </a>
      </div>

      <div
        style={{
          maxWidth: 1600,
          margin: "clamp(3rem, 8vw, 6rem) auto 0",
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderTop: "1px solid rgba(11,11,13,0.25)",
          paddingTop: "1.5rem",
        }}
      >
        <ul style={{ listStyle: "none", display: "flex", flexWrap: "wrap", gap: "1.5rem", padding: 0, margin: 0 }}>
          {siteConfig.socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="text-label"
                style={{ transition: "opacity 0.2s" }}
              >
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>

        <div className="text-label" style={{ opacity: 0.7 }}>
          {siteConfig.location} · © {new Date().getFullYear()}
        </div>

        <button onClick={backToTop} data-cursor="hover" className="text-label">
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
