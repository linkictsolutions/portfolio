"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { PhoneFrame } from "@/components/device-frame";
import {
  medyAccent,
  medyScreens,
  type MedyScreen,
} from "@/content/medytic";

/**
 * Decision reel — not a dead equal grid.
 * Horizontal snap focus + expand stage. Phone exports stay in devices;
 * panel exports (appointment detail) render as cards so proportions hold.
 */
export function MedyExpandGallery() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState(0);
  const [expanded, setExpanded] = useState<MedyScreen | null>(null);

  const go = useCallback((index: number) => {
    const next = Math.max(0, Math.min(medyScreens.length - 1, index));
    setFocus(next);
    const el = trackRef.current?.querySelector<HTMLElement>(
      `[data-reel-index="${next}"]`,
    );
    el?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [reduced]);

  // Sync focus from scroll position
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const slides = Array.from(
      track.querySelectorAll<HTMLElement>("[data-reel-index]"),
    );
    if (!slides.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; ratio: number } | null = null;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const idx = Number(e.target.getAttribute("data-reel-index"));
          if (Number.isNaN(idx)) continue;
          if (!best || e.intersectionRatio > best.ratio) {
            best = { idx, ratio: e.intersectionRatio };
          }
        }
        if (best) setFocus(best.idx);
      },
      { root: track, threshold: [0.35, 0.55, 0.75] },
    );

    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(null);
      if (e.key === "ArrowRight") {
        const i = medyScreens.findIndex((s) => s.id === expanded.id);
        if (i < medyScreens.length - 1) setExpanded(medyScreens[i + 1]!);
      }
      if (e.key === "ArrowLeft") {
        const i = medyScreens.findIndex((s) => s.id === expanded.id);
        if (i > 0) setExpanded(medyScreens[i - 1]!);
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

  const active = medyScreens[focus]!;

  function onRailKey(e: ReactKeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(focus + 1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(focus - 1);
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setExpanded(active);
    }
  }

  return (
    <section
      style={{
        padding: "clamp(2.75rem, 6vw, 5rem) 0",
        background: `
          radial-gradient(800px 360px at 80% 0%, rgba(25,135,238,0.08), transparent 55%),
          var(--color-paper)
        `,
        color: "var(--color-ink)",
        overflow: "hidden",
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
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="text-label"
                style={{ opacity: 0.45, marginBottom: 8 }}
              >
                {(focus + 1).toString().padStart(2, "0")} /{" "}
                {medyScreens.length.toString().padStart(2, "0")}
                {active.fit === "panel" ? " · Panel" : " · Screen"}
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

        {/* Controls */}
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <RailButton
            label="Previous screen"
            onClick={() => go(focus - 1)}
            disabled={focus === 0}
          >
            ←
          </RailButton>
          <RailButton
            label="Next screen"
            onClick={() => go(focus + 1)}
            disabled={focus === medyScreens.length - 1}
          >
            →
          </RailButton>
          <button
            type="button"
            data-cursor="view"
            data-cursor-label="Expand"
            onClick={() => setExpanded(active)}
            style={{
              marginLeft: 6,
              border: `1.5px solid ${medyAccent}`,
              background: `${medyAccent}14`,
              color: "var(--color-ink)",
              borderRadius: 999,
              padding: "10px 16px",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Expand
          </button>

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              justifyContent: "flex-end",
              maxWidth: 220,
            }}
            aria-hidden
          >
            {medyScreens.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
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

      {/* Filmstrip */}
      <div
        ref={trackRef}
        role="listbox"
        aria-label="MedyTic screens"
        tabIndex={0}
        onKeyDown={onRailKey}
        className="medy-reel"
        style={{
          marginTop: "1.75rem",
          display: "flex",
          gap: "clamp(1rem, 2.5vw, 1.75rem)",
          overflowX: "auto",
          overflowY: "hidden",
          scrollSnapType: "x mandatory",
          scrollPaddingInline: "max(1.25rem, calc(50vw - 600px + 1.25rem))",
          paddingInline: "max(1.25rem, calc(50vw - 600px + 1.25rem))",
          paddingBottom: "1.5rem",
          outline: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {medyScreens.map((s, i) => {
          const isFocus = i === focus;
          const isPanel = s.fit === "panel";
          return (
            <motion.button
              key={s.id}
              type="button"
              role="option"
              aria-selected={isFocus}
              data-reel-index={i}
              data-cursor="view"
              data-cursor-label="Expand"
              onClick={() => {
                if (isFocus) setExpanded(s);
                else go(i);
              }}
              onFocus={() => go(i)}
              animate={
                reduced
                  ? undefined
                  : {
                      scale: isFocus ? 1 : 0.9,
                      opacity: isFocus ? 1 : 0.45,
                      y: isFocus ? 0 : 10,
                    }
              }
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              style={{
                flex: "0 0 auto",
                width: isPanel ? 280 : 220,
                scrollSnapAlign: "center",
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
                textAlign: "left",
                transformOrigin: "center bottom",
              }}
            >
              {isPanel ? (
                <div
                  style={{
                    borderRadius: 20,
                    padding: 10,
                    background: "linear-gradient(160deg, #2a2a30, #0a0a0c)",
                    boxShadow:
                      "0 28px 50px -24px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.12)",
                    aspectRatio: "320 / 660",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.src}
                    alt={s.label}
                    loading="lazy"
                    style={{
                      width: "100%",
                      borderRadius: 14,
                      display: "block",
                      boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
                    }}
                  />
                </div>
              ) : (
                <PhoneFrame finish="black-metal" screenBg="#f3f4f6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.src}
                    alt={s.label}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top center",
                      display: "block",
                    }}
                  />
                </PhoneFrame>
              )}
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
            </motion.button>
          );
        })}
      </div>

      {/* Expand stage */}
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
              zIndex: 90,
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
              initial={reduced ? false : { opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="medy-lightbox"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                zIndex: 91,
                display: "grid",
                gridTemplateColumns:
                  expanded.fit === "panel"
                    ? "minmax(280px, 480px) minmax(0, 320px)"
                    : "minmax(240px, 320px) minmax(0, 340px)",
                gap: "clamp(1.5rem, 4vw, 3rem)",
                alignItems: "center",
                maxWidth: 920,
                width: "100%",
                color: "#f3efe6",
              }}
            >
              {expanded.fit === "panel" ? (
                <div
                  style={{
                    borderRadius: 22,
                    overflow: "hidden",
                    background: "#eaf7ff",
                    boxShadow: "0 40px 80px rgba(0,0,0,0.45)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={expanded.src}
                    alt={expanded.label}
                    style={{ width: "100%", display: "block" }}
                  />
                </div>
              ) : (
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
              )}

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
                    onClick={() => {
                      const i = medyScreens.findIndex(
                        (s) => s.id === expanded.id,
                      );
                      if (i > 0) setExpanded(medyScreens[i - 1]!);
                    }}
                    light
                  >
                    ←
                  </RailButton>
                  <RailButton
                    label="Next"
                    onClick={() => {
                      const i = medyScreens.findIndex(
                        (s) => s.id === expanded.id,
                      );
                      if (i < medyScreens.length - 1)
                        setExpanded(medyScreens[i + 1]!);
                    }}
                    light
                  >
                    →
                  </RailButton>
                  <button
                    type="button"
                    data-cursor="hover"
                    onClick={() => setExpanded(null)}
                    style={{
                      marginLeft: 4,
                      border: "none",
                      background: "transparent",
                      color: "rgba(243,239,230,0.7)",
                      fontWeight: 700,
                      fontSize: 22,
                      lineHeight: 1,
                      cursor: "pointer",
                      padding: "4px 8px",
                    }}
                    aria-label="Close"
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
