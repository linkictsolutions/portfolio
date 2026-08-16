"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PhoneFrame } from "@/components/device-frame";
import { medyAccent, medyScreens, type MedyScreen } from "@/content/medytic";

/** Phone screens only — appointment detail is a modal panel, shown in Appointments. */
const REEL = medyScreens.filter((s) => s.fit !== "panel");
const PHONE_W = 275;
const AUTO_SPEED = 48;
const GLIDE_FRICTION = 1.35;
const WHEEL_GAIN = 0.38;
const WHEEL_BLEND = 0.72;
const MAX_USER_VELOCITY = 520;
const RESUME_DELAY_MS = 420;
const FOCUS_SETTLE_MS = 220;

/**
 * Decision reel:
 * — Auto-drifts while in view; eases to a pause on mouse enter
 * — Click expands with open motion; expanded prev/next push-slides by direction
 */
export function MedyExpandGallery() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef(0);
  const expandedRef = useRef(false);
  const inViewRef = useRef(false);
  /** Soft-pause cruise while pointer is over the reel */
  const pausedByHoverRef = useRef(false);
  const offsetRef = useRef(0);
  const displayOffsetRef = useRef(0);
  const maxOffsetRef = useRef(0);
  const userVelocityRef = useRef(0);
  const targetOffsetRef = useRef<number | null>(null);
  const userEngagedUntilRef = useRef(0);
  const resumeTimerRef = useRef(0);
  const focusSettleTimerRef = useRef(0);
  const didDragRef = useRef(false);
  const dragRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startScroll: 0,
    offset: 0,
    dragged: false,
    lastX: 0,
    lastT: 0,
    velocity: 0,
  });

  const [focus, setFocus] = useState(0);
  const [expanded, setExpanded] = useState<MedyScreen | null>(null);
  const [expandDir, setExpandDir] = useState<1 | -1>(1);
  const [pointerIn, setPointerIn] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const interactingRef = useRef(false);

  focusRef.current = focus;
  expandedRef.current = expanded !== null;

  const markUserEngaged = useCallback((ms = 900) => {
    userEngagedUntilRef.current = performance.now() + ms;
    if (!interactingRef.current) {
      interactingRef.current = true;
      setInteracting(true);
    }
  }, []);

  const isMoving = useCallback(() => {
    return (
      dragRef.current.active ||
      Math.abs(userVelocityRef.current) > 5 ||
      performance.now() < userEngagedUntilRef.current
    );
  }, []);

  const computeFocus = useCallback((offset: number) => {
    const viewport = trackRef.current;
    const inner = innerRef.current;
    if (!viewport || !inner) return focusRef.current;

    const center = offset + viewport.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    inner.querySelectorAll<HTMLElement>("[data-reel-index]").forEach((el) => {
      const mid = el.offsetLeft + el.offsetWidth / 2;
      const d = Math.abs(mid - center);
      if (d < bestDist) {
        bestDist = d;
        best = Number(el.dataset.reelIndex);
      }
    });
    return best;
  }, []);

  const commitFocus = useCallback((offset: number) => {
    const best = computeFocus(offset);
    if (best !== focusRef.current) {
      setFocus(best);
      focusRef.current = best;
    }
  }, [computeFocus]);

  const scheduleFocusSettle = useCallback(
    (offset: number) => {
      window.clearTimeout(focusSettleTimerRef.current);
      focusSettleTimerRef.current = window.setTimeout(() => {
        if (isMoving()) return;
        commitFocus(offset);
      }, FOCUS_SETTLE_MS);
    },
    [commitFocus, isMoving],
  );

  const measureTrack = useCallback(() => {
    if (
      dragRef.current.active ||
      interactingRef.current ||
      Math.abs(userVelocityRef.current) > 8
    ) {
      return;
    }
    const track = trackRef.current;
    const inner = innerRef.current;
    if (!track || !inner) return;
    maxOffsetRef.current = Math.max(0, inner.scrollWidth - track.clientWidth);
    offsetRef.current = Math.min(offsetRef.current, maxOffsetRef.current);
    displayOffsetRef.current = offsetRef.current;
    inner.style.transform = `translate3d(${-displayOffsetRef.current}px, 0, 0)`;
  }, []);

  const paintOffset = useCallback((offset: number) => {
    const inner = innerRef.current;
    if (!inner) return;
    const next = Math.max(0, Math.min(maxOffsetRef.current, offset));
    offsetRef.current = next;
    displayOffsetRef.current = next;
    inner.style.transform = `translate3d(${-next}px, 0, 0)`;
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const inner = innerRef.current;
    if (!track || !inner) return;
    const next = Math.max(0, Math.min(REEL.length - 1, index));
    const el = inner.querySelector<HTMLElement>(
      `[data-reel-index="${next}"]`,
    );
    if (!el) return;

    setFocus(next);
    focusRef.current = next;
    userVelocityRef.current = 0;

    const left = el.offsetLeft - (track.clientWidth / 2 - el.offsetWidth / 2);
    targetOffsetRef.current = Math.max(
      0,
      Math.min(left, maxOffsetRef.current),
    );
  }, []);

  // Unified motion loop: auto-drift + smooth user wheel / drag glide
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    const inner = innerRef.current;
    if (!section || !track || !inner) return;

    measureTrack();
    const ro = new ResizeObserver(measureTrack);
    ro.observe(track);
    ro.observe(inner);

    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.28 },
    );
    io.observe(section);

    const onWheel = (e: WheelEvent) => {
      if (expandedRef.current || !pausedByHoverRef.current) return;
      if (!section.contains(e.target as Node)) return;
      e.preventDefault();
      e.stopPropagation();
      targetOffsetRef.current = null;
      markUserEngaged();
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      userVelocityRef.current =
        userVelocityRef.current * WHEEL_BLEND + delta * WHEEL_GAIN;
      userVelocityRef.current = Math.max(
        -MAX_USER_VELOCITY,
        Math.min(MAX_USER_VELOCITY, userVelocityRef.current),
      );
    };

    section.addEventListener("wheel", onWheel, { passive: false, capture: true });

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 32) / 1000;
      last = now;
      const innerEl = innerRef.current;
      if (!innerEl) return;

      if (dragRef.current.active) {
        paintOffset(dragRef.current.offset);
        return;
      }

      if (performance.now() > userEngagedUntilRef.current) {
        if (interactingRef.current) {
          interactingRef.current = false;
          setInteracting(false);
        }
      }

      if (targetOffsetRef.current !== null) {
        const target = targetOffsetRef.current;
        const dist = target - offsetRef.current;
        if (Math.abs(dist) < 0.35) {
          paintOffset(target);
          targetOffsetRef.current = null;
          userVelocityRef.current = 0;
          commitFocus(target);
        } else {
          paintOffset(offsetRef.current + dist * (1 - Math.exp(-4.2 * dt)));
        }
        return;
      }

      const userEngaged =
        performance.now() < userEngagedUntilRef.current ||
        Math.abs(userVelocityRef.current) > 4;

      const autoSpeed =
        inViewRef.current &&
        !expandedRef.current &&
        !pausedByHoverRef.current &&
        !userEngaged
          ? AUTO_SPEED
          : 0;

      userVelocityRef.current *= Math.exp(-GLIDE_FRICTION * dt);
      if (Math.abs(userVelocityRef.current) < 0.15) {
        userVelocityRef.current = 0;
      }

      const dx = autoSpeed * dt + userVelocityRef.current * dt;
      if (
        Math.abs(dx) < 0.005 &&
        autoSpeed === 0 &&
        userVelocityRef.current === 0
      ) {
        if (!userEngaged) scheduleFocusSettle(offsetRef.current);
        return;
      }

      let next = offsetRef.current + dx;
      const max = maxOffsetRef.current;
      if (autoSpeed > 0 && next >= max - 0.5) next = 0;
      if (next < 0) next = 0;
      if (next > max) next = max;

      paintOffset(next);

      if (!userEngaged && Math.abs(userVelocityRef.current) < 1) {
        scheduleFocusSettle(next);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      window.clearTimeout(resumeTimerRef.current);
      window.clearTimeout(focusSettleTimerRef.current);
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
      section.removeEventListener("wheel", onWheel, { capture: true });
    };
  }, [reduced, measureTrack, markUserEngaged, paintOffset, commitFocus, scheduleFocusSettle]);

  function pauseDrift() {
    window.clearTimeout(resumeTimerRef.current);
    pausedByHoverRef.current = true;
    setPointerIn(true);
  }

  function resumeDrift() {
    if (performance.now() < userEngagedUntilRef.current) return;
    if (Math.abs(userVelocityRef.current) > 12) return;
    pausedByHoverRef.current = false;
    setPointerIn(false);
  }

  function onTrackPointerEnter() {
    window.clearTimeout(resumeTimerRef.current);
    pauseDrift();
  }

  function onTrackPointerLeave(e: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current.active) return;
    const next = e.relatedTarget as Node | null;
    if (next && trackRef.current?.contains(next)) return;
    window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      if (!dragRef.current.active) resumeDrift();
    }, RESUME_DELAY_MS);
  }

  function onTrackPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (expandedRef.current || e.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;

    pauseDrift();
    markUserEngaged(1200);
    targetOffsetRef.current = null;
    userVelocityRef.current = 0;
    window.clearTimeout(focusSettleTimerRef.current);

    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startScroll: offsetRef.current,
      offset: offsetRef.current,
      dragged: false,
      lastX: e.clientX,
      lastT: performance.now(),
      velocity: 0,
    };

    const onMove = (ev: PointerEvent) => {
      const d = dragRef.current;
      if (!d.active || ev.pointerId !== d.pointerId) return;

      const dx = ev.clientX - d.startX;
      if (!d.dragged && Math.abs(dx) < 4) return;

      if (!d.dragged) {
        d.dragged = true;
        setDragging(true);
      }

      markUserEngaged(1200);
      const now = performance.now();
      const dt = Math.max(now - d.lastT, 1);
      const velocity = ((ev.clientX - d.lastX) / dt) * 1000;
      const next = Math.max(
        0,
        Math.min(maxOffsetRef.current, d.startScroll - dx),
      );
      dragRef.current = {
        ...d,
        offset: next,
        dragged: true,
        lastX: ev.clientX,
        lastT: now,
        velocity,
      };
    };

    const onUp = (ev: PointerEvent) => {
      const d = dragRef.current;
      if (!d.active || ev.pointerId !== d.pointerId) return;

      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);

      const velocity = d.velocity;
      dragRef.current.active = false;
      setDragging(false);

      if (d.dragged) {
        userVelocityRef.current = Math.max(
          -MAX_USER_VELOCITY,
          Math.min(MAX_USER_VELOCITY, -velocity * 0.32),
        );
        markUserEngaged(1400);
        scheduleFocusSettle(d.offset);
        didDragRef.current = true;
        window.setTimeout(() => {
          didDragRef.current = false;
        }, 0);
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
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
        padding: "clamp(1.75rem, 4vw, 3rem) 0 clamp(2rem, 4.5vw, 3.5rem)",
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
              Auto-drifts when you arrive — hover to pause, then scroll or drag sideways. Click a phone to expand.
            </p>
          </div>

          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={active.id}
              initial={reduced ? false : { opacity: 0.72 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0.72 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 8,
                  flexWrap: "wrap",
                }}
              >
                <div className="text-label" style={{ opacity: 0.45, margin: 0 }}>
                  {(focus + 1).toString().padStart(2, "0")} /{" "}
                  {REEL.length.toString().padStart(2, "0")}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 5,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                  aria-hidden
                >
                  {REEL.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => scrollToIndex(i)}
                      aria-label={`Go to ${s.label}`}
                      style={{
                        width: i === focus ? 16 : 6,
                        height: 6,
                        borderRadius: 999,
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        background:
                          i === focus ? medyAccent : "rgba(11,11,13,0.2)",
                        transition: "width 0.3s, background 0.3s",
                      }}
                    />
                  ))}
                </div>
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
      </div>

      <div style={{ position: "relative", marginTop: "0.15rem" }}>
        <div
          ref={trackRef}
          className="medy-reel"
          onPointerEnter={onTrackPointerEnter}
          onPointerLeave={onTrackPointerLeave}
          onPointerDown={onTrackPointerDown}
          style={{
            position: "relative",
            overflow: "hidden",
            paddingTop: 64,
            paddingBottom: 80,
            touchAction: "none",
            cursor: pointerIn ? (dragging ? "grabbing" : "grab") : "default",
          }}
        >
          <div
            ref={innerRef}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(1rem, 2vw, 1.4rem)",
              paddingInline: `max(1.25rem, calc((100vw - ${PHONE_W}px) / 2))`,
              willChange: "transform",
              transform: "translate3d(0, 0, 0)",
            }}
          >
          {REEL.map((s, i) => {
            const isFocus = i === focus;
            const motionLocked = interacting || dragging;
            return (
              <button
                key={s.id}
                type="button"
                data-reel-index={i}
                data-cursor={pointerIn ? "drag" : "view"}
                data-cursor-label={pointerIn ? "Scroll" : "Expand"}
                aria-label={`Expand ${s.label}`}
                onClick={() => {
                  if (didDragRef.current) return;
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
                  cursor: pointerIn ? (dragging ? "grabbing" : "grab") : "pointer",
                  textAlign: "left",
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
                    transition: motionLocked
                      ? "none"
                      : "opacity 0.35s ease, transform 0.35s ease",
                    overflow: "visible",
                    pointerEvents: "none",
                  }}
                >
                  <div data-phone-hit style={{ pointerEvents: "auto" }}>
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
                </div>
                <div
                  className="text-label"
                  style={{
                    marginTop: 2,
                    opacity: isFocus ? 0.7 : 0.35,
                    transition:
                      interacting || dragging ? "none" : "opacity 0.3s",
                    pointerEvents: "none",
                  }}
                >
                  {(i + 1).toString().padStart(2, "0")} · {s.label}
                </div>
              </button>
            );
          })}
          </div>
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
