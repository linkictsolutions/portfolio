"use client";

import { useState } from "react";
import { PhoneFrame, BrowserFrame } from "@/components/device-frame";
import { PlaceholderScreen } from "@/components/placeholder-screen";

/**
 * Live Figma prototype embed, framed in a device. Click-to-load keeps the
 * heavy Figma iframe off the initial page load. Falls back to an interactive
 * placeholder when no embed URL is set yet.
 */
export function FigmaEmbed({
  url,
  accent,
  device = "mobile",
  title,
}: {
  url?: string;
  accent: string;
  device?: "mobile" | "desktop";
  title: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const hasUrl = Boolean(url);

  const iframe = hasUrl ? (
    <iframe
      title={`${title} — live Figma prototype`}
      src={url}
      allowFullScreen
      style={{ width: "100%", height: "100%", border: "none", background: "#000" }}
    />
  ) : null;

  const poster = (
    <button
      onClick={() => hasUrl && setLoaded(true)}
      data-cursor={hasUrl ? "play" : "hover"}
      data-cursor-label={hasUrl ? "Play" : undefined}
      aria-label={hasUrl ? `Load ${title} prototype` : `${title} prototype coming soon`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "block",
      }}
    >
      <PlaceholderScreen
        variant={device === "desktop" ? "desktop" : "mobile"}
        accent={accent}
        tone="dark"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.1))",
        }}
      >
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            color: "#f3efe6",
          }}
        >
          <span
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: accent,
              display: "grid",
              placeItems: "center",
            }}
          >
            <svg width="22" height="24" viewBox="0 0 22 24" fill="#0b0b0d">
              <path d="M2 2l18 10L2 22z" />
            </svg>
          </span>
          <span className="text-label" style={{ color: "#f3efe6" }}>
            {hasUrl ? "Launch live prototype" : "Live prototype — add Figma link"}
          </span>
        </span>
      </span>
    </button>
  );

  const inner = loaded && iframe ? iframe : poster;

  return device === "mobile" ? (
    <PhoneFrame>{inner}</PhoneFrame>
  ) : (
    <BrowserFrame>{inner}</BrowserFrame>
  );
}
