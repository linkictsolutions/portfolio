"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PhoneFrame } from "@/components/device-frame";

/**
 * Screenshot-based live prototype — uses Abel's real MedyTic exports.
 * Tap the appointments list → detail sheet slides up (real detail PNG).
 */
export function MedyAppointmentLive() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <div style={{ width: "100%" }}>
      <PhoneFrame>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            background: "#fff",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/projects/medytic/appointments.png"
            alt="MedyTic appointments list"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              display: "block",
            }}
          />

          {/* Tap target over first upcoming cards */}
          <button
            type="button"
            aria-label="Open appointment details"
            data-cursor="view"
            data-cursor-label="Open"
            onClick={() => setOpen(true)}
            style={{
              position: "absolute",
              left: "6%",
              right: "6%",
              top: "28%",
              height: "22%",
              border: "none",
              background: "transparent",
              borderRadius: 16,
            }}
          />

          <AnimatePresence>
            {open && (
              <motion.div
                key="detail"
                initial={reduced ? { opacity: 1 } : { y: "105%" }}
                animate={{ y: 0, opacity: 1 }}
                exit={reduced ? { opacity: 0 } : { y: "105%" }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 4,
                  background: "rgba(8, 20, 40, 0.35)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  aria-label="Close details backdrop"
                  onClick={() => setOpen(false)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    border: "none",
                    background: "transparent",
                  }}
                />
                <motion.div
                  style={{
                    position: "relative",
                    zIndex: 5,
                    borderRadius: "20px 20px 0 0",
                    overflow: "hidden",
                    maxHeight: "88%",
                    background: "#e8f7ff",
                    boxShadow: "0 -16px 40px rgba(0,0,0,0.28)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/projects/medytic/appointment-details.png"
                    alt="MedyTic appointment details"
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                  <button
                    type="button"
                    data-cursor="hover"
                    onClick={() => setOpen(false)}
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      border: "none",
                      borderRadius: 999,
                      padding: "8px 14px",
                      background: "#0b0b0d",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
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
      <p
        className="text-label"
        style={{ marginTop: 14, opacity: 0.55, textAlign: "center" }}
      >
        Tap an appointment card → real detail screen
      </p>
    </div>
  );
}
