export const medyAccent = "#1987EE";

export type MedyScreen = {
  id: string;
  src: string;
  label: string;
  caption: string;
  /** phone = full screen export; panel = modal/card export (not a device screen) */
  fit?: "phone" | "panel";
};

/** Full set for expand gallery (includes appointment detail). */
export const medyScreens: MedyScreen[] = [
  {
    id: "overview-family",
    src: "/projects/medytic/overview-family.png",
    label: "Family Overview",
    caption: "Home for shared care — health snapshot across every member.",
  },
  {
    id: "overview-individual",
    src: "/projects/medytic/overview-individual.png",
    label: "Individual View",
    caption: "Same system, denser detail when focus is one person.",
  },
  {
    id: "community",
    src: "/projects/medytic/community-hub.png",
    label: "Community Hub",
    caption: "Header & navigation — orientation into the care community.",
  },
  {
    id: "appointments",
    src: "/projects/medytic/appointments.png",
    label: "Appointments",
    caption: "Upcoming vs past, status-coded for scanability.",
  },
  {
    id: "appointment-details",
    src: "/projects/medytic/appointment-details.png",
    label: "Appointment Detail",
    caption: "Join, reschedule, calendar — actions within reach.",
    fit: "panel",
  },
  {
    id: "monitoring",
    src: "/projects/medytic/monitoring-elderly.png",
    label: "Family Monitoring",
    caption: "Carer / elderly detail without leaving family context.",
  },
  {
    id: "invite",
    src: "/projects/medytic/invite-friends.png",
    label: "Invite & Referrals",
    caption: "Growth loop that still feels like care, not spam.",
  },
  {
    id: "connected",
    src: "/projects/medytic/connected-devices.png",
    label: "Connected Devices",
    caption: "Inventory of what the family is already wearing.",
  },
  {
    id: "devices",
    src: "/projects/medytic/add-device.png",
    label: "Add Device",
    caption: "Wearable connect — clear success and disconnect states.",
  },
  {
    id: "family-mgmt",
    src: "/projects/medytic/family-management.png",
    label: "Family Management",
    caption: "Settings that treat family as a first-class mode.",
  },
];

/**
 * Scroll-stage sequence only.
 * — no appointment detail
 * — Connected Devices before Add Device
 */
export const medyStageScreens = medyScreens.filter(
  (s) => s.id !== "appointment-details",
);

export const medyBrief = {
  title: "MedyTic",
  subtitle: "Family-first e-medical companion",
  tags: ["Health", "Mobile", "Family Care"],
  year: "2026",
  role: "UI · UX · Prototyping · Design system",
  line: "Owners defined the product. I turned the brief into a clear, usable mobile system for patients and caregivers.",
  outcomes: [
    { metric: "Shipped", label: "Live product" },
    { metric: "100+", label: "Screens designed" },
    { metric: "3", label: "Plan tiers" },
  ],
};
