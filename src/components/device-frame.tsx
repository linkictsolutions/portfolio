import type { ReactNode } from "react";

type PhoneFrameProps = {
  children: ReactNode;
  className?: string;
  /** Brushed metal shell so the device reads on dark backgrounds. */
  metallic?: boolean;
  /**
   * Crop the bottom of screen content (hides in-app bottom nav bars).
   * Value is how much extra image height to push past the clip (e.g. 0.14 = ~14%).
   */
  cropBottom?: number;
};

/** Realistic phone shell. Content fills the screen area. */
export function PhoneFrame({
  children,
  className,
  metallic = false,
  cropBottom = 0,
}: PhoneFrameProps) {
  const shellBg = metallic
    ? `linear-gradient(
        145deg,
        #f2f2f4 0%,
        #c8c8d0 12%,
        #8e8e98 28%,
        #e6e6ea 42%,
        #5c5c66 58%,
        #d4d4dc 72%,
        #9a9aa4 86%,
        #ececf0 100%
      )`
    : "linear-gradient(160deg, #2a2a30, #0a0a0c)";

  const shellShadow = metallic
    ? `
      0 50px 90px -28px rgba(0,0,0,0.75),
      0 0 0 1px rgba(255,255,255,0.35),
      0 0 40px -8px rgba(255,255,255,0.12),
      inset 0 1px 0 rgba(255,255,255,0.75),
      inset 0 -2px 4px rgba(0,0,0,0.35)
    `
    : "0 40px 80px -30px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)";

  return (
    <div
      className={className}
      style={{
        position: "relative",
        borderRadius: 44,
        padding: metallic ? 11 : 10,
        background: shellBg,
        boxShadow: shellShadow,
        aspectRatio: "320 / 660",
        width: "100%",
      }}
    >
      {/* Specular shine streak */}
      {metallic && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 44,
            pointerEvents: "none",
            zIndex: 3,
            background: `
              linear-gradient(
                115deg,
                transparent 0%,
                transparent 38%,
                rgba(255,255,255,0.55) 46%,
                rgba(255,255,255,0.08) 52%,
                transparent 62%,
                transparent 100%
              )
            `,
            mixBlendMode: "soft-light",
            opacity: 0.85,
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          top: 18,
          left: "50%",
          transform: "translateX(-50%)",
          width: 92,
          height: 22,
          borderRadius: 999,
          background: metallic
            ? "linear-gradient(180deg, #2a2a30, #0a0a0c)"
            : "#0a0a0c",
          boxShadow: metallic
            ? "inset 0 1px 2px rgba(0,0,0,0.6), 0 0.5px 0 rgba(255,255,255,0.25)"
            : undefined,
          zIndex: 4,
        }}
      />
      <div
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          borderRadius: 34,
          overflow: "hidden",
          background: "#000",
          boxShadow: metallic
            ? "inset 0 0 0 1px rgba(0,0,0,0.35)"
            : undefined,
        }}
      >
        {cropBottom > 0 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: `${100 + cropBottom * 100}%`,
              }}
            >
              {children}
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

/** Browser window shell with a traffic-light chrome bar. */
export function BrowserFrame({
  children,
  className,
  url = "prototype.figma.com",
}: {
  children: ReactNode;
  className?: string;
  url?: string;
}) {
  return (
    <div
      className={className}
      style={{
        borderRadius: 16,
        overflow: "hidden",
        background: "#151519",
        boxShadow:
          "0 40px 90px -35px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06)",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          background: "#1d1d22",
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: 999, background: "#ff5f57" }} />
        <span style={{ width: 12, height: 12, borderRadius: 999, background: "#febc2e" }} />
        <span style={{ width: 12, height: 12, borderRadius: 999, background: "#28c840" }} />
        <div
          style={{
            marginLeft: 12,
            flex: 1,
            height: 24,
            borderRadius: 8,
            background: "#0c0c0e",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.04em",
          }}
        >
          {url}
        </div>
      </div>
      <div style={{ aspectRatio: "960 / 600", background: "#000" }}>{children}</div>
    </div>
  );
}
