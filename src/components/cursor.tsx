"use client";

import { useEffect, useRef, useState } from "react";

type CursorVariant = "default" | "hover" | "view" | "drag" | "play" | "text";

const VARIANT_SIZE: Record<CursorVariant, number> = {
  default: 14,
  hover: 56,
  view: 96,
  drag: 88,
  play: 88,
  text: 8,
};

/**
 * Custom magnetic cursor. Elements opt into states via data attributes:
 *   data-cursor="view" | "drag" | "play" | "hover" | "text"
 *   data-cursor-label="Drag"   (optional text shown inside the cursor)
 * Only active on fine pointers; hidden entirely for touch + reduced motion.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!fine || reduced) return;

    document.body.classList.add("custom-cursor-active");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let rafId = 0;

    const render = () => {
      setEnabled(true);
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      const el = dotRef.current;
      if (el) {
        el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) setVisible(true);

      const el = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor], a, button",
      );
      if (!el) {
        setVariant("default");
        setLabel("");
        return;
      }
      const v = (el.getAttribute("data-cursor") as CursorVariant) || "hover";
      setVariant(v);
      setLabel(el.getAttribute("data-cursor-label") || "");
    };

    const onLeave = () => setVisible(false);
    const onDown = () => dotRef.current?.classList.add("cursor-down");
    const onUp = () => dotRef.current?.classList.remove("cursor-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.body.classList.remove("custom-cursor-active");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!enabled) return null;

  const size = VARIANT_SIZE[variant];
  const showLabel = Boolean(label) && (variant === "view" || variant === "drag" || variant === "play");

  return (
    <div
      ref={dotRef}
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 10000,
        pointerEvents: "none",
        width: size,
        height: size,
        opacity: visible ? 1 : 0,
        transition:
          "width 0.35s var(--ease-out-expo), height 0.35s var(--ease-out-expo), opacity 0.3s, background-color 0.3s, color 0.3s",
        borderRadius: "9999px",
        display: "grid",
        placeItems: "center",
        mixBlendMode: variant === "default" || variant === "text" ? "difference" : "normal",
        backgroundColor:
          variant === "default" || variant === "text"
            ? "#ffffff"
            : "var(--color-accent)",
        color: "var(--color-paper)",
      }}
    >
      {showLabel && (
        <span
          className="text-label"
          style={{ fontSize: "0.6rem", letterSpacing: "0.14em", color: "var(--color-paper)" }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
