"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PhoneFrame } from "@/components/device-frame";
import { medyAccent } from "@/content/medytic";

type Ticket = {
  id: string;
  doctor: string;
  when: string;
  time: string;
  status: "upcoming" | "attended" | "missed";
};

const TICKETS: Ticket[] = [
  {
    id: "lee",
    doctor: "Dr. Lee (GP)",
    when: "This week · Mon",
    time: "9:00am",
    status: "upcoming",
  },
  {
    id: "chen",
    doctor: "Dr. Chen",
    when: "This week · Thu",
    time: "2:30pm",
    status: "upcoming",
  },
  {
    id: "park",
    doctor: "Dr. Park",
    when: "Past · Attended",
    time: "11:00am",
    status: "attended",
  },
  {
    id: "ross",
    doctor: "Dr. Ross",
    when: "Past · Missed",
    time: "4:15pm",
    status: "missed",
  },
];

const STATUS = {
  upcoming: { label: "Upcoming", color: "#1987EE", soft: "#d7ecff" },
  attended: { label: "Attended", color: "#1a9d5c", soft: "#d8f5e6" },
  missed: { label: "Missed", color: "#e23d3d", soft: "#ffe0e0" },
} as const;

const ACTIONS = ["Join visit", "Reschedule", "Add to calendar"] as const;

/**
 * Unique appointments stage — not dual-phone theater.
 * Ticket rail drives a single device; detail opens as an in-phone sheet
 * (matches the real detail export, which is a panel — not a full screen).
 */
export function MedyAppointmentSystem() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Ticket["status"]>("all");
  const reduced = useReducedMotion();
  const open = selected !== null;
  const active = TICKETS.find((t) => t.id === selected);

  const visible = TICKETS.filter((t) => filter === "all" || t.status === filter);

  function pick(id: string) {
    setSelected((prev) => (prev === id ? null : id));
  }

  return (
    <section
      style={{
        padding: "clamp(2.75rem, 6vw, 5rem) clamp(1.25rem, 4vw, 3.5rem)",
        background: `
          radial-gradient(900px 420px at 12% 0%, rgba(25,135,238,0.2), transparent 55%),
          radial-gradient(700px 380px at 90% 110%, rgba(40,180,170,0.1), transparent 50%),
          #0b1220
        `,
        color: "#eef3fb",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(240px, 300px)",
            gap: "clamp(1.5rem, 4vw, 3rem)",
            alignItems: "start",
          }}
          className="medy-appt-grid"
        >
          {/* Copy + ticket rail */}
          <div>
            <p className="text-label" style={{ color: "#7ec4ff", margin: 0 }}>
              (Interactive · Appointments)
            </p>
            <h2
              className="text-display"
              style={{
                fontSize: "clamp(1.85rem, 4.5vw, 3.4rem)",
                margin: "0.55rem 0 0",
                lineHeight: 0.95,
              }}
            >
              Status first.
              <br />
              Then the action.
            </h2>
            <p
              style={{
                marginTop: "0.85rem",
                maxWidth: 460,
                opacity: 0.68,
                lineHeight: 1.5,
                fontSize: "0.95rem",
              }}
            >
              Color-coded tickets pull the list into focus. Pick one — detail
              pops centered on the same device, with Join / Reschedule / Calendar in reach.
            </p>

            {/* Status filters */}
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {(
                [
                  ["all", "All", "#8eb6d8"],
                  ["upcoming", STATUS.upcoming.label, STATUS.upcoming.color],
                  ["attended", STATUS.attended.label, STATUS.attended.color],
                  ["missed", STATUS.missed.label, STATUS.missed.color],
                ] as const
              ).map(([id, label, color]) => {
                const on = filter === id;
                return (
                  <button
                    key={id}
                    type="button"
                    data-cursor="hover"
                    onClick={() => {
                      setFilter(id);
                      setSelected(null);
                    }}
                    style={{
                      border: on ? `1.5px solid ${color}` : "1.5px solid rgba(255,255,255,0.12)",
                      background: on ? `${color}22` : "rgba(255,255,255,0.04)",
                      color: on ? "#fff" : "rgba(238,243,251,0.7)",
                      borderRadius: 999,
                      padding: "8px 14px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      letterSpacing: "0.02em",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 7,
                        height: 7,
                        borderRadius: 999,
                        background: color,
                        marginRight: 8,
                        verticalAlign: "middle",
                      }}
                    />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Ticket rail */}
            <div
              style={{
                marginTop: "1.35rem",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                maxWidth: 520,
              }}
            >
              <AnimatePresence mode="popLayout">
                {visible.map((t, i) => {
                  const st = STATUS[t.status];
                  const isOn = selected === t.id;
                  return (
                    <motion.button
                      key={t.id}
                      type="button"
                      layout={!reduced}
                      data-cursor="view"
                      data-cursor-label={isOn ? "Close" : "Open"}
                      onClick={() => pick(t.id)}
                      initial={reduced ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
                      transition={{ delay: reduced ? 0 : i * 0.04, duration: 0.3 }}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "6px 1fr auto",
                        gap: 14,
                        alignItems: "center",
                        textAlign: "left",
                        padding: "14px 16px",
                        borderRadius: 16,
                        border: isOn
                          ? `1.5px solid ${st.color}`
                          : "1.5px solid rgba(255,255,255,0.1)",
                        background: isOn
                          ? `linear-gradient(105deg, ${st.color}28, rgba(255,255,255,0.06))`
                          : "rgba(255,255,255,0.04)",
                        boxShadow: isOn ? `0 0 0 4px ${st.color}22` : "none",
                        color: "inherit",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          alignSelf: "stretch",
                          borderRadius: 999,
                          background: st.color,
                          minHeight: 36,
                        }}
                      />
                      <span>
                        <span
                          style={{
                            display: "block",
                            fontWeight: 700,
                            fontSize: 14,
                          }}
                        >
                          {t.doctor}
                        </span>
                        <span
                          style={{
                            display: "block",
                            marginTop: 4,
                            fontSize: 12,
                            opacity: 0.55,
                          }}
                        >
                          {t.when} · {t.time}
                        </span>
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: st.color,
                          background: `${st.color}18`,
                          padding: "6px 10px",
                          borderRadius: 999,
                        }}
                      >
                        {st.label}
                      </span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Action strip — only when a ticket is open */}
            <AnimatePresence>
              {open && active && (
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: 6 }}
                  style={{ marginTop: "1.35rem", maxWidth: 520 }}
                >
                  <p
                    className="text-label"
                    style={{ opacity: 0.45, marginBottom: 10 }}
                  >
                    Detail actions
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {ACTIONS.map((a, i) => (
                      <motion.span
                        key={a}
                        initial={reduced ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 + i * 0.06 }}
                        style={{
                          borderRadius: 12,
                          padding: "10px 14px",
                          fontSize: 12,
                          fontWeight: 700,
                          background:
                            i === 0
                              ? `linear-gradient(90deg, ${medyAccent}, #2bb8c8)`
                              : "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          color: "#fff",
                        }}
                      >
                        {a}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Single device — list + sheet */}
          <div
            style={{
              width: "100%",
              maxWidth: 300,
              margin: "0 auto",
              position: "sticky",
              top: "1.25rem",
            }}
          >
            <PhoneFrame finish="black-metal">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  background: "#dff4ff",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/projects/medytic/appointments.png"
                  alt="Appointments list"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                    display: "block",
                  }}
                />

                {/* Soft hit target on first cards — mirrors ticket pick */}
                <button
                  type="button"
                  aria-label="Open first upcoming appointment"
                  data-cursor="view"
                  data-cursor-label="Open"
                  onClick={() => pick("lee")}
                  style={{
                    position: "absolute",
                    left: "5%",
                    right: "5%",
                    top: "28%",
                    height: "22%",
                    border: "none",
                    borderRadius: 14,
                    background: "transparent",
                  }}
                />

                <AnimatePresence>
                  {open && (
                    <motion.div
                      key="modal"
                      role="dialog"
                      aria-modal="true"
                      aria-label="Appointment detail"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduced ? 0.15 : 0.28 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "10% 6%",
                      }}
                    >
                      {/* Black dim — click to dismiss */}
                      <motion.button
                        type="button"
                        aria-label="Close detail"
                        onClick={() => setSelected(null)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduced ? 0.12 : 0.25 }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          border: "none",
                          margin: 0,
                          padding: 0,
                          cursor: "pointer",
                          background: "rgba(0,0,0,0.72)",
                        }}
                      />

                      {/* Centered pop card */}
                      <motion.div
                        initial={
                          reduced
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 0, scale: 0.82, y: 18 }
                        }
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={
                          reduced
                            ? { opacity: 0, scale: 1 }
                            : { opacity: 0, scale: 0.88, y: 12 }
                        }
                        transition={
                          reduced
                            ? { duration: 0.15 }
                            : { type: "spring", stiffness: 380, damping: 26 }
                        }
                        style={{
                          position: "relative",
                          zIndex: 1,
                          width: "100%",
                          maxHeight: "78%",
                          borderRadius: 18,
                          overflow: "hidden",
                          background: "#eaf7ff",
                          boxShadow:
                            "0 24px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.12)",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <div style={{ overflow: "auto", flex: 1 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/projects/medytic/appointment-details.png"
                            alt={
                              active
                                ? `Detail · ${active.doctor}`
                                : "Appointment detail"
                            }
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          data-cursor="hover"
                          onClick={() => setSelected(null)}
                          style={{
                            margin: "0 10px 10px",
                            border: "none",
                            borderRadius: 999,
                            padding: "10px 14px",
                            background: "#0b1220",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 12,
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                        >
                          Back to list
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </PhoneFrame>
            <p
              className="text-label"
              style={{
                textAlign: "center",
                marginTop: 14,
                opacity: 0.4,
                letterSpacing: "0.1em",
              }}
            >
              {open ? "Detail · centered modal" : "Pick a ticket or tap a card"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
