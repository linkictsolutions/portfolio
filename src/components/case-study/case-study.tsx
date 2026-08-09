"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import type { Project } from "@/content/projects";
import { Media } from "@/components/media";
import { FigmaEmbed } from "@/components/figma-embed";
import { PhoneFrame, BrowserFrame } from "@/components/device-frame";
import { Reveal, WordReveal } from "@/components/reveal";

export function CaseStudy({ project, next }: { project: Project; next: Project }) {
  const coverRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: coverRef,
    offset: ["start start", "end start"],
  });
  const coverY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const coverScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const coverTextY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  const isMobileProject =
    project.cover.kind === "placeholder"
      ? project.cover.variant !== "desktop"
      : project.cover.device !== "desktop";

  return (
    <main style={{ background: "var(--color-paper)", color: "var(--color-ink)" }}>
      {/* COVER */}
      <section
        ref={coverRef}
        style={{
          position: "relative",
          height: "100svh",
          overflow: "hidden",
          background: project.accent,
          color: project.tone === "dark" ? "#f3efe6" : "#0b0b0d",
        }}
      >
        <motion.div style={{ position: "absolute", inset: 0, y: coverY, scale: coverScale, opacity: 0.5 }}>
          <Media item={project.cover} accent={project.accent} />
        </motion.div>

        <motion.div
          style={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "clamp(1.5rem, 5vw, 4rem)",
            y: coverTextY,
          }}
        >
          <div style={{ maxWidth: 1600, margin: "0 auto", width: "100%" }}>
            <span className="text-label">{project.tags.join(" · ")}</span>
            <h1
              className="text-display"
              style={{ fontSize: "clamp(3.5rem, 16vw, 16rem)", margin: "1rem 0 0", lineHeight: 0.85 }}
            >
              <CoverLine>{project.title}</CoverLine>
            </h1>
            <p style={{ maxWidth: 620, marginTop: "1.5rem", fontSize: "clamp(1.1rem, 2vw, 1.6rem)", lineHeight: 1.35 }}>
              {project.subtitle}
            </p>
          </div>
        </motion.div>
      </section>

      {/* OVERVIEW / META */}
      <section style={{ padding: "clamp(4rem, 10vw, 9rem) clamp(1.5rem, 5vw, 4rem)" }}>
        <div
          style={{
            maxWidth: 1600,
            margin: "0 auto",
            display: "grid",
            gap: "clamp(2rem, 6vw, 5rem)",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          <div style={{ gridColumn: "1 / -1", maxWidth: 900 }}>
            <h2 className="text-display" style={{ fontSize: "clamp(1.75rem, 4vw, 3.5rem)", lineHeight: 1.05, margin: 0 }}>
              <WordReveal text={project.summary} />
            </h2>
          </div>
          <MetaBlock label="Client" value={project.client} />
          <MetaBlock label="Year" value={project.year} />
          <MetaBlock label="Role" value={project.role.join(", ")} />
          <MetaBlock label="Discipline" value={project.tags.join(", ")} />
        </div>
      </section>

      {/* CONTEXT + PROBLEM */}
      <section
        style={{
          background: "var(--color-ink)",
          color: "var(--color-paper)",
          padding: "clamp(4rem, 10vw, 9rem) clamp(1.5rem, 5vw, 4rem)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(3rem, 8vw, 6rem)" }}>
          <div>
            <span className="text-label" style={{ color: project.accent }}>(Context)</span>
            <Reveal>
              <p style={{ fontSize: "clamp(1.25rem, 2.5vw, 2rem)", lineHeight: 1.4, marginTop: "1.5rem" }}>
                {project.context}
              </p>
            </Reveal>
          </div>
          <div>
            <span className="text-label" style={{ color: project.accent }}>(The problem)</span>
            <Reveal>
              <p style={{ fontSize: "clamp(1.25rem, 2.5vw, 2rem)", lineHeight: 1.4, marginTop: "1.5rem" }}>
                {project.problem}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PROCESS — GSAP horizontal pin */}
      <ProcessScroll project={project} />

      {/* LIVE PROTOTYPE */}
      <section style={{ padding: "clamp(4rem, 10vw, 9rem) clamp(1.5rem, 5vw, 4rem)", textAlign: "center" }}>
        <div style={{ maxWidth: 1600, margin: "0 auto" }}>
          <span className="text-label" style={{ color: project.accent }}>(Try it yourself)</span>
          <h2 className="text-display" style={{ fontSize: "clamp(2rem, 6vw, 5rem)", margin: "1rem 0 3rem" }}>
            <WordReveal text="A live prototype — not a picture" />
          </h2>
          <div
            style={{
              maxWidth: isMobileProject ? 380 : 1100,
              margin: "0 auto",
            }}
          >
            <FigmaEmbed
              url={project.figmaEmbedUrl}
              accent={project.accent}
              device={isMobileProject ? "mobile" : "desktop"}
              title={project.title}
            />
          </div>
          <p style={{ marginTop: "1.5rem", opacity: 0.6, fontSize: "0.95rem" }}>
            Click to launch the interactive Figma prototype.
          </p>
        </div>
      </section>

      {/* GALLERY */}
      <section style={{ padding: "0 clamp(1.5rem, 5vw, 4rem) clamp(4rem, 10vw, 9rem)" }}>
        <div
          style={{
            maxWidth: 1600,
            margin: "0 auto",
            display: "grid",
            gap: "clamp(1rem, 2vw, 2rem)",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
          }}
        >
          {project.gallery.map((item, i) => (
            <Reveal key={i} delay={(i % 3) * 0.08}>
              <div
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  aspectRatio: item.kind === "placeholder" && item.variant === "mobile" ? "320 / 480" : "16 / 11",
                  background: project.accent,
                }}
              >
                <Media item={item} accent={project.accent} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* INTERACTIONS */}
      <section
        style={{
          background: "var(--color-ink)",
          color: "var(--color-paper)",
          padding: "clamp(4rem, 10vw, 9rem) clamp(1.5rem, 5vw, 4rem)",
        }}
      >
        <div style={{ maxWidth: 1600, margin: "0 auto" }}>
          <span className="text-label" style={{ color: project.accent }}>(Interactions)</span>
          <h2 className="text-display" style={{ fontSize: "clamp(2rem, 6vw, 5rem)", margin: "1rem 0 3rem" }}>
            <WordReveal text="The moments in between" />
          </h2>
          <div
            style={{
              display: "grid",
              gap: "clamp(1.5rem, 3vw, 3rem)",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            }}
          >
            {project.interactions.map((item, i) => {
              const asMobile =
                item.kind === "placeholder"
                  ? item.variant === "mobile"
                  : item.device === "mobile";
              const inner = <Media item={item} accent={project.accent} />;
              return (
                <Reveal key={i} delay={i * 0.1}>
                  <figure style={{ margin: 0 }}>
                    <div style={{ maxWidth: asMobile ? 300 : "100%", margin: "0 auto" }}>
                      {asMobile ? <PhoneFrame>{inner}</PhoneFrame> : <BrowserFrame>{inner}</BrowserFrame>}
                    </div>
                    <figcaption className="text-label" style={{ marginTop: "1rem", opacity: 0.6, textAlign: "center" }}>
                      {item.kind === "video" ? item.label : ""}
                    </figcaption>
                  </figure>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* OUTCOMES */}
      <section style={{ padding: "clamp(4rem, 10vw, 9rem) clamp(1.5rem, 5vw, 4rem)" }}>
        <div style={{ maxWidth: 1600, margin: "0 auto" }}>
          <span className="text-label" style={{ color: project.accent }}>(Outcome)</span>
          <div
            style={{
              marginTop: "2rem",
              display: "grid",
              gap: "clamp(1.5rem, 4vw, 3rem)",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            {project.outcomes.map((o, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ borderTop: `3px solid ${project.accent}`, paddingTop: "1.25rem" }}>
                  <div className="text-display" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 1 }}>
                    {o.metric}
                  </div>
                  <div style={{ marginTop: "0.75rem", opacity: 0.7, fontSize: "1.05rem" }}>{o.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEXT PROJECT */}
      <Link
        href={`/work/${next.slug}`}
        data-cursor="view"
        data-cursor-label="Next"
        style={{ display: "block" }}
      >
        <motion.section
          whileHover="hover"
          style={{
            position: "relative",
            background: next.accent,
            color: next.tone === "dark" ? "#f3efe6" : "#0b0b0d",
            padding: "clamp(4rem, 12vw, 10rem) clamp(1.5rem, 5vw, 4rem)",
            overflow: "hidden",
          }}
        >
          <div style={{ maxWidth: 1600, margin: "0 auto" }}>
            <span className="text-label">(Next project)</span>
            <motion.h2
              variants={{ hover: { x: 20 } }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-display"
              style={{ fontSize: "clamp(3rem, 14vw, 13rem)", margin: "1rem 0 0", lineHeight: 0.9 }}
            >
              {next.title} <span style={{ fontSize: "0.5em", verticalAlign: "middle" }}>↗</span>
            </motion.h2>
            <p style={{ maxWidth: 560, marginTop: "1rem", fontSize: "clamp(1rem, 1.6vw, 1.3rem)" }}>
              {next.subtitle}
            </p>
          </div>
        </motion.section>
      </Link>
    </main>
  );
}

function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <Reveal>
      <div style={{ borderTop: "1px solid rgba(11,11,13,0.2)", paddingTop: "1rem" }}>
        <span className="text-label" style={{ opacity: 0.5 }}>{label}</span>
        <div style={{ marginTop: "0.5rem", fontSize: "1.1rem" }}>{value}</div>
      </div>
    </Reveal>
  );
}

function CoverLine({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <span style={{ display: "block" }}>{children}</span>;
  return (
    <span style={{ display: "block", overflow: "hidden" }}>
      <motion.span
        style={{ display: "block" }}
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** GSAP-pinned horizontal process track (falls back to vertical stack). */
function ProcessScroll({ project }: { project: Project }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const mql = window.matchMedia("(max-width: 900px)");
    if (mql.matches) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    gsap.registerPlugin(ScrollTrigger);
    section.classList.add("process-pinned");

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      return () => tween.kill();
    }, section);

    const onScroll = () => ScrollTrigger.update();
    window.addEventListener("lenis-scroll", onScroll);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("lenis-scroll", onScroll);
      ctx.revert();
      section.classList.remove("process-pinned");
    };
  }, [reduced]);

  const cards = [
    { no: "→", title: "Process", body: project.summary, intro: true },
    ...project.process.map((p) => ({ ...p, intro: false })),
  ];

  return (
    <section
      ref={sectionRef}
      className="process-section"
      style={{ background: "var(--color-paper)", overflow: "hidden" }}
    >
      <div
        ref={trackRef}
        className="process-track"
        style={{ display: "flex", alignItems: "center", gap: "clamp(1.5rem, 3vw, 3rem)" }}
      >
        {cards.map((card, i) => (
          <article
            key={i}
            className="process-card"
            style={{
              background: card.intro ? project.accent : "transparent",
              border: card.intro ? "none" : "1px solid rgba(11,11,13,0.15)",
              color: card.intro && project.tone === "dark" ? "#f3efe6" : "#0b0b0d",
            }}
          >
            {!card.intro && "no" in card && (
              <span className="text-display" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: project.accent }}>
                {(card as { no: string }).no}
              </span>
            )}
            <h3
              className="text-display"
              style={{ fontSize: card.intro ? "clamp(2.5rem, 6vw, 5rem)" : "clamp(1.75rem, 3vw, 2.75rem)", margin: card.intro ? 0 : "1rem 0 0", lineHeight: 1.02 }}
            >
              {card.title}
            </h3>
            <p style={{ marginTop: "1.25rem", fontSize: "clamp(1rem, 1.4vw, 1.25rem)", lineHeight: 1.5, opacity: card.intro ? 0.9 : 0.75 }}>
              {card.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
