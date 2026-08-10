"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PhoneFrame } from "@/components/device-frame";
import { medyAccent } from "@/content/medytic";

/**
 * Signature interaction: appointments list ↔ detail.
 * Desktop: dual-phone stage. Mobile: tap opens detail sheet.
 * Uses Abel's real screen exports — motion is the craft.
 */
export function MedyAppointmentSystem() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <section
      style={{
        padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 4vw, 3.5rem)",
        background: "#07080c",
        color: "#f3efe6",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p className="text-label" style={{ color: medyAccent }}>
          (Interactive · Appointments)
        </p>
        <h2
          className="text-display"
          style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)", margin: "0.75rem 0 0", lineHeight: 0.95 }}
        >
          Tap the card.
          <br />
          Feel the flow.
        </h2>
        <p style={{ marginTop: "1rem", maxWidth: 520, opacity: 0.65, lineHeight: 1.5 }}>
          Status-coded list → detail with Join / Reschedule / Calendar.
          Real MedyTic screens — the interaction is what you operate.
        </p>

        {/* Desktop dual stage */}
        <div
          className="medy-appt-desktop"
          style={{
            marginTop: "3rem",
            display: "none",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(1.5rem, 3vw, 2.5rem)",
            alignItems: "end",
            maxWidth: 780,
            marginInline: "auto",
          }}
        >
          <div>
            <PhoneFrame>
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/projects/medytic/appointments.png"
                  alt="Appointments list"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                />
                <button
                  type="button"
                  data-cursor="view"
                  data-cursor-label="Open"
                  aria-label="Open appointment detail"
                  onClick={() => setOpen(true)}
                  onMouseEnter={() => setOpen(true)}
                  style={{
                    position: "absolute",
                    left: "5%",
                    right: "5%",
                    top: "27%",
                    height: "24%",
                    border: open ? `2px solid ${medyAccent}` : "2px solid transparent",
                    borderRadius: 14,
                    background: open ? `${medyAccent}22` : "transparent",
                    boxShadow: open ? `0 0 0 4px ${medyAccent}33` : "none",
                    transition: "all 0.3s",
                  }}
                />
              </div>
            </PhoneFrame>
            <p className="text-label" style={{ textAlign: "center", marginTop: 12, opacity: 0.5 }}>
              List — hover / click a card
            </p>
          </div>

          <div>
            <PhoneFrame>
              <AnimatePresence mode="wait">
                <motion.img
                  key={open ? "detail" : "idle"}
                  src={
                    open
                      ? "/projects/medytic/appointment-details.png"
                      : "/projects/medytic/appointments.png"
                  }
                  alt={open ? "Appointment detail" : "Waiting for selection"}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: open ? 1 : 0.35, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                    filter: open ? "none" : "grayscale(0.4)",
                  }}
                />
              </AnimatePresence>
            </PhoneFrame>
            <p className="text-label" style={{ textAlign: "center", marginTop: 12, opacity: 0.5 }}>
              {open ? "Detail — live" : "Detail — waiting"}
            </p>
          </div>
        </div>

        {/* Mobile single phone */}
        <div
          className="medy-appt-mobile"
          style={{ marginTop: "2.5rem", maxWidth: 340, marginInline: "auto" }}
        >
          <PhoneFrame>
            <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/projects/medytic/appointments.png"
                alt="Appointments"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top center",
                }}
              />
              <button
                type="button"
                data-cursor="view"
                data-cursor-label="Open"
                aria-label="Open appointment detail"
                onClick={() => setOpen(true)}
                style={{
                  position: "absolute",
                  left: "5%",
                  right: "5%",
                  top: "27%",
                  height: "24%",
                  border: "none",
                  background: "transparent",
                  borderRadius: 14,
                }}
              />
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={reduced ? { opacity: 1 } : { y: "100%" }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={reduced ? { opacity: 0 } : { y: "100%" }}
                    transition={{ type: "spring", stiffness: 280, damping: 30 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 5,
                      background: "rgba(0,0,0,0.4)",
                      display: "flex",
                      alignItems: "flex-end",
                    }}
                  >
                    <button
                      type="button"
                      aria-label="Close"
                      onClick={() => setOpen(false)}
                      style={{ position: "absolute", inset: 0, border: "none", background: "transparent" }}
                    />
                    <div
                      style={{
                        position: "relative",
                        zIndex: 6,
                        width: "100%",
                        maxHeight: "90%",
                        borderRadius: "18px 18px 0 0",
                        overflow: "auto",
                        background: "#dff4ff",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/projects/medytic/appointment-details.png"
                        alt="Detail"
                        style={{ width: "100%", display: "block" }}
                      />
                      <button
                        type="button"
                        data-cursor="hover"
                        onClick={() => setOpen(false)}
                        style={{
                          position: "sticky",
                          bottom: 12,
                          left: "50%",
                          transform: "translateX(-50%)",
                          display: "block",
                          margin: "0 auto 12px",
                          border: "none",
                          borderRadius: 999,
                          padding: "10px 18px",
                          background: "#0b0b0d",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </PhoneFrame>
          <p className="text-label" style={{ textAlign: "center", marginTop: 12, opacity: 0.5 }}>
            Tap a card to open detail
          </p>
        </div>
      </div>
    </section>
  );
}
