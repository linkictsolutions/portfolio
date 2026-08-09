import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — ${siteConfig.role}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0b0b0d",
          color: "#f3efe6",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, textTransform: "uppercase", opacity: 0.7 }}>
          {siteConfig.role}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 150, fontWeight: 800, lineHeight: 0.9, letterSpacing: -4 }}>
            Design you
          </div>
          <div style={{ display: "flex", fontSize: 150, fontWeight: 800, lineHeight: 0.9, letterSpacing: -4 }}>
            can feel<span style={{ color: "#ff4a1c" }}>.</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, opacity: 0.8 }}>
          <span>{siteConfig.name}</span>
          <span>{siteConfig.location}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
