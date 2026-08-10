"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhoneFrame, type PhoneFinish } from "@/components/device-frame";
import { getLenis } from "@/components/smooth-scroll";
import { medyAccent, medyBrief, medyStageScreens } from "@/content/medytic";

const AUTO_MS = 3200;
const STAGE_FINISHES: PhoneFinish[] = [
  "burgundy",
  "grey",
  "forest",
  "black-metal",
];
const CUE_LETTERS = "SCROLL TO SEE MORE".split("");

/** Pinned stage: idle auto-scrolls through screens once, then user continues. */
export function MedyScrollStage() {
  const sectionRef = useRef<HTMLElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const modeRef = useRef<"auto" | "manual">("auto");
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1);
  const [autoDone, setAutoDone] = useState(false);
  const reduced = useReducedMotion();
  const screens = medyStageScreens;
  const n = screens.length;

  indexRef.current = index;

  const scrollToProgress = (progress: number, duration = 0.95) => {
    const st = stRef.current;
    if (!st) return;
    const p = Math.max(0, Math.min(1, progress));
    const y = st.start + (st.end - st.start) * p;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration, immediate: false });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const progressForIndex = (i: number) => {
    // Land mid-segment so the screen reads clearly while pinned
    if (n <= 1) return 0;
    return Math.min(0.999, (i + 0.55) / n);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${n * 70}%`,
        pin: true,
        scrub: 0.65,
        onToggle: (self) => {
          setPinned(self.isActive);
          if (!self.isActive && self.direction === -1) {
            // Scrolled back above the stage — allow auto again on re-entry
            setAutoDone(false);
            modeRef.current = "auto";
          }
        },
        onUpdate: (self) => {
          const i = Math.min(n - 1, Math.floor(self.progress * n));
          setIndex((prev) => {
            if (i !== prev) setDir(i > prev ? 1 : -1);
            return i;
          });
          if (self.progress >= 0.985) setAutoDone(true);
        },
      });
      stRef.current = st;
    }, section);

    const onScroll = () => ScrollTrigger.update();
    window.addEventListener("lenis-scroll", onScroll);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("lenis-scroll", onScroll);
      stRef.current = null;
      ctx.revert();
    };
  }, [n, reduced]);

  // Idle auto-scroll advances real page scroll through the pin — once, no loop
  useEffect(() => {
    if (!pinned || reduced || autoDone) return;

    const pauseManual = () => {
      modeRef.current = "manual";
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        if (!autoDone) modeRef.current = "auto";
      }, AUTO_MS);
    };

    let idle = window.setTimeout(() => {
      modeRef.current = "auto";
    }, 900);

    window.addEventListener("wheel", pauseManual, { passive: true });
    window.addEventListener("touchmove", pauseManual, { passive: true });
    window.addEventListener("keydown", pauseManual);

    const tick = window.setInterval(() => {
      if (modeRef.current !== "auto") return;
      const st = stRef.current;
      if (!st || !st.isActive) return;

      const current = Math.min(n - 1, Math.floor(st.progress * n));
      if (current >= n - 1 || st.progress >= 0.985) {
        setAutoDone(true);
        modeRef.current = "manual";
        // Ease to the pin end so the next user scroll leaves the section
        scrollToProgress(1, 0.7);
        return;
      }

      scrollToProgress(progressForIndex(current + 1), 1.05);
    }, AUTO_MS);

    return () => {
      window.clearTimeout(idle);
      window.clearInterval(tick);
      window.removeEventListener("wheel", pauseManual);
      window.removeEventListener("touchmove", pauseManual);
      window.removeEventListener("keydown", pauseManual);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- helpers are stable over pin session
  }, [pinned, reduced, autoDone, n]);

  const goToScreen = (i: number) => {
    modeRef.current = "manual";
    setDir(i >= indexRef.current ? 1 : -1);
    scrollToProgress(progressForIndex(i), 0.85);
    if (i >= n - 1) setAutoDone(true);
  };

  const screen = screens[index]!;
  const finish = STAGE_FINISHES[index % STAGE_FINISHES.length]!;

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

      {/* Center cue — stacked letters, not rotated text */}
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
          gap: 14,
          pointerEvents: "none",
          opacity: pinned ? 0.6 : 0.38,
          transition: "opacity 0.4s",
        }}
      >
        <span
          className="text-label"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            color: "rgba(243,239,230,0.78)",
            fontSize: 11,
            letterSpacing: "0.08em",
            lineHeight: 1,
          }}
        >
          {CUE_LETTERS.map((ch, i) =>
            ch === " " ? (
              <span key={`sp-${i}`} style={{ height: 8 }} />
            ) : (
              <span key={`${ch}-${i}`}>{ch}</span>
            ),
          )}
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
              {pinned
                ? autoDone
                  ? "  ·  keep scrolling"
                  : "  ·  auto-scrolling"
                : ""}
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
                  onClick={() => goToScreen(i)}
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
            overflow: "hidden",
            minHeight: "min(72svh, 680px)",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 360,
              aspectRatio: "9 / 17.5",
            }}
          >
            <AnimatePresence mode="sync" initial={false} custom={dir}>
              <motion.div
                key={screen.id}
                custom={dir}
                initial={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: dir * 110 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: dir * -110 }
                }
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                }}
              >
                <PhoneFrame
                  device="galaxy-s23"
                  finish={finish}
                  screenBg="#f3f4f6"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={screen.src}
                    alt={screen.label}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top center",
                      display: "block",
                    }}
                  />
                </PhoneFrame>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
