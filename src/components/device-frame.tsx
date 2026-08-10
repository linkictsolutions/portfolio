import type { ReactNode } from "react";

type PhoneDevice = "iphone" | "s23-ultra" | "galaxy-s23";
type PhoneFinish = "matte" | "black-metal" | "burgundy";

type PhoneFrameProps = {
  children: ReactNode;
  className?: string;
  /** @deprecated use finish="black-metal" */
  metallic?: boolean;
  device?: PhoneDevice;
  finish?: PhoneFinish;
  /** Screen well color (shows behind contain-fit images). */
  screenBg?: string;
  /**
   * Crop the bottom of screen content (hides in-app bottom nav bars).
   * Value is how much extra image height to push past the clip (e.g. 0.14 = ~14%).
   */
  cropBottom?: number;
};

function deviceGeometry(device: PhoneDevice) {
  switch (device) {
    case "galaxy-s23":
      // Wider / shorter than Ultra — reads larger without eating vertical space
      return {
        aspect: "9 / 17.5",
        radius: 30,
        screenRadius: 20,
        padding: 10,
        punchHole: true,
      };
    case "s23-ultra":
      return {
        aspect: "320 / 700",
        radius: 28,
        screenRadius: 20,
        padding: 9,
        punchHole: true,
      };
    default:
      return {
        aspect: "320 / 660",
        radius: 42,
        screenRadius: 32,
        padding: 8,
        punchHole: false,
      };
  }
}

function shellStyles(finish: PhoneFinish, device: PhoneDevice) {
  const geo = deviceGeometry(device);

  if (finish === "burgundy") {
    return {
      background: `
        linear-gradient(
          148deg,
          #6b2438 0%,
          #3a101c 16%,
          #1a080e 32%,
          #5c1e30 46%,
          #12060a 58%,
          #8a3450 72%,
          #2a0c16 86%,
          #4a1828 100%
        )
      `,
      boxShadow: `
        0 40px 80px -24px rgba(0,0,0,0.75),
        0 0 0 1px rgba(255,190,210,0.28),
        0 0 36px -8px rgba(180,60,90,0.45),
        inset 0 1px 0 rgba(255,220,230,0.4),
        inset 0 -2px 4px rgba(0,0,0,0.55)
      `,
      shine: `
        linear-gradient(
          112deg,
          transparent 0%,
          transparent 36%,
          rgba(255,230,240,0.55) 44%,
          rgba(255,200,220,0.12) 49%,
          transparent 56%,
          transparent 100%
        )
      `,
      ...geo,
    };
  }

  if (finish === "black-metal") {
    return {
      background: `linear-gradient(
        150deg,
        #3a3a42 0%,
        #1a1a1f 18%,
        #0a0a0c 34%,
        #2e2e36 48%,
        #121216 62%,
        #404048 78%,
        #16161c 100%
      )`,
      boxShadow: `
        0 40px 80px -24px rgba(0,0,0,0.7),
        0 0 0 1px rgba(255,255,255,0.22),
        0 0 28px -6px rgba(25,135,238,0.25),
        inset 0 1px 0 rgba(255,255,255,0.28),
        inset 0 -1px 3px rgba(0,0,0,0.55)
      `,
      shine: `
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
      ...geo,
    };
  }

  return {
    background: "linear-gradient(160deg, #2a2a30, #0a0a0c)",
    boxShadow:
      "0 40px 80px -30px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)",
    shine: null as string | null,
    ...geo,
  };
}

/** Realistic phone shell. Content fills the screen area. */
export function PhoneFrame({
  children,
  className,
  metallic = false,
  device = "iphone",
  finish,
  screenBg = "#000",
  cropBottom = 0,
}: PhoneFrameProps) {
  const resolvedFinish: PhoneFinish =
    finish ?? (metallic ? "black-metal" : "matte");
  const shell = shellStyles(resolvedFinish, device);
  const showShine = Boolean(shell.shine);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        borderRadius: shell.radius,
        padding: shell.padding,
        background: shell.background,
        boxShadow: shell.boxShadow,
        aspectRatio: shell.aspect,
        width: "100%",
      }}
    >
      {/* Shine ONLY on the bezel/edge — masked out of the screen */}
      {showShine && (
        <>
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: shell.radius,
              pointerEvents: "none",
              zIndex: 3,
              padding: shell.padding,
              background: shell.shine!,
              opacity: resolvedFinish === "burgundy" ? 0.95 : 0.75,
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: shell.radius,
              pointerEvents: "none",
              zIndex: 3,
              boxShadow:
                resolvedFinish === "burgundy"
                  ? "inset 0 0 0 1px rgba(255,210,220,0.28), inset 1px 0 0 rgba(255,200,210,0.16)"
                  : "inset 0 0 0 1px rgba(255,255,255,0.18), inset 1px 0 0 rgba(255,255,255,0.1)",
            }}
          />
          {(resolvedFinish === "burgundy" ||
            resolvedFinish === "black-metal") && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "10%",
                bottom: "10%",
                left: 1,
                width: Math.max(2, shell.padding - 2),
                borderRadius: 999,
                background:
                  resolvedFinish === "burgundy"
                    ? "linear-gradient(180deg, transparent, rgba(255,220,230,0.65), transparent)"
                    : "linear-gradient(180deg, transparent, rgba(255,255,255,0.55), transparent)",
                zIndex: 3,
                pointerEvents: "none",
                opacity: resolvedFinish === "burgundy" ? 0.85 : 0.7,
              }}
            />
          )}
        </>
      )}

      {/* Camera: Android punch-hole — scales with frame width (~real S23 proportion) */}
      {shell.punchHole ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            // Status-bar scale: ~3.2% of frame width (~11–12px at 360)
            top: `calc(${shell.padding}px + 2.1%)`,
            left: "50%",
            transform: "translateX(-50%)",
            width: "3.2%",
            aspectRatio: "1",
            borderRadius: 999,
            background:
              "radial-gradient(circle at 32% 30%, #4a4a52 0%, #1a1a1e 45%, #050507 75%)",
            boxShadow:
              resolvedFinish === "burgundy"
                ? "0 0 0 1.5px rgba(20,8,12,0.9), 0 0 0 2.5px rgba(255,200,210,0.2)"
                : "0 0 0 1.5px rgba(0,0,0,0.7), 0 0 0 2.5px rgba(255,255,255,0.1)",
            zIndex: 5,
          }}
        />
      ) : (
        <div
          aria-hidden
          style={{
            position: "absolute",
            // Scales with frame — ~real Dynamic Island proportion
            top: `calc(${shell.padding}px + 1.1%)`,
            left: "50%",
            transform: "translateX(-50%)",
            width: "23%",
            aspectRatio: "3.45 / 1",
            borderRadius: 999,
            background: "#050507",
            boxShadow:
              resolvedFinish !== "matte"
                ? "inset 0 1px 2px rgba(0,0,0,0.8), 0 0.5px 0 rgba(255,255,255,0.15)"
                : undefined,
            zIndex: 4,
          }}
        />
      )}

      <div
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          borderRadius: shell.screenRadius,
          overflow: "hidden",
          background: screenBg,
          boxShadow:
            resolvedFinish !== "matte"
              ? "inset 0 0 0 1px rgba(255,255,255,0.06)"
              : undefined,
        }}
      >
        {cropBottom > 0 ? (
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
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
