"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhoneFrame } from "@/components/device-frame";
import { medyAccent, medyBrief, medyStageScreens } from "@/content/medytic";

const AUTO_MS = 3200;

/** Pinned scroll stage: scrub explores; idle auto-advances with screen motion. */
export function MedyScrollStage() {
  const sectionRef = useRef<HTMLElement>(null);
  const modeRef = useRef<"scroll" | "auto">("auto");
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1);
  const reduced = useReducedMotion();
  const screens = medyStageScreens;

  indexRef.current = index;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const bumpScroll = () => {
      modeRef.current = "scroll";
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${screens.length * 70}%`,
        pin: true,
        scrub: 0.65,
        onToggle: (self) => setPinned(self.isActive),
        onUpdate: (self) => {
          if (modeRef.current !== "scroll") return;
          const i = Math.min(
            screens.length - 1,
            Math.floor(self.progress * screens.length),
          );
          setIndex((prev) => {
            if (i !== prev) setDir(i > prev ? 1 : -1);
            return i;
          });
        },
      });
    }, section);

    window.addEventListener("wheel", bumpScroll, { passive: true });
    window.addEventListener("touchmove", bumpScroll, { passive: true });
    const onScroll = () => ScrollTrigger.update();
    window.addEventListener("lenis-scroll", onScroll);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("wheel", bumpScroll);
      window.removeEventListener("touchmove", bumpScroll);
      window.removeEventListener("lenis-scroll", onScroll);
      ctx.revert();
    };
  }, [screens.length, reduced]);

  // After idle, auto-advance screens while pinned
  useEffect(() => {
    if (!pinned || reduced) return;

    const armAuto = () => {
      modeRef.current = "auto";
    };
    const onInteract = () => {
      modeRef.current = "scroll";
      window.clearTimeout(idle);
      idle = window.setTimeout(armAuto, AUTO_MS);
    };

    let idle = window.setTimeout(armAuto, AUTO_MS);
    window.addEventListener("wheel", onInteract, { passive: true });
    window.addEventListener("touchmove", onInteract, { passive: true });

    const tick = window.setInterval(() => {
      if (modeRef.current !== "auto") return;
      setIndex((prev) => {
        const next = prev >= screens.length - 1 ? 0 : prev + 1;
        setDir(next >= prev || (prev === screens.length - 1 && next === 0) ? 1 : -1);
        return next;
      });
    }, AUTO_MS);

    return () => {
      window.clearTimeout(idle);
      window.clearInterval(tick);
      window.removeEventListener("wheel", onInteract);
      window.removeEventListener("touchmove", onInteract);
    };
  }, [pinned, reduced, screens.length]);

  const screen = screens[index]!;

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

      {/* Center cue */}
      <div
        className="medy-stage-cue"
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          pointerEvents: "none",
          opacity: pinned ? 0.55 : 0.35,
          transition: "opacity 0.4s",
        }}
      >
        <span
          className="text-label"
          style={{
            writingMode: "vertical-rl",
            letterSpacing: "0.22em",
            color: "rgba(243,239,230,0.75)",
          }}
        >
          Scroll down to see more
        </span>
        <span className="medy-stage-arrow" style={{ color: medyAccent, fontSize: 18 }}>
          ↓
        </span>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1400,
          margin: "0 auto",
          minHeight: "100svh",
          padding:
            "clamp(5rem, 9vw, 6rem) clamp(1.5rem, 4vw, 3.5rem) clamp(2rem, 4vw, 3rem)",
          display: "grid",
          gridTemplateColumns: "minmax(280px, 520px) minmax(0, 1fr)",
          gap: "clamp(1.5rem, 3vw, 2.5rem)",
          alignItems: "center",
        }}
        className="medy-stage-grid"
      >
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
            <p
              className="text-label"
              style={{ color: medyAccent, marginBottom: "1rem" }}
            >
              {medyBrief.tags.join(" · ")} · {medyBrief.year}
            </p>
            <h1
              className="text-display"
              style={{
                fontSize: "clamp(3.25rem, 9vw, 7rem)",
                margin: 0,
                lineHeight: 0.9,
              }}
            >
              {medyBrief.title}
              <span style={{ color: medyAccent }}>.</span>
            </h1>
            <p
              style={{
                marginTop: "1.25rem",
                fontSize: "clamp(1.15rem, 2vw, 1.55rem)",
                lineHeight: 1.35,
                maxWidth: "34ch",
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
                maxWidth: "42ch",
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
              {pinned ? "  ·  scroll or wait" : ""}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={screen.id}
                initial={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: dir * 14 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: dir * -10 }
                }
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: "grid", gap: "0.35rem" }}
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
                    maxWidth: "40ch",
                  }}
                >
                  {screen.caption}
                </p>
              </motion.div>
            </AnimatePresence>

            <div
              style={{ display: "flex", gap: 7, marginTop: 22, flexWrap: "wrap" }}
            >
              {screens.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Show ${s.label}`}
                  data-cursor="hover"
                  onClick={() => {
                    modeRef.current = "scroll";
                    setDir(i >= indexRef.current ? 1 : -1);
                    setIndex(i);
                  }}
                  style={{
                    height: 4,
                    width: i === index ? 36 : 14,
                    borderRadius: 999,
                    padding: 0,
                    border: "none",
                    background:
                      i === index ? medyAccent : "rgba(243,239,230,0.2)",
                    transition:
                      "width 0.35s var(--ease-out-expo), background 0.35s",
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

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div style={{ width: "100%", maxWidth: 360 }}>
            <PhoneFrame
              device="galaxy-s23"
              finish="burgundy"
              screenBg="#f3f4f6"
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  background: "#f3f4f6",
                }}
              >
                <AnimatePresence mode="wait" initial={false} custom={dir}>
                  <motion.img
                    key={screen.src}
                    src={screen.src}
                    alt={screen.label}
                    custom={dir}
                    initial={
                      reduced
                        ? { opacity: 0 }
                        : { opacity: 0, x: dir * 48, scale: 1.02 }
                    }
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={
                      reduced
                        ? { opacity: 0 }
                        : { opacity: 0, x: dir * -36, scale: 0.99 }
                    }
                    transition={{
                      duration: 0.42,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top center",
                      display: "block",
                      position: "absolute",
                      inset: 0,
                    }}
                  />
                </AnimatePresence>
              </div>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
