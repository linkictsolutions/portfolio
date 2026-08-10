"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhoneFrame } from "@/components/device-frame";
import { medyAccent, medyBrief, medyScreens } from "@/content/medytic";

/** Pinned scroll stage: real screens morph as you scroll. Type supports — never covers UI. */
export function MedyScrollStage() {
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = sectionRef.current;
    if (!section || reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${medyScreens.length * 70}%`,
        pin: true,
        scrub: 0.65,
        onEnter: () => setPinned(true),
        onEnterBack: () => setPinned(true),
        onLeave: () => setPinned(false),
        onLeaveBack: () => setPinned(false),
        onUpdate: (self) => {
          const i = Math.min(
            medyScreens.length - 1,
            Math.floor(self.progress * medyScreens.length),
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
  }, []);

  const screen = medyScreens[index];

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
      {/* Atmosphere */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "-20%",
          background: `
            radial-gradient(ellipse 50% 40% at 20% 30%, ${medyAccent}55, transparent 60%),
            radial-gradient(ellipse 45% 35% at 80% 70%, #12C84933, transparent 55%),
            radial-gradient(ellipse 40% 40% at 50% 100%, #7b3cff22, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1600,
          margin: "0 auto",
          minHeight: "100svh",
          padding: "clamp(5rem, 10vw, 6.5rem) clamp(1.25rem, 4vw, 3.5rem) clamp(2rem, 4vw, 3rem)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(260px, 380px)",
          gap: "clamp(1.5rem, 4vw, 3.5rem)",
          alignItems: "center",
        }}
        className="medy-stage-grid"
      >
        <div>
          <p className="text-label" style={{ color: medyAccent, marginBottom: "1rem" }}>
            {medyBrief.tags.join(" · ")} · {medyBrief.year}
          </p>
          <h1
            className="text-display"
            style={{ fontSize: "clamp(3rem, 10vw, 7.5rem)", margin: 0, lineHeight: 0.88 }}
          >
            {medyBrief.title}
            <span style={{ color: medyAccent }}>.</span>
          </h1>
          <p
            style={{
              marginTop: "1.25rem",
              fontSize: "clamp(1.05rem, 2vw, 1.4rem)",
              maxWidth: 420,
              lineHeight: 1.35,
              opacity: 0.85,
            }}
          >
            {medyBrief.subtitle}
          </p>
          <p
            style={{
              marginTop: "1.5rem",
              maxWidth: 440,
              fontSize: "0.98rem",
              lineHeight: 1.55,
              opacity: 0.65,
            }}
          >
            {medyBrief.line}
          </p>

          <div style={{ marginTop: "2.25rem" }}>
            <div className="text-label" style={{ opacity: 0.45, marginBottom: 8 }}>
              {(index + 1).toString().padStart(2, "0")} / {medyScreens.length.toString().padStart(2, "0")}
              {pinned ? " · scroll" : ""}
            </div>
            <div
              key={screen.id}
              style={{
                borderLeft: `3px solid ${medyAccent}`,
                paddingLeft: 14,
              }}
            >
              <div className="text-display" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
                {screen.label}
              </div>
              <p style={{ margin: "0.5rem 0 0", opacity: 0.7, fontSize: "0.95rem", lineHeight: 1.45 }}>
                {screen.caption}
              </p>
            </div>

            {/* Progress ticks — also clickable for reduced-motion / jump */}
            <div style={{ display: "flex", gap: 6, marginTop: 22, flexWrap: "wrap" }}>
              {medyScreens.map((s, i) => (
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

        <div style={{ width: "100%", maxWidth: 360, margin: "0 auto", position: "relative" }}>
          <PhoneFrame>
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
