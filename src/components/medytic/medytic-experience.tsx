"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { MedyScrollStage } from "@/components/medytic/scroll-stage";
import { MedyFamilySystem } from "@/components/medytic/family-system";
import { MedyAppointmentSystem } from "@/components/medytic/appointment-system";
import { MedyExpandGallery } from "@/components/medytic/expand-gallery";
import { medyAccent, medyBrief } from "@/content/medytic";
import type { Project } from "@/content/projects";

export function MedyticExperience({ next }: { next: Project }) {
  return (
    <main>
      <MedyScrollStage />

      {/* Tight brief strip — not a consulting wall */}
      <section
        style={{
          background: "var(--color-paper)",
          color: "var(--color-ink)",
          padding: "clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 4vw, 3.5rem)",
          borderBottom: "1px solid rgba(11,11,13,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {[
            ["Role", medyBrief.role],
            ["Client", "MedyTic"],
            ["Platform", "iOS / Android"],
            ["Status", "Shipped"],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-label" style={{ opacity: 0.45 }}>
                {k}
              </div>
              <div style={{ marginTop: 6, fontSize: "0.98rem", fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>
      </section>

      <MedyFamilySystem />
      <MedyAppointmentSystem />
      <MedyExpandGallery />

      {/* Outcomes */}
      <section
        style={{
          padding: "clamp(3.5rem, 8vw, 6rem) clamp(1.25rem, 4vw, 3.5rem)",
          background: "#07080c",
          color: "#f3efe6",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p className="text-label" style={{ color: medyAccent }}>
            (Outcome)
          </p>
          <div
            style={{
              marginTop: "1.75rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "2rem",
            }}
          >
            {medyBrief.outcomes.map((o) => (
              <div key={o.label} style={{ borderTop: `3px solid ${medyAccent}`, paddingTop: "1rem" }}>
                <div className="text-display" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
                  {o.metric}
                </div>
                <div style={{ marginTop: 8, opacity: 0.6 }}>{o.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Link href={`/work/${next.slug}`} data-cursor="view" data-cursor-label="Next" style={{ display: "block" }}>
        <motion.section
          whileHover="hover"
          style={{
            background: next.accent,
            color: next.tone === "dark" ? "#f3efe6" : "#0b0b0d",
            padding: "clamp(3.5rem, 10vw, 7rem) clamp(1.25rem, 4vw, 3.5rem)",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <span className="text-label">(Next)</span>
            <motion.h2
              variants={{ hover: { x: 16 } }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="text-display"
              style={{ fontSize: "clamp(2.5rem, 10vw, 7rem)", margin: "0.75rem 0 0", lineHeight: 0.92 }}
            >
              {next.title} ↗
            </motion.h2>
          </div>
        </motion.section>
      </Link>
    </main>
  );
}
