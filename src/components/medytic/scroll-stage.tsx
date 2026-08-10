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
      {/* Atmosphere — tighter glow so stage feels fuller */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "-10%",
          background: `
            radial-gradient(ellipse 55% 50% at 70% 45%, ${medyAccent}40, transparent 58%),
            radial-gradient(ellipse 40% 40% at 15% 60%, #12C84928, transparent 55%),
            radial-gradient(ellipse 35% 30% at 50% 0%, #7b3cff20, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1480,
          margin: "0 auto",
          minHeight: "100svh",
          padding: "clamp(4.5rem, 8vw, 5.5rem) clamp(1.25rem, 3vw, 2.5rem) clamp(1.25rem, 3vw, 2rem)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.85fr) minmax(300px, 460px)",
          gap: "clamp(1.25rem, 3vw, 2.5rem)",
          alignItems: "center",
        }}
        className="medy-stage-grid"
      >
        <div style={{ maxWidth: 520 }}>
          <p className="text-label" style={{ color: medyAccent, marginBottom: "0.75rem" }}>
            {medyBrief.tags.join(" · ")} · {medyBrief.year}
          </p>
          <h1
            className="text-display"
            style={{ fontSize: "clamp(2.75rem, 8vw, 6.25rem)", margin: 0, lineHeight: 0.9 }}
          >
            {medyBrief.title}
            <span style={{ color: medyAccent }}>.</span>
          </h1>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "clamp(1rem, 1.7vw, 1.3rem)",
              lineHeight: 1.35,
              opacity: 0.88,
            }}
          >
            {medyBrief.subtitle}
          </p>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.95rem",
              lineHeight: 1.5,
              opacity: 0.62,
            }}
          >
            {medyBrief.line}
          </p>

          <div style={{ marginTop: "1.75rem" }}>
            <div className="text-label" style={{ opacity: 0.45, marginBottom: 8 }}>
              {(index + 1).toString().padStart(2, "0")} /{" "}
              {screens.length.toString().padStart(2, "0")}
              {pinned ? " · scroll" : ""}
            </div>
            <div
              key={screen.id}
              style={{
                borderLeft: `3px solid ${medyAccent}`,
                paddingLeft: 14,
              }}
            >
              <div className="text-display" style={{ fontSize: "clamp(1.35rem, 2.8vw, 1.9rem)" }}>
                {screen.label}
              </div>
              <p style={{ margin: "0.45rem 0 0", opacity: 0.7, fontSize: "0.95rem", lineHeight: 1.45 }}>
                {screen.caption}
              </p>
            </div>

            <div style={{ display: "flex", gap: 6, marginTop: 18, flexWrap: "wrap" }}>
              {screens.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Show ${s.label}`}
                  data-cursor="hover"
                  onClick={() => setIndex(i)}
                  style={{
                    height: 3,
                    width: i === index ? 28 : 12,
                    borderRadius: 999,
                    padding: 0,
                    border: "none",
                    background: i === index ? medyAccent : "rgba(243,239,230,0.22)",
                    transition: "width 0.35s var(--ease-out-expo), background 0.35s",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: 460,
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
