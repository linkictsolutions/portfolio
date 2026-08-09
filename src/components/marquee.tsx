"use client";

interface Props {
  items: string[];
  duration?: number;
  reverse?: boolean;
  separator?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Infinite horizontal marquee (CSS-driven, pauses under reduced-motion). */
export function Marquee({
  items,
  duration = 28,
  reverse = false,
  separator = "✦",
  className,
  style,
}: Props) {
  const content = items.map((item, i) => (
    <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
      <span>{item}</span>
      <span style={{ margin: "0 clamp(1rem, 3vw, 3rem)", opacity: 0.5 }}>{separator}</span>
    </span>
  ));

  return (
    <div
      className={className}
      style={{ overflow: "hidden", whiteSpace: "nowrap", display: "flex", ...style }}
    >
      <div
        className="animate-marquee"
        style={
          {
            display: "inline-flex",
            flexShrink: 0,
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {content}
        {content}
      </div>
    </div>
  );
}
