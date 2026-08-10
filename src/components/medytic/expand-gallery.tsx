"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PhoneFrame } from "@/components/device-frame";
import { medyAccent, medyScreens, type MedyScreen } from "@/content/medytic";

/** Phone screens only — appointment detail is a modal panel, shown in Appointments. */
const REEL = medyScreens.filter((s) => s.fit !== "panel");
const PHONE_W = 275;
/** Cruise speed while auto-drifting (px / second) */
const AUTO_SPEED = 78;
/** How quickly speed eases toward target (higher = snappier) */
const SPEED_SMOOTH = 4;
/** Wheel / drag glide friction per second */
const GLIDE_FRICTION = 3.8;

/**
 * Decision reel:
 * — Auto-drifts while in view; eases to a pause on mouse enter
 * — Click expands with open motion; expanded prev/next push-slides by direction
 */
export function MedyExpandGallery() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef(0);
  const expandedRef = useRef(false);
  const inViewRef = useRef(false);
  /** Soft-pause cruise while pointer is over the reel */
  const pausedByHoverRef = useRef(false);
  const speedRef = useRef(0);
  const glideRef = useRef(0);
  const targetLeftRef = useRef<number | null>(null);

  const [focus, setFocus] = useState(0);
  const [expanded, setExpanded] = useState<MedyScreen | null>(null);
  const [expandDir, setExpandDir] = useState<1 | -1>(1);
  const [pointerIn, setPointerIn] = useState(false);

  focusRef.current = focus;
  expandedRef.current = expanded !== null;

  const syncFocus = useCallback((track: HTMLElement) => {
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    track.querySelectorAll<HTMLElement>("[data-reel-index]").forEach((el) => {
      const mid = el.offsetLeft + el.offsetWidth / 2;
      const d = Math.abs(mid - center);
      if (d < bestDist) {
        bestDist = d;
        best = Number(el.dataset.reelIndex);
      }
    });
    if (best !== focusRef.current) {
      setFocus(best);
      focusRef.current = best;
    }
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(REEL.length - 1, index));
    const el = track.querySelector<HTMLElement>(
      `[data-reel-index="${next}"]`,
    );
    if (!el) return;

    setFocus(next);
    focusRef.current = next;
    glideRef.current = 0;

    const left = el.offsetLeft - (track.clientWidth / 2 - el.offsetWidth / 2);
    targetLeftRef.current = Math.max(
      0,
      Math.min(left, track.scrollWidth - track.clientWidth),
    );
  }, []);

  // Unified motion loop: auto-drift, soft hover pause, wheel glide
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.28 },
    );
    io.observe(section);

    const onWheel = (e: WheelEvent) => {
      if (expandedRef.current) return;
      e.preventDefault();
      // Hover (or any pointer over reel) — manual glide; cruise already easing down
      if (!pausedByHoverRef.current) return;
      targetLeftRef.current = null;
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      glideRef.current += delta * 1.25;
      glideRef.current = Math.max(-2400, Math.min(2400, glideRef.current));
    };

    track.addEventListener("wheel", onWheel, { passive: false });

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 34) / 1000;
      last = now;
      const el = trackRef.current;
      if (!el) return;

      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;

      const cruise =
        inViewRef.current &&
        !expandedRef.current &&
        !pausedByHoverRef.current
          ? AUTO_SPEED
          : 0;
      const k = 1 - Math.exp(-SPEED_SMOOTH * dt);
      speedRef.current += (cruise - speedRef.current) * k;

      if (targetLeftRef.current !== null) {
        const target = targetLeftRef.current;
        const dist = target - el.scrollLeft;
        if (Math.abs(dist) < 0.4) {
          el.scrollLeft = target;
          targetLeftRef.current = null;
        } else {
          el.scrollLeft += dist * (1 - Math.exp(-7.5 * dt));
        }
        syncFocus(el);
        return;
      }

      const friction = Math.exp(-GLIDE_FRICTION * dt);
      glideRef.current *= friction;
      if (Math.abs(glideRef.current) < 2) glideRef.current = 0;

      const dx = speedRef.current * dt + glideRef.current * dt;
      if (Math.abs(dx) < 0.01 && cruise === 0 && glideRef.current === 0) {
        return;
      }

      let next = el.scrollLeft + dx;
      if (next >= max - 0.5) next = cruise > 0 ? 0 : max;
      if (next < 0) next = 0;
      el.scrollLeft = next;
      syncFocus(el);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      track.removeEventListener("wheel", onWheel);
    };
  }, [reduced, syncFocus]);

  function pauseDrift() {
    pausedByHoverRef.current = true;
    setPointerIn(true);
  }

  function resumeDrift() {
    pausedByHoverRef.current = false;
    glideRef.current = 0;
    setPointerIn(false);
  }
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(null);
      if (e.key === "ArrowRight") stepExpanded(1);
      if (e.key === "ArrowLeft") stepExpanded(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  function stepExpanded(dir: 1 | -1) {
    if (!expanded) return;
    const i = REEL.findIndex((s) => s.id === expanded.id);
    const next = i + dir;
    if (next < 0 || next >= REEL.length) return;
    setExpandDir(dir);
    setExpanded(REEL[next]!);
  }

  const active = REEL[focus]!;

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "clamp(2rem, 4.5vw, 3.5rem) 0 clamp(2.5rem, 5vw, 4rem)",
        background: `
          radial-gradient(800px 360px at 80% 0%, rgba(25,135,238,0.08), transparent 55%),
          var(--color-paper)
        `,
        color: "var(--color-ink)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 3.5rem)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.95fr) minmax(0, 1.15fr)",
            gap: "clamp(1rem, 2.5vw, 2rem)",
            alignItems: "end",
          }}
          className="medy-gallery-head"
        >
          <div>
            <p className="text-label" style={{ color: medyAccent, margin: 0 }}>
              (Screens · decision reel)
            </p>
            <h2
              className="text-display"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 3.1rem)",
                margin: "0.45rem 0 0",
                lineHeight: 0.95,
              }}
            >
              Browse the product.
              <br />
              Expand a decision.
            </h2>
            <p
              style={{
                marginTop: 10,
                maxWidth: 400,
                opacity: 0.55,
                fontSize: "0.88rem",
                lineHeight: 1.4,
              }}
            >
              Auto-drifts when you arrive — hover pauses it so you can explore. Click a phone to expand.
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className="text-label"
                style={{ opacity: 0.45, marginBottom: 6 }}
              >
                {(focus + 1).toString().padStart(2, "0")} /{" "}
                {REEL.length.toString().padStart(2, "0")}
              </div>
              <h3
                className="text-display"
                style={{
                  fontSize: "clamp(1.25rem, 2.5vw, 1.85rem)",
                  margin: 0,
                  lineHeight: 1.05,
                }}
              >
                {active.label}
              </h3>
              <p
                style={{
                  marginTop: 8,
                  maxWidth: 420,
                  opacity: 0.68,
                  lineHeight: 1.4,
                  fontSize: "0.92rem",
                }}
              >
                {active.caption}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <RailButton
            label="Previous screen"
            onClick={() => scrollToIndex(focus - 1)}
            disabled={focus === 0}
          >
            ←
          </RailButton>
          <RailButton
            label="Next screen"
            onClick={() => scrollToIndex(focus + 1)}
            disabled={focus === REEL.length - 1}
          >
            →
          </RailButton>

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
            aria-hidden
          >
            {REEL.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToIndex(i)}
                style={{
                  width: i === focus ? 18 : 7,
                  height: 7,
                  borderRadius: 999,
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  background: i === focus ? medyAccent : "rgba(11,11,13,0.2)",
                  transition: "width 0.3s, background 0.3s",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <div
          ref={trackRef}
          className="medy-reel"
          onPointerEnter={pauseDrift}
          onPointerLeave={resumeDrift}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(1rem, 2vw, 1.4rem)",
            overflowX: "auto",
            overflowY: "hidden",
            scrollSnapType: "none",
            scrollPaddingInline: `max(1.25rem, calc((100vw - ${PHONE_W}px) / 2))`,
            paddingInline: `max(1.25rem, calc((100vw - ${PHONE_W}px) / 2))`,
            paddingTop: 64,
            paddingBottom: 80,
            WebkitOverflowScrolling: "touch",
            touchAction: pointerIn ? "pan-x" : "none",
          }}
        >
          {REEL.map((s, i) => {
            const isFocus = i === focus;
            return (
              <button
                key={s.id}
                type="button"
                data-reel-index={i}
                data-cursor="view"
                data-cursor-label="Expand"
                aria-label={`Expand ${s.label}`}
                onClick={() => {
                  pauseDrift();
                  setFocus(i);
                  setExpandDir(1);
                  setExpanded(s);
                }}
                style={{
                  flex: "0 0 auto",
                  width: PHONE_W,
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                  textAlign: "left",
                  // No transform here — transform on a button clips child box-shadows
                  overflow: "visible",
                }}
              >
                <div
                  style={{
                    padding: "36px 18px 44px",
                    margin: "-36px -18px -20px",
                    opacity: isFocus ? 1 : 0.52,
                    transform: isFocus ? "scale(1)" : "scale(0.94)",
                    transformOrigin: "center center",
                    transition: "opacity 0.45s ease, transform 0.45s ease",
                    overflow: "visible",
                  }}
                >
                  <PhoneFrame finish="black-metal" screenBg="#f3f4f6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.src}
                      alt={s.label}
                      loading="lazy"
                      draggable={false}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "top center",
                        display: "block",
                        pointerEvents: "none",
                      }}
                    />
                  </PhoneFrame>
                </div>
                <div
                  className="text-label"
                  style={{
                    marginTop: 2,
                    opacity: isFocus ? 0.7 : 0.35,
                    transition: "opacity 0.3s",
                  }}
                >
                  {(i + 1).toString().padStart(2, "0")} · {s.label}
                </div>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {pointerIn && !expanded && (
            <motion.p
              key="explore-hint"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="text-label"
              style={{
                position: "absolute",
                left: "50%",
                top: 10,
                bottom: "auto",
                transform: "translateX(-50%)",
                margin: 0,
                padding: "8px 14px",
                borderRadius: 999,
                background: "rgba(11,11,13,0.8)",
                color: "#f3efe6",
                letterSpacing: "0.08em",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                zIndex: 2,
              }}
            >
              ← Scroll or drag to explore →
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            key="expand-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "rgba(7, 10, 18, 0.94)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(1rem, 4vw, 2.5rem)",
            }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setExpanded(null)}
              style={{
                position: "absolute",
                inset: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            />

            <motion.div
              className="medy-lightbox"
              onClick={(e) => e.stopPropagation()}
              initial={
                reduced
                  ? { opacity: 1 }
                  : { opacity: 0, scale: 0.9, y: 36 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.96, y: 16 }
              }
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 28,
                mass: 0.9,
              }}
              style={{
                position: "relative",
                zIndex: 201,
                display: "grid",
                gridTemplateColumns: "minmax(260px, 340px) minmax(0, 340px)",
                gap: "clamp(1.5rem, 4vw, 3rem)",
                alignItems: "center",
                maxWidth: 900,
                width: "100%",
                color: "#f3efe6",
                transformOrigin: "center center",
              }}
            >
              <div style={{ position: "relative", overflow: "visible" }}>
                <AnimatePresence mode="wait" initial={false} custom={expandDir}>
                  <motion.div
                    key={expanded.id}
                    custom={expandDir}
                    initial={
                      reduced
                        ? { opacity: 0 }
                        : { opacity: 0, x: expandDir * 72 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    exit={
                      reduced
                        ? { opacity: 0 }
                        : { opacity: 0, x: expandDir * -64 }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 340,
                      damping: 34,
                      mass: 0.85,
                    }}
                  >
                    <PhoneFrame finish="black-metal" screenBg="#f3f4f6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={expanded.src}
                        alt={expanded.label}
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

              <AnimatePresence mode="wait" initial={false} custom={expandDir}>
                <motion.div
                  key={`${expanded.id}-copy`}
                  custom={expandDir}
                  initial={
                    reduced
                      ? { opacity: 0 }
                      : { opacity: 0, x: expandDir * 28 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  exit={
                    reduced
                      ? { opacity: 0 }
                      : { opacity: 0, x: expandDir * -22 }
                  }
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-label" style={{ color: medyAccent }}>
                    Decision
                  </p>
                  <h3
                    className="text-display"
                    style={{
                      fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                      margin: "0.5rem 0 0",
                      lineHeight: 1,
                    }}
                  >
                    {expanded.label}
                  </h3>
                  <p
                    style={{
                      marginTop: "1rem",
                      fontSize: "1.05rem",
                      lineHeight: 1.5,
                      opacity: 0.8,
                    }}
                  >
                    {expanded.caption}
                  </p>

                  <div
                    style={{
                      marginTop: "1.75rem",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <RailButton
                      label="Previous"
                      light
                      onClick={() => stepExpanded(-1)}
                    >
                      ←
                    </RailButton>
                    <RailButton
                      label="Next"
                      light
                      onClick={() => stepExpanded(1)}
                    >
                      →
                    </RailButton>
                    <button
                      type="button"
                      data-cursor="hover"
                      onClick={() => setExpanded(null)}
                      aria-label="Close"
                      style={{
                        marginLeft: 4,
                        border: "none",
                        background: "transparent",
                        color: "#f3efe6",
                        fontWeight: 500,
                        fontSize: 28,
                        lineHeight: 1,
                        cursor: "pointer",
                        padding: "4px 8px",
                      }}
                    >
                      ×
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function RailButton({
  children,
  onClick,
  disabled,
  label,
  light,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  light?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      data-cursor="hover"
      disabled={disabled}
      onClick={onClick}
      style={{
        width: 40,
        height: 40,
        borderRadius: 999,
        border: light
          ? "1px solid rgba(243,239,230,0.3)"
          : "1px solid rgba(11,11,13,0.18)",
        background: light ? "rgba(255,255,255,0.06)" : "rgba(11,11,13,0.04)",
        color: light ? "#f3efe6" : "var(--color-ink)",
        fontSize: 16,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.35 : 1,
      }}
    >
      {children}
    </button>
  );
}
