"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhoneFrame } from "@/components/device-frame";
import { medyAccent, medyBrief, medyStageScreens } from "@/content/medytic";

/** Pinned scroll stage: real screens morph as you scroll. Type supports — never covers UI. */
export function MedyScrollStage() {
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [pinned, setPinned] = useState(false);
  const screens = medyStageScreens;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = sectionRef.current;
    if (!section || reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${screens.length * 70}%`,
        pin: true,
        scrub: 0.65,
        onEnter: () => setPinned(true),
        onEnterBack: () => setPinned(true),
        onLeave: () => setPinned(false),
        onLeaveBack: () => setPinned(false),
        onUpdate: (self) => {
          const i = Math.min(
            screens.length - 1,
            Math.floor(self.progress * screens.length),
          );
          setIndex(i);
        },
      });
    }, section);

    const onScroll = () => ScrollTrigger.update();
    window.addEventListener("lenis-scroll", onScroll);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("lenis-scroll", onScroll);
      ctx.revert();
    };
  }, [screens.length]);

  const screen = screens[index];

  return (
    <section
      ref={sectionRef}
      className="medy-stage"
      style={{
        position: "relative",
        minHeight: "100svh",
        background: "#07080c",
        color: "#f3efe6",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "-10%",
          background: `
            radial-gradient(ellipse 45% 40% at 78% 42%, ${medyAccent}32, transparent 58%),
            radial-gradient(ellipse 35% 35% at 18% 70%, #12C84918, transparent 55%)
          `,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1400,
          margin: "0 auto",
          minHeight: "100svh",
          padding: "clamp(5rem, 9vw, 6rem) clamp(1.5rem, 4vw, 3.5rem) clamp(2rem, 4vw, 3rem)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.15fr) minmax(220px, 300px)",
          gap: "clamp(2rem, 5vw, 4rem)",
          alignItems: "center",
        }}
        className="medy-stage-grid"
      >
        {/* Left: type fills the space — phone stays proportional */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "min(72svh, 640px)",
            gap: "clamp(1.25rem, 3vw, 2rem)",
          }}
        >
          <div>
            <p className="text-label" style={{ color: medyAccent, marginBottom: "1rem" }}>
              {medyBrief.tags.join(" · ")} · {medyBrief.year}
            </p>
            <h1
              className="text-display"
              style={{ fontSize: "clamp(3.25rem, 9vw, 7rem)", margin: 0, lineHeight: 0.9 }}
            >
              {medyBrief.title}
              <span style={{ color: medyAccent }}>.</span>
            </h1>
            <p
              style={{
                marginTop: "1.25rem",
                fontSize: "clamp(1.15rem, 2vw, 1.55rem)",
                lineHeight: 1.35,
                maxWidth: 34ch,
                opacity: 0.9,
              }}
            >
              {medyBrief.subtitle}
            </p>
            <p
              style={{
                marginTop: "1.1rem",
                fontSize: "clamp(0.98rem, 1.3vw, 1.1rem)",
                lineHeight: 1.55,
                maxWidth: 42ch,
                opacity: 0.58,
              }}
            >
              {medyBrief.line}
            </p>
          </div>

          <div
            style={{
              marginTop: "auto",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(243,239,230,0.12)",
            }}
          >
            <div
              className="text-label"
              style={{ opacity: 0.4, marginBottom: 10, letterSpacing: "0.16em" }}
            >
              {(index + 1).toString().padStart(2, "0")} /{" "}
              {screens.length.toString().padStart(2, "0")}
              {pinned ? "  ·  scroll to explore" : ""}
            </div>

            <div
              key={screen.id}
              style={{
                display: "grid",
                gap: "0.35rem",
              }}
            >
              <div
                className="text-display"
                style={{
                  fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                  lineHeight: 1.05,
                  borderLeft: `3px solid ${medyAccent}`,
                  paddingLeft: 16,
                }}
              >
                {screen.label}
              </div>
              <p
                style={{
                  margin: 0,
                  paddingLeft: 19,
                  opacity: 0.68,
                  fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
                  lineHeight: 1.45,
                  maxWidth: 40ch,
                }}
              >
                {screen.caption}
              </p>
            </div>

            <div style={{ display: "flex", gap: 7, marginTop: 22, flexWrap: "wrap" }}>
              {screens.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Show ${s.label}`}
                  data-cursor="hover"
                  onClick={() => setIndex(i)}
                  style={{
                    height: 4,
                    width: i === index ? 36 : 14,
                    borderRadius: 999,
                    padding: 0,
                    border: "none",
                    background: i === index ? medyAccent : "rgba(243,239,230,0.2)",
                    transition: "width 0.35s var(--ease-out-expo), background 0.35s",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>

            <p
              className="text-label"
              style={{ marginTop: 18, opacity: 0.35, letterSpacing: "0.14em" }}
            >
              {medyBrief.role}
            </p>
          </div>
        </div>

        {/* Right: smaller, fully visible device */}
        <div
          style={{
            width: "100%",
            maxWidth: 300,
            margin: "0 auto",
            position: "relative",
          }}
        >
          <PhoneFrame metallic cropBottom={0.14}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={screen.src}
              src={screen.src}
              alt={screen.label}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
                display: "block",
                animation: "medyFadeIn 0.45s var(--ease-out-expo)",
              }}
            />
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}
