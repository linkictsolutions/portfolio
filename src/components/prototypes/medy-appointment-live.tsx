"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PhoneFrame } from "@/components/device-frame";

type Appt = {
  id: string;
  doctor: string;
  role: string;
  date: string;
  time: string;
  when: string;
  status: "upcoming" | "attended" | "missed";
  type: "In-person" | "Telehealth";
  contact: string;
  address: string;
};

const APPTS: Appt[] = [
  {
    id: "1",
    doctor: "Dr. Lee",
    role: "GP",
    date: "July 9",
    time: "3:00 am",
    when: "This Week",
    status: "upcoming",
    type: "Telehealth",
    contact: "+918 753 0943",
    address: "Washington DC, Avenue 1",
  },
  {
    id: "2",
    doctor: "Dr. Lee",
    role: "GP",
    date: "July 9",
    time: "3:00 am",
    when: "This Week",
    status: "upcoming",
    type: "In-person",
    contact: "+918 753 0943",
    address: "Washington DC, Avenue 1, Street 1",
  },
  {
    id: "3",
    doctor: "Dr. Lee",
    role: "GP",
    date: "July 5",
    time: "9:00 am",
    when: "Last Week",
    status: "attended",
    type: "In-person",
    contact: "+918 753 0943",
    address: "Washington DC, Avenue 1, Street 1",
  },
  {
    id: "4",
    doctor: "Dr. Lee",
    role: "GP",
    date: "July 4",
    time: "11:00 am",
    when: "Last Week",
    status: "missed",
    type: "Telehealth",
    contact: "+918 753 0943",
    address: "Remote",
  },
];

/**
 * Coded live MedyTic appointment flow:
 * list → tap card → detail sheet expands (signature interaction).
 */
export function MedyAppointmentLive() {
  const [selected, setSelected] = useState<Appt | null>(null);
  const [tab, setTab] = useState<"trends" | "history" | "appointments">("appointments");
  const reduced = useReducedMotion();

  const upcoming = APPTS.filter((a) => a.status === "upcoming");
  const past = APPTS.filter((a) => a.status !== "upcoming");

  return (
    <PhoneFrame>
      <div
        style={{
          position: "relative",
          height: "100%",
          background: "linear-gradient(180deg, #d9f4ff 0%, #eef2ff 28%, #ffffff 48%)",
          color: "#0c0c0c",
          fontFamily: "var(--font-sans)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ padding: "14px 16px 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#1987EE" }}>MedyTic</div>
              <div style={{ fontSize: 8, letterSpacing: "0.08em", opacity: 0.55 }}>YOUR HEALTH COMPANION</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  background: "#FFD028",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                3
              </span>
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: "linear-gradient(135deg,#1987EE,#c8fa3c)",
                }}
              />
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 13 }}>
            Hi, John! <span style={{ color: "#c9a227", fontWeight: 700 }}>👑 PREMIUM</span>
          </div>
          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 14, marginTop: 6 }}>
            Health Records & Trends
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 6,
            padding: "0 12px 10px",
          }}
        >
          {(
            [
              ["trends", "Trends"],
              ["history", "Medical History"],
              ["appointments", "Appointments"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              data-cursor="hover"
              onClick={() => setTab(id)}
              style={{
                flex: 1,
                fontSize: 9,
                padding: "8px 4px",
                borderRadius: 999,
                border: "1px solid #b8e4ff",
                background:
                  tab === id
                    ? "linear-gradient(90deg,#7fd4ff,#b7c9ff)"
                    : "#fff",
                fontWeight: tab === id ? 700 : 500,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 12px 72px",
            scrollbarWidth: "none",
          }}
        >
          {tab !== "appointments" ? (
            <div style={{ padding: 24, textAlign: "center", opacity: 0.55, fontSize: 12 }}>
              Switch to Appointments to try the live interaction.
            </div>
          ) : (
            <>
              <Section title="Upcoming Appointments">
                <Group label="This Week">
                  {upcoming.map((a) => (
                    <ApptCard key={a.id} appt={a} onOpen={() => setSelected(a)} />
                  ))}
                </Group>
              </Section>
              <Section title="Past Appointments">
                <Group label="Last Week">
                  {past.map((a) => (
                    <ApptCard key={a.id} appt={a} onOpen={() => setSelected(a)} />
                  ))}
                </Group>
              </Section>
              <p style={{ textAlign: "center", color: "#1987EE", fontSize: 11, marginTop: 8 }}>
                Tap a card to open details →
              </p>
            </>
          )}
        </div>

        {/* Bottom nav */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 58,
            background: "#fff",
            borderTop: "1px solid #e8e8e8",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            fontSize: 8,
            paddingBottom: 6,
          }}
        >
          {["Home", "Records", "Appointments", "Coach", "Settings"].map((label, i) => (
            <div
              key={label}
              style={{
                textAlign: "center",
                opacity: i === 2 ? 1 : 0.45,
                color: i === 2 ? "#1987EE" : "#222",
                fontWeight: i === 2 ? 700 : 400,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  margin: "0 auto 3px",
                  borderRadius: 6,
                  background: i === 2 ? "#1987EE" : "#ddd",
                }}
              />
              {label}
            </div>
          ))}
        </div>

        {/* Detail sheet */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key="sheet"
              initial={reduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(10,20,40,0.45)",
                display: "flex",
                alignItems: "flex-end",
                zIndex: 5,
              }}
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={reduced ? false : { y: "100%" }}
                animate={{ y: 0 }}
                exit={reduced ? undefined : { y: "100%" }}
                transition={{ type: "spring", stiffness: 280, damping: 28 }}
                data-cursor="drag"
                data-cursor-label="Close"
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "100%",
                  borderRadius: "22px 22px 0 0",
                  padding: "18px 16px 28px",
                  background: "linear-gradient(160deg,#d8f7ff 0%,#e8e6ff 55%,#f7f7ff 100%)",
                  boxShadow: "0 -10px 40px rgba(0,0,0,0.25), 0 0 0 2px #1987EE44",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 4,
                    borderRadius: 999,
                    background: "#bbb",
                    margin: "0 auto 14px",
                  }}
                />
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: "linear-gradient(135deg,#1987EE,#ff8fb1)",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>
                      {selected.doctor} ({selected.role})
                    </div>
                    <div style={{ color: "#12C849", fontWeight: 600, fontSize: 12, marginTop: 2 }}>
                      ✓ Confirmed
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1fr",
                    gap: 12,
                    marginTop: 16,
                    fontSize: 11,
                  }}
                >
                  <div>
                    <div style={{ opacity: 0.55 }}>Contact</div>
                    <div style={{ fontWeight: 600 }}>{selected.contact}</div>
                    <div style={{ opacity: 0.55, marginTop: 8 }}>Address</div>
                    <div style={{ fontWeight: 600 }}>{selected.address}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {["Join", "Reschedule", "Add to Calendar"].map((label, i) => (
                      <button
                        key={label}
                        type="button"
                        data-cursor="hover"
                        style={{
                          alignSelf: i === 0 ? "flex-end" : i === 1 ? "stretch" : "stretch",
                          width: i === 0 ? "70%" : "100%",
                          marginLeft: i === 0 ? "auto" : 0,
                          borderRadius: 999,
                          padding: "8px 10px",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#fff",
                          background: "linear-gradient(90deg,#ff4d8d,#7b3cff)",
                          border: "none",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, opacity: 0.7 }}>
                  Need unlimited bookings or instant telehealth?
                </div>
                <button
                  type="button"
                  data-cursor="hover"
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 8,
                    borderRadius: 999,
                    padding: "11px 12px",
                    fontWeight: 800,
                    color: "#fff",
                    background: "linear-gradient(90deg,#ff4d8d,#7b3cff)",
                    border: "none",
                    fontSize: 13,
                  }}
                >
                  Upgrade to Premium
                </button>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 8,
                    marginTop: 16,
                    paddingTop: 12,
                    borderTop: "1px solid #00000022",
                    fontSize: 10,
                    textAlign: "center",
                  }}
                >
                  <div>
                    <div style={{ opacity: 0.5 }}>Date</div>
                    <div style={{ fontWeight: 700 }}>{selected.date}, 2024</div>
                  </div>
                  <div>
                    <div style={{ opacity: 0.5 }}>Time</div>
                    <div style={{ fontWeight: 700 }}>{selected.time}</div>
                  </div>
                  <div>
                    <div style={{ opacity: 0.5 }}>Type</div>
                    <div style={{ fontWeight: 700 }}>{selected.type}</div>
                  </div>
                </div>

                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => setSelected(null)}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 14,
                    padding: 10,
                    borderRadius: 12,
                    border: "1px solid #1987EE55",
                    background: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#1987EE",
                  }}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PhoneFrame>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid #a8d9ff",
        borderRadius: 18,
        padding: 12,
        marginBottom: 12,
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 12 }}>{title}</div>
        <div style={{ fontSize: 9, opacity: 0.55 }}>Weekly Based ⌵</div>
      </div>
      {children}
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 10, fontWeight: 600, margin: "6px 0", opacity: 0.7 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </div>
  );
}

function ApptCard({ appt, onOpen }: { appt: Appt; onOpen: () => void }) {
  const border =
    appt.status === "attended"
      ? "#12C849"
      : appt.status === "missed"
        ? "#FF0004"
        : "#1987EE";

  return (
    <button
      type="button"
      data-cursor="view"
      data-cursor-label="Open"
      onClick={onOpen}
      style={{
        textAlign: "left",
        width: "100%",
        borderRadius: 14,
        padding: 10,
        border: `1.5px solid ${border}`,
        background: "#f7fbff",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 11 }}>
          {appt.status === "upcoming"
            ? "Appointment"
            : appt.status === "attended"
              ? "Attended"
              : "Missed"}
        </div>
        <div style={{ fontSize: 10, opacity: 0.45 }}>✎  ⌧</div>
      </div>
      <div style={{ marginTop: 6, fontSize: 10, lineHeight: 1.45 }}>
        <div>Doctor: {appt.doctor}</div>
        <div>Date: {appt.date}</div>
        <div>Time: {appt.time}</div>
      </div>
    </button>
  );
}
