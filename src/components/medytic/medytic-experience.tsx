"use client";

import { MedyScrollStage } from "@/components/medytic/scroll-stage";
import { MedyFamilySystem } from "@/components/medytic/family-system";
import { MedyAppointmentSystem } from "@/components/medytic/appointment-system";
import { MedyExpandGallery } from "@/components/medytic/expand-gallery";
import { MedyClosing } from "@/components/medytic/medy-closing";
import { medyBrief } from "@/content/medytic";
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
              <div style={{ marginTop: 6, fontSize: "0.98rem", fontWeight: 600 }}>
                {v}
              </div>
            </div>
          ))}
        </div>
      </section>

      <MedyFamilySystem />
      <MedyAppointmentSystem />
      <MedyExpandGallery />
      <MedyClosing next={next} />
    </main>
  );
}
