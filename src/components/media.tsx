"use client";

import { useRef, useState } from "react";
import type { MediaItem } from "@/content/projects";
import { PlaceholderScreen } from "@/components/placeholder-screen";

/**
 * Renders any MediaItem. Videos are muted, loop, playsInline and only load
 * their source when in view (poster shown until then). Placeholders render as
 * designed SVG mockups.
 */
export function Media({
  item,
  accent,
  className,
  fill = true,
  playOnHover = false,
}: {
  item: MediaItem;
  accent: string;
  className?: string;
  fill?: boolean;
  playOnHover?: boolean;
}) {
  const style = fill
    ? ({ width: "100%", height: "100%", objectFit: "cover" as const })
    : undefined;

  if (item.kind === "placeholder") {
    return (
      <PlaceholderScreen
        variant={item.variant}
        accent={accent}
        tone={item.tone}
        label={item.label}
        className={className}
        style={style}
      />
    );
  }

  if (item.kind === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={item.src} alt={item.alt} className={className} style={style} loading="lazy" />;
  }

  return (
    <VideoMedia item={item} accent={accent} className={className} style={style} playOnHover={playOnHover} />
  );
}

function VideoMedia({
  item,
  accent,
  className,
  style,
  playOnHover,
}: {
  item: Extract<MediaItem, { kind: "video" }>;
  accent: string;
  className?: string;
  style?: React.CSSProperties;
  playOnHover: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(!item.src);

  // No real source yet -> show a designed placeholder so nothing looks broken.
  if (failed) {
    return (
      <PlaceholderScreen
        variant={item.device === "desktop" ? "desktop" : item.device === "mobile" ? "mobile" : "detail"}
        accent={accent}
        tone="dark"
        label={item.label}
        className={className}
        style={style}
      />
    );
  }

  const onEnter = () => playOnHover && ref.current?.play().catch(() => {});
  const onLeave = () => {
    if (!playOnHover || !ref.current) return;
    ref.current.pause();
    ref.current.currentTime = 0;
  };

  return (
    <video
      ref={ref}
      className={className}
      style={style}
      muted
      loop
      playsInline
      autoPlay={!playOnHover}
      preload="metadata"
      poster={item.poster || undefined}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onError={() => setFailed(true)}
    >
      <source src={item.src} />
    </video>
  );
}
