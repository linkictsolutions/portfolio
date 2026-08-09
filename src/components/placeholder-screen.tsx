import type { CSSProperties } from "react";

type Variant = "mobile" | "desktop" | "detail" | "flow";

interface Props {
  variant: Variant;
  accent: string;
  tone?: "light" | "dark";
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Designed SVG UI mockups used as placeholders. They look like real product
 * screens so the portfolio reads as finished before real exports are added.
 */
export function PlaceholderScreen({
  variant,
  accent,
  tone = "light",
  label,
  className,
  style,
}: Props) {
  const bg = tone === "dark" ? "#0b0b0d" : "#f3efe6";
  const fg = tone === "dark" ? "#f3efe6" : "#0b0b0d";
  const muted = tone === "dark" ? "rgba(243,239,230,0.16)" : "rgba(11,11,13,0.10)";
  const muted2 = tone === "dark" ? "rgba(243,239,230,0.28)" : "rgba(11,11,13,0.2)";

  const common = { className, style, role: "img", "aria-label": label } as const;

  if (variant === "mobile") {
    return (
      <svg viewBox="0 0 320 660" preserveAspectRatio="xMidYMid slice" {...common}>
        <rect width="320" height="660" fill={bg} />
        <circle cx="250" cy="620" r="220" fill={accent} opacity="0.22" />
        <rect x="24" y="60" width="90" height="12" rx="6" fill={muted2} />
        <rect x="24" y="104" width="200" height="40" rx="10" fill={fg} />
        <rect x="24" y="156" width="120" height="18" rx="9" fill={muted2} />
        <rect x="24" y="210" width="272" height="120" rx="20" fill={accent} />
        <rect x="44" y="238" width="90" height="12" rx="6" fill={bg} opacity="0.7" />
        <rect x="44" y="262" width="150" height="26" rx="8" fill={bg} />
        <rect x="24" y="352" width="130" height="120" rx="20" fill={muted} />
        <rect x="166" y="352" width="130" height="120" rx="20" fill={muted} />
        <rect x="24" y="492" width="272" height="60" rx="16" fill={muted} />
        <rect x="90" y="600" width="140" height="40" rx="20" fill={fg} />
        <circle cx="120" cy="620" r="6" fill={bg} />
        <circle cx="160" cy="620" r="6" fill={accent} />
        <circle cx="200" cy="620" r="6" fill={bg} />
        {label && (
          <text x="24" y="90" fill={fg} fontSize="13" fontFamily="monospace" opacity="0.5">
            {label}
          </text>
        )}
      </svg>
    );
  }

  if (variant === "desktop") {
    return (
      <svg viewBox="0 0 960 600" preserveAspectRatio="xMidYMid slice" {...common}>
        <rect width="960" height="600" fill={bg} />
        <circle cx="820" cy="120" r="260" fill={accent} opacity="0.18" />
        <rect x="0" y="0" width="220" height="600" fill={muted} />
        <rect x="32" y="40" width="120" height="16" rx="8" fill={fg} />
        <rect x="32" y="120" width="150" height="12" rx="6" fill={muted2} />
        <rect x="32" y="156" width="120" height="12" rx="6" fill={muted2} />
        <rect x="32" y="192" width="140" height="12" rx="6" fill={muted2} />
        <rect x="280" y="40" width="260" height="34" rx="10" fill={fg} />
        <rect x="280" y="110" width="640" height="150" rx="18" fill={accent} />
        <rect x="308" y="150" width="140" height="14" rx="7" fill={bg} opacity="0.8" />
        <rect x="308" y="180" width="220" height="30" rx="8" fill={bg} />
        <rect x="280" y="290" width="300" height="260" rx="18" fill={muted} />
        <rect x="612" y="290" width="308" height="120" rx="18" fill={muted} />
        <rect x="612" y="430" width="308" height="120" rx="18" fill={muted} />
        {label && (
          <text x="280" y="30" fill={fg} fontSize="14" fontFamily="monospace" opacity="0.5">
            {label}
          </text>
        )}
      </svg>
    );
  }

  if (variant === "detail") {
    return (
      <svg viewBox="0 0 720 540" preserveAspectRatio="xMidYMid slice" {...common}>
        <rect width="720" height="540" fill={bg} />
        <circle cx="360" cy="270" r="150" fill="none" stroke={muted} strokeWidth="28" />
        <circle
          cx="360"
          cy="270"
          r="150"
          fill="none"
          stroke={accent}
          strokeWidth="28"
          strokeLinecap="round"
          strokeDasharray="700 942"
          transform="rotate(-90 360 270)"
        />
        <circle cx="360" cy="270" r="96" fill={accent} opacity="0.12" />
        <rect x="316" y="252" width="88" height="30" rx="8" fill={fg} />
        <rect x="330" y="292" width="60" height="12" rx="6" fill={muted2} />
        {label && (
          <text x="360" y="470" fill={fg} fontSize="16" fontFamily="monospace" textAnchor="middle" opacity="0.5">
            {label}
          </text>
        )}
      </svg>
    );
  }

  // flow
  return (
    <svg viewBox="0 0 960 420" preserveAspectRatio="xMidYMid slice" {...common}>
      <rect width="960" height="420" fill={bg} />
      {[0, 1, 2].map((i) => {
        const x = 80 + i * 300;
        return (
          <g key={i}>
            <rect x={x} y="110" width="200" height="200" rx="20" fill={muted} />
            <rect x={x + 24} y="140" width="80" height="12" rx="6" fill={muted2} />
            <rect x={x + 24} y="168" width="152" height="60" rx="12" fill={i === 1 ? accent : muted2} opacity={i === 1 ? 1 : 0.5} />
            <rect x={x + 24} y="244" width="120" height="12" rx="6" fill={muted2} />
            {i < 2 && (
              <g stroke={accent} strokeWidth="4" fill="none">
                <line x1={x + 210} y1="210" x2={x + 290} y2="210" />
                <path d={`M${x + 278} 200 L${x + 292} 210 L${x + 278} 220`} />
              </g>
            )}
          </g>
        );
      })}
      {label && (
        <text x="80" y="90" fill={fg} fontSize="15" fontFamily="monospace" opacity="0.5">
          {label}
        </text>
      )}
    </svg>
  );
}
