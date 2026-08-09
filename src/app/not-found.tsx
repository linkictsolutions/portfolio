import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        background: "var(--color-ink)",
        color: "var(--color-paper)",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 className="text-display" style={{ fontSize: "clamp(4rem, 20vw, 16rem)", margin: 0, lineHeight: 0.9 }}>
        404<span style={{ color: "var(--color-accent)" }}>.</span>
      </h1>
      <p style={{ opacity: 0.7, maxWidth: 360 }}>
        This page wandered off. Let&apos;s get you back to the work.
      </p>
      <Link
        href="/"
        data-cursor="hover"
        className="text-label"
        style={{
          border: "1px solid var(--color-paper)",
          borderRadius: 999,
          padding: "0.9rem 1.75rem",
        }}
      >
        Back home ↗
      </Link>
    </main>
  );
}
