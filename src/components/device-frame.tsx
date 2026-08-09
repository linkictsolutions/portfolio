import type { ReactNode } from "react";

/** Realistic phone shell. Content fills the screen area. */
export function PhoneFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        borderRadius: 44,
        padding: 10,
        background: "linear-gradient(160deg, #2a2a30, #0a0a0c)",
        boxShadow:
          "0 40px 80px -30px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)",
        aspectRatio: "320 / 660",
        width: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 18,
          left: "50%",
          transform: "translateX(-50%)",
          width: 92,
          height: 22,
          borderRadius: 999,
          background: "#0a0a0c",
          zIndex: 2,
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
        }}
      >
        {children}
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
