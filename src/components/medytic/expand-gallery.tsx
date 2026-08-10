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

/**
 * Decision reel (fixed):
 * — Drag / arrows / dots browse the strip (caption follows)
 * — One click on a phone opens the expand stage
 * — No fake phone shell, no y-shift, no scrollIntoView page jumps
 */
export function MedyExpandGallery() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollingRef = useRef(false);
  const [focus, setFocus] = useState(0);
  const [expanded, setExpanded] = useState<MedyScreen | null>(null);

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const next = Math.max(0, Math.min(REEL.length - 1, index));
      const el = track.querySelector<HTMLElement>(
        `[data-reel-index="${next}"]`,
      );
      if (!el) return;

      scrollingRef.current = true;
      setFocus(next);

      const left =
        el.offsetLeft - (track.clientWidth / 2 - el.offsetWidth / 2);
      track.scrollTo({
        left: Math.max(0, left),
        behavior: reduced ? "auto" : "smooth",
      });

      window.setTimeout(() => {
        scrollingRef.current = false;
      }, reduced ? 50 : 450);
    },
    [reduced],
  );

  // Focus follows horizontal scroll (ignore while we drive scroll programmatically)
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
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(null);
      if (e.key === "ArrowRight") {
        const i = REEL.findIndex((s) => s.id === expanded.id);
        if (i < REEL.length - 1) setExpanded(REEL[i + 1]!);
      }
      if (e.key === "ArrowLeft") {
        const i = REEL.findIndex((s) => s.id === expanded.id);
        if (i > 0) setExpanded(REEL[i - 1]!);
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [expanded]);

  const active = REEL[focus]!;

  return (
    <section
      style={{
        padding: "clamp(2.75rem, 6vw, 5rem) 0",
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
            gap: "clamp(1.25rem, 3vw, 2.5rem)",
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
                fontSize: "clamp(1.85rem, 4.5vw, 3.4rem)",
                margin: "0.55rem 0 0",
                lineHeight: 0.95,
              }}
            >
              Browse the product.
              <br />
              Expand a decision.
            </h2>
            <p
              style={{
                marginTop: 12,
                maxWidth: 420,
                opacity: 0.55,
                fontSize: "0.9rem",
                lineHeight: 1.45,
              }}
            >
              Scroll the strip or use the arrows. Click any phone to expand it.
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
                style={{ opacity: 0.45, marginBottom: 8 }}
              >
                {(focus + 1).toString().padStart(2, "0")} /{" "}
                {REEL.length.toString().padStart(2, "0")}
              </div>
              <h3
                className="text-display"
                style={{
                  fontSize: "clamp(1.35rem, 2.8vw, 2rem)",
                  margin: 0,
                  lineHeight: 1.05,
                }}
              >
                {active.label}
              </h3>
              <p
                style={{
                  marginTop: 10,
                  maxWidth: 420,
                  opacity: 0.68,
                  lineHeight: 1.45,
                  fontSize: "0.95rem",
                }}
              >
                {active.caption}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          style={{
            marginTop: "1.35rem",
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

      <div
        ref={trackRef}
        className="medy-reel"
        style={{
          marginTop: "1.75rem",
          display: "flex",
          alignItems: "flex-end",
          gap: "clamp(1rem, 2.5vw, 1.75rem)",
          overflowX: "auto",
          overflowY: "visible",
          scrollSnapType: "x mandatory",
          scrollPaddingInline: "max(1.25rem, calc((100vw - 220px) / 2))",
          paddingInline: "max(1.25rem, calc((100vw - 220px) / 2))",
          paddingTop: 12,
          paddingBottom: 28,
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
                setFocus(i);
                setExpanded(s);
              }}
              style={{
                flex: "0 0 auto",
                width: 220,
                scrollSnapAlign: "center",
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
                textAlign: "left",
                opacity: isFocus ? 1 : 0.5,
                transform: isFocus ? "scale(1)" : "scale(0.92)",
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
                  marginTop: 12,
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
            key="expand"
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
              initial={reduced ? false : { opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="medy-lightbox"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                zIndex: 201,
                display: "grid",
                gridTemplateColumns: "minmax(240px, 320px) minmax(0, 340px)",
                gap: "clamp(1.5rem, 4vw, 3rem)",
                alignItems: "center",
                maxWidth: 860,
                width: "100%",
                color: "#f3efe6",
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

              <div>
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
                    onClick={() => {
                      const i = REEL.findIndex((s) => s.id === expanded.id);
                      if (i > 0) setExpanded(REEL[i - 1]!);
                    }}
                  >
                    ←
                  </RailButton>
                  <RailButton
                    label="Next"
                    light
                    onClick={() => {
                      const i = REEL.findIndex((s) => s.id === expanded.id);
                      if (i < REEL.length - 1) setExpanded(REEL[i + 1]!);
                    }}
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
              </div>
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
