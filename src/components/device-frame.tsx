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
        150deg,
        #3a3a42 0%,
        #1a1a1f 18%,
        #0a0a0c 34%,
        #2e2e36 48%,
        #121216 62%,
        #404048 78%,
        #16161c 100%
      )`
    : "linear-gradient(160deg, #2a2a30, #0a0a0c)";

  const shellShadow = metallic
    ? `
      0 40px 80px -24px rgba(0,0,0,0.7),
      0 0 0 1px rgba(255,255,255,0.22),
      0 0 28px -6px rgba(25,135,238,0.25),
      inset 0 1px 0 rgba(255,255,255,0.28),
      inset 0 -1px 3px rgba(0,0,0,0.55)
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
      {/* Edge highlight + thin specular streak (black metal) */}
      {metallic && (
        <>
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 44,
              pointerEvents: "none",
              zIndex: 3,
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,0.14), inset 1px 0 0 rgba(255,255,255,0.08)",
            }}
          />
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
                  118deg,
                  transparent 0%,
                  transparent 42%,
                  rgba(255,255,255,0.38) 48%,
                  rgba(255,255,255,0.05) 51%,
                  transparent 58%,
                  transparent 100%
                )
              `,
              opacity: 0.7,
            }}
          />
        </>
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
          background: "#050507",
          boxShadow: metallic
            ? "inset 0 1px 2px rgba(0,0,0,0.8), 0 0.5px 0 rgba(255,255,255,0.15)"
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
            ? "inset 0 0 0 1px rgba(255,255,255,0.06)"
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
