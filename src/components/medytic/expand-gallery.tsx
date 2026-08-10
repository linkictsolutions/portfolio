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
const PHONE_W = 300;
const AUTOPLAY_MS = 2600;

/**
 * Decision reel:
 * — Larger proportional phones; auto-scrolls left on enter; pauses on hover
 * — Click expands; expanded prev/next slides with direction
 */
export function MedyExpandGallery() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollingRef = useRef(false);
  const pausedRef = useRef(false);
  const inViewRef = useRef(false);
  const focusRef = useRef(0);

  const [focus, setFocus] = useState(0);
  const [expanded, setExpanded] = useState<MedyScreen | null>(null);
  const [expandDir, setExpandDir] = useState<1 | -1>(1);

  focusRef.current = focus;

  const scrollToIndex = useCallback(
    (index: number, smooth = true) => {
      const track = trackRef.current;
      if (!track) return;
      const next = Math.max(0, Math.min(REEL.length - 1, index));
      const el = track.querySelector<HTMLElement>(
        `[data-reel-index="${next}"]`,
      );
      if (!el) return;

      scrollingRef.current = true;
      setFocus(next);
      focusRef.current = next;

      const left =
        el.offsetLeft - (track.clientWidth / 2 - el.offsetWidth / 2);
      track.scrollTo({
        left: Math.max(0, left),
        behavior: reduced || !smooth ? "auto" : "smooth",
      });

      window.setTimeout(
        () => {
          scrollingRef.current = false;
        },
        reduced || !smooth ? 40 : 480,
      );
    },
    [reduced],
  );

  // Focus follows horizontal scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    const onScroll = () => {
      if (scrollingRef.current) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
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
        setFocus(best);
        focusRef.current = best;
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Autoplay when section enters view — advances left→right; pauses on pointer
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.35 },
    );
    io.observe(section);

    const id = window.setInterval(() => {
      if (!inViewRef.current || pausedRef.current || expanded) return;
      const cur = focusRef.current;
      const next = cur >= REEL.length - 1 ? 0 : cur + 1;
      scrollToIndex(next);
    }, AUTOPLAY_MS);

    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [reduced, expanded, scrollToIndex]);

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
              Auto-scrolls when you arrive — hover to take over. Click a phone to expand.
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
            onClick={() => {
              pausedRef.current = true;
              scrollToIndex(focus - 1);
            }}
            disabled={focus === 0}
          >
            ←
          </RailButton>
          <RailButton
            label="Next screen"
            onClick={() => {
              pausedRef.current = true;
              scrollToIndex(focus + 1);
            }}
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
                onClick={() => {
                  pausedRef.current = true;
                  scrollToIndex(i);
                }}
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

      <div
        ref={trackRef}
        className="medy-reel"
        onPointerEnter={() => {
          pausedRef.current = true;
        }}
        onPointerLeave={() => {
          pausedRef.current = false;
        }}
        style={{
          marginTop: "0.85rem",
          display: "flex",
          alignItems: "flex-end",
          gap: "clamp(1.1rem, 2.2vw, 1.6rem)",
          overflowX: "auto",
          overflowY: "visible",
          scrollSnapType: "x mandatory",
          scrollPaddingInline: `max(1.25rem, calc((100vw - ${PHONE_W}px) / 2))`,
          paddingInline: `max(1.25rem, calc((100vw - ${PHONE_W}px) / 2))`,
          paddingTop: 8,
          paddingBottom: 20,
          WebkitOverflowScrolling: "touch",
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
                pausedRef.current = true;
                setFocus(i);
                setExpandDir(1);
                setExpanded(s);
              }}
              style={{
                flex: "0 0 auto",
                width: PHONE_W,
                scrollSnapAlign: "center",
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
                textAlign: "left",
                opacity: isFocus ? 1 : 0.48,
                transform: isFocus ? "scale(1)" : "scale(0.9)",
                transformOrigin: "center bottom",
                transition: "opacity 0.35s ease, transform 0.35s ease",
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
              <div
                className="text-label"
                style={{
                  marginTop: 10,
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

            <div
              className="medy-lightbox"
              onClick={(e) => e.stopPropagation()}
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
              }}
            >
              <div style={{ position: "relative", overflow: "hidden" }}>
                <AnimatePresence mode="wait" custom={expandDir}>
                  <motion.div
                    key={expanded.id}
                    custom={expandDir}
                    initial={
                      reduced
                        ? { opacity: 0 }
                        : { opacity: 0, x: expandDir * 56, scale: 0.96 }
                    }
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={
                      reduced
                        ? { opacity: 0 }
                        : { opacity: 0, x: expandDir * -48, scale: 0.96 }
                    }
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
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

              <AnimatePresence mode="wait" custom={expandDir}>
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
                      : { opacity: 0, x: expandDir * -20 }
                  }
                  transition={{ duration: 0.28 }}
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
            </div>
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
