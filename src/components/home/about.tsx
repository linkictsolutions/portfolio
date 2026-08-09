"use client";

import { Marquee } from "@/components/marquee";
import { Reveal, WordReveal } from "@/components/reveal";
import { about } from "@/content/about";

export function About() {
  return (
    <section
      id="about"
      style={{
        background: "var(--color-ink)",
        color: "var(--color-paper)",
        padding: "clamp(5rem, 12vw, 12rem) 0",
        overflow: "hidden",
      }}
    >
      <Marquee
        items={about.marquee}
        className="text-display"
        style={{
          fontSize: "clamp(3rem, 12vw, 11rem)",
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(243,239,230,0.35)",
          marginBottom: "clamp(3rem, 8vw, 7rem)",
        }}
      />

      <div
        style={{
          maxWidth: 1600,
          margin: "0 auto",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          display: "grid",
          gap: "clamp(2rem, 6vw, 5rem)",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        <div>
          <span className="text-label" style={{ color: "var(--color-accent)" }}>
            (About)
          </span>
          <h3
            className="text-display"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)", marginTop: "1.5rem", lineHeight: 1.05 }}
          >
            <WordReveal text={about.belief} />
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          <Reveal>
            <p style={{ fontSize: "clamp(1rem, 1.3vw, 1.2rem)", lineHeight: 1.6, opacity: 0.85 }}>
              {about.intro}
            </p>
          </Reveal>

          <div style={{ display: "grid", gap: "2.5rem", gridTemplateColumns: "1fr 1fr" }}>
            <div>
              <span className="text-label" style={{ opacity: 0.5 }}>
                Capabilities
              </span>
              <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0 0" }}>
                {about.capabilities.map((c, i) => (
                  <Reveal as="li" key={c} delay={i * 0.05}>
                    <span style={{ display: "block", padding: "0.35rem 0", fontSize: "1.05rem" }}>
                      {c}
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-label" style={{ opacity: 0.5 }}>
                Tools
              </span>
              <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0 0" }}>
                {about.tools.map((t, i) => (
                  <Reveal as="li" key={t} delay={i * 0.05}>
                    <span style={{ display: "block", padding: "0.35rem 0", fontSize: "1.05rem" }}>
                      {t}
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
