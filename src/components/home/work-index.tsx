"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import { projects } from "@/content/projects";
import { Media } from "@/components/media";
import { Reveal, WordReveal } from "@/components/reveal";

export function WorkIndex() {
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 350, damping: 40, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 350, damping: 40, mass: 0.6 });
  const listRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    x.set(e.clientX);
    y.set(e.clientY);
  };

  const activeProject = active !== null ? projects[active] : null;

  return (
    <section
      id="work"
      style={{
        position: "relative",
        background: "var(--color-paper)",
        color: "var(--color-ink)",
        padding: "clamp(5rem, 12vw, 12rem) 0",
      }}
    >
      <div style={{ maxWidth: 1600, margin: "0 auto", padding: "0 clamp(1.5rem, 5vw, 4rem)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "clamp(2rem, 5vw, 4rem)",
            gap: "1rem",
          }}
        >
          <h2 className="text-display" style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)", margin: 0 }}>
            <WordReveal text="Selected work" />
          </h2>
          <Reveal>
            <span className="text-label" style={{ opacity: 0.5 }}>
              ({projects.length.toString().padStart(2, "0")})
            </span>
          </Reveal>
        </div>

        <div
          ref={listRef}
          onMouseMove={onMove}
          style={{ borderTop: "1px solid rgba(11,11,13,0.15)" }}
        >
          {projects.map((project, i) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              data-cursor="view"
              data-cursor-label="View"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              style={{
                display: "block",
                borderBottom: "1px solid rgba(11,11,13,0.15)",
                position: "relative",
              }}
            >
              <motion.div
                animate={{
                  paddingLeft: active === i ? "clamp(0.5rem, 2vw, 2.5rem)" : "0rem",
                  color: active !== null && active !== i ? "rgba(11,11,13,0.35)" : "rgba(11,11,13,1)",
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "clamp(1.25rem, 3vw, 2.25rem) 0",
                }}
              >
                <span className="text-label" style={{ opacity: 0.5, width: 44, flexShrink: 0 }}>
                  {(i + 1).toString().padStart(2, "0")}
                </span>

                {/* Inline thumbnail for touch / small screens */}
                <span
                  className="work-thumb"
                  style={{
                    width: 64,
                    height: 44,
                    borderRadius: 8,
                    overflow: "hidden",
                    flexShrink: 0,
                    background: project.accent,
                  }}
                >
                  <Media item={project.hoverPreview} accent={project.accent} />
                </span>

                <span
                  className="text-display"
                  style={{
                    fontSize: "clamp(1.75rem, 5.5vw, 4.5rem)",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {project.title}
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 400,
                      fontSize: "clamp(0.8rem, 1.4vw, 1.1rem)",
                      marginLeft: "1rem",
                      opacity: 0.6,
                    }}
                    className="work-subtitle"
                  >
                    {project.subtitle}
                  </span>
                </span>

                <span
                  className="text-label work-tags"
                  style={{ opacity: 0.55, flexShrink: 0, textAlign: "right" }}
                >
                  {project.tags[0]} · {project.year}
                </span>

                <motion.span
                  animate={{ opacity: active === i ? 1 : 0, x: active === i ? 0 : -8 }}
                  transition={{ duration: 0.3 }}
                  style={{ color: project.accent, flexShrink: 0, fontSize: "1.5rem" }}
                >
                  ↗
                </motion.span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Cursor-following floating preview (fine pointers only via CSS) */}
      <motion.div
        className="work-floating-preview"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: sx,
          y: sy,
          pointerEvents: "none",
          zIndex: 40,
        }}
      >
        <div
          style={{
            width: 300,
            height: 380,
            marginLeft: -150,
            marginTop: -190,
            borderRadius: 16,
            overflow: "hidden",
            opacity: activeProject ? 1 : 0,
            transform: `scale(${activeProject ? 1 : 0.85})`,
            transition:
              "opacity 0.35s var(--ease-out-expo), transform 0.35s var(--ease-out-expo)",
            boxShadow: "0 30px 60px -20px rgba(0,0,0,0.4)",
            background: activeProject?.accent ?? "transparent",
          }}
        >
          {activeProject && (
            <Media
              item={activeProject.hoverPreview}
              accent={activeProject.accent}
              playOnHover={false}
            />
          )}
        </div>
      </motion.div>
    </section>
  );
}
