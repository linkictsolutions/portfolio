import type { ReactNode } from "react";

type PhoneDevice = "iphone" | "s23-ultra" | "galaxy-s23";
export type PhoneFinish =
  | "matte"
  | "black-metal"
  | "burgundy"
  | "grey"
  | "forest";

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

type MetalTint = {
  stops: string;
  rim: string;
  glow: string;
  highlight: string;
  edge: string;
};

const metalTints: Record<Exclude<PhoneFinish, "matte">, MetalTint> = {
  burgundy: {
    stops: `#6b2438 0%, #3a101c 16%, #1a080e 32%, #5c1e30 46%, #12060a 58%, #8a3450 72%, #2a0c16 86%, #4a1828 100%`,
    rim: "rgba(255,190,210,0.28)",
    glow: "rgba(180,60,90,0.45)",
    highlight: "rgba(255,230,240,0.55)",
    edge: "rgba(255,220,230,0.65)",
  },
  grey: {
    stops: `#9a9aa3 0%, #5c5c66 14%, #2a2a32 30%, #6e6e78 46%, #1c1c22 60%, #8a8a94 76%, #3a3a44 90%, #55555f 100%`,
    rim: "rgba(230,230,235,0.32)",
    glow: "rgba(140,140,155,0.35)",
    highlight: "rgba(255,255,255,0.5)",
    edge: "rgba(255,255,255,0.6)",
  },
  forest: {
    stops: `#2f5c42 0%, #163526 16%, #0a1810 32%, #285038 46%, #07120c 58%, #3d7a55 72%, #12261a 86%, #214830 100%`,
    rim: "rgba(180,230,200,0.28)",
    glow: "rgba(50,140,90,0.4)",
    highlight: "rgba(220,255,235,0.48)",
    edge: "rgba(200,245,220,0.6)",
  },
  "black-metal": {
    stops: `#3a3a42 0%, #1a1a1f 18%, #0a0a0c 34%, #2e2e36 48%, #121216 62%, #404048 78%, #16161c 100%`,
    rim: "rgba(255,255,255,0.22)",
    glow: "rgba(25,135,238,0.25)",
    highlight: "rgba(255,255,255,0.38)",
    edge: "rgba(255,255,255,0.55)",
  },
};

function shellStyles(finish: PhoneFinish, device: PhoneDevice) {
  const geo = deviceGeometry(device);

  if (finish === "matte") {
    return {
      background: "linear-gradient(160deg, #2a2a30, #0a0a0c)",
      boxShadow:
        "0 40px 80px -30px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)",
      shine: null as string | null,
      rimInset: "rgba(255,255,255,0.18)",
      edgeLine: "rgba(255,255,255,0.55)",
      punchRim: "0 0 0 1.5px rgba(0,0,0,0.7), 0 0 0 2.5px rgba(255,255,255,0.1)",
      ...geo,
    };
  }

  const tint = metalTints[finish];
  return {
    background: `linear-gradient(148deg, ${tint.stops})`,
    boxShadow: `
      0 40px 80px -24px rgba(0,0,0,0.75),
      0 0 0 1px ${tint.rim},
      0 0 36px -8px ${tint.glow},
      inset 0 1px 0 ${tint.highlight},
      inset 0 -2px 4px rgba(0,0,0,0.55)
    `,
    shine: `
      linear-gradient(
        112deg,
        transparent 0%,
        transparent 36%,
        ${tint.highlight} 44%,
        rgba(255,255,255,0.08) 49%,
        transparent 56%,
        transparent 100%
      )
    `,
    rimInset: tint.rim,
    edgeLine: tint.edge,
    punchRim: `0 0 0 1.5px rgba(0,0,0,0.75), 0 0 0 2.5px ${tint.rim}`,
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
              opacity: resolvedFinish === "burgundy" ? 0.95 : 0.8,
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
              boxShadow: `inset 0 0 0 1px ${shell.rimInset}, inset 1px 0 0 rgba(255,255,255,0.1)`,
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "10%",
              bottom: "10%",
              left: 1,
              width: Math.max(2, shell.padding - 2),
              borderRadius: 999,
              background: `linear-gradient(180deg, transparent, ${shell.edgeLine}, transparent)`,
              zIndex: 3,
              pointerEvents: "none",
              opacity: 0.8,
            }}
          />
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
            boxShadow: shell.punchRim,
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
