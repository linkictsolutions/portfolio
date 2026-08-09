/**
 * Project content model.
 *
 * Media is a small union so the site works fully with generated placeholders
 * today, and real assets drop in later with a one-line change:
 *   - { kind: "placeholder", ... }  designed SVG mockups (no asset needed)
 *   - { kind: "image", src, alt }   real screen exports in /public
 *   - { kind: "video", src, poster} real interaction recordings in /public
 */
export type MediaItem =
  | {
      kind: "placeholder";
      variant: "mobile" | "desktop" | "detail" | "flow";
      label?: string;
      tone?: "light" | "dark";
    }
  | {
      kind: "image";
      src: string;
      alt: string;
      device?: "mobile" | "desktop" | "free";
      caption?: string;
    }
  | {
      kind: "video";
      src: string;
      poster?: string;
      label?: string;
      device?: "mobile" | "desktop" | "free";
    };

export interface ProcessBlock {
  no: string;
  title: string;
  body: string;
}

export interface Outcome {
  metric: string;
  label: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  client: string;
  role: string[];
  tags: string[];
  summary: string;
  /** Loud accent color used across the project's sections. */
  accent: string;
  /** Cover background tone -> decides text color over the cover. */
  tone: "light" | "dark";
  cover: MediaItem;
  hoverPreview: MediaItem;
  context: string;
  problem: string;
  process: ProcessBlock[];
  /**
   * Figma prototype embed URL. Use the "embed" URL from Figma's Share ->
   * Get embed code. Left blank uses an interactive placeholder prototype.
   */
  figmaEmbedUrl?: string;
  /** When true, case study renders the coded MedyTic live appointment prototype. */
  livePrototype?: "medy-appointment";
  gallery: MediaItem[];
  interactions: MediaItem[];
  outcomes: Outcome[];
}

export const projects: Project[] = [
  {
    slug: "medytic",
    title: "MedyTic",
    subtitle: "A family-first e-medical companion — appointments, telehealth, and shared care",
    year: "2026",
    client: "MedyTic",
    role: ["UI Design", "UX Flows", "Prototyping", "Design System"],
    tags: ["Health", "Mobile", "Family Care"],
    summary:
      "End-to-end UI/UX for a patient–caregiver health app: family overview, appointments, telehealth, wearables, and shared plans — designed for clarity under real medical complexity.",
    accent: "#1987EE",
    tone: "light",
    cover: {
      kind: "image",
      src: "/projects/medytic/overview-family.png",
      alt: "MedyTic Family Overview",
      device: "mobile",
    },
    hoverPreview: {
      kind: "image",
      src: "/projects/medytic/overview-family.png",
      alt: "MedyTic Family Overview",
      device: "mobile",
    },
    context:
      "The product owners defined MedyTic as an e-medical platform linking patients to caregivers — appointments, video telehealth, chat, wearable connections, medical file uploads, medication history, and shared family plans (Free, Individual, Family). My job was to turn that brief into a clear, usable mobile experience.",
    problem:
      "Health apps often feel dense and single-user. MedyTic needed to serve individuals and families without burying critical actions — booking, monitoring, and joining care — under complexity.",
    process: [
      {
        no: "01",
        title: "Structure the care journey",
        body: "Mapped the product into clear hubs: Family Overview as home, Records & Appointments as clinical rhythm, Community/navigation as orientation, Settings for family management — so users always know where they are.",
      },
      {
        no: "02",
        title: "Design for family + individual modes",
        body: "Built dual views (Family / Individual) and monitoring screens for children and elderly carers — same system language, different information density based on who you're caring for.",
      },
      {
        no: "03",
        title: "Make appointments touchable",
        body: "Appointments use scannable cards with status (upcoming / attended / missed) and expand into a detail sheet with join, reschedule, and calendar actions — the interaction you can try live below.",
      },
    ],
    livePrototype: "medy-appointment",
    gallery: [
      {
        kind: "image",
        src: "/projects/medytic/overview-family.png",
        alt: "Family Overview",
        device: "mobile",
        caption: "Family Overview — health snapshot across members",
      },
      {
        kind: "image",
        src: "/projects/medytic/overview-individual.png",
        alt: "Individual View",
        device: "mobile",
        caption: "Individual View — focused member care",
      },
      {
        kind: "image",
        src: "/projects/medytic/community-hub.png",
        alt: "Header & Navigation / Community Hub",
        device: "mobile",
        caption: "Header & Navigation — community hub orientation",
      },
      {
        kind: "image",
        src: "/projects/medytic/appointments.png",
        alt: "Appointments list",
        device: "mobile",
        caption: "Appointments — upcoming vs past with status",
      },
      {
        kind: "image",
        src: "/projects/medytic/appointment-details.png",
        alt: "Appointment details",
        device: "mobile",
        caption: "Appointment detail sheet — join & manage",
      },
      {
        kind: "image",
        src: "/projects/medytic/monitoring-elderly.png",
        alt: "Family monitoring",
        device: "mobile",
        caption: "Family monitoring — elderly / carer details",
      },
      {
        kind: "image",
        src: "/projects/medytic/invite-friends.png",
        alt: "Invite friends",
        device: "mobile",
        caption: "Invite & referrals",
      },
      {
        kind: "image",
        src: "/projects/medytic/family-management.png",
        alt: "Family management",
        device: "mobile",
        caption: "Settings — family management",
      },
      {
        kind: "image",
        src: "/projects/medytic/add-device.png",
        alt: "Add device",
        device: "mobile",
        caption: "Wearables — add a connected device",
      },
      {
        kind: "image",
        src: "/projects/medytic/connected-devices.png",
        alt: "Connected devices",
        device: "mobile",
        caption: "Connected devices list",
      },
    ],
    interactions: [
      {
        kind: "image",
        src: "/projects/medytic/appointments.png",
        alt: "Appointments interaction",
        device: "mobile",
        caption: "List → detail expand (try the live prototype above)",
      },
      {
        kind: "image",
        src: "/projects/medytic/overview-family.png",
        alt: "Family / Individual toggle",
        device: "mobile",
        caption: "Family ↔ Individual view switch",
      },
    ],
    outcomes: [
      { metric: "Shipped", label: "Live product (~4 months)" },
      { metric: "100+", label: "Screens designed end-to-end" },
      { metric: "3", label: "Plans: Free · Individual · Family" },
    ],
  },
  {
    slug: "lumen-banking",
    title: "Lumen",
    subtitle: "A calm banking app that makes money feel human",
    year: "2025",
    client: "Demo placeholder",
    role: ["Product Design", "Interaction"],
    tags: ["Fintech", "Mobile", "Demo"],
    summary:
      "Placeholder case study — will be replaced with Abel's next real project.",
    accent: "#3b47ff",
    tone: "dark",
    cover: { kind: "placeholder", variant: "mobile", label: "Lumen", tone: "dark" },
    hoverPreview: { kind: "placeholder", variant: "mobile", label: "Lumen", tone: "dark" },
    context: "Demo content only.",
    problem: "Demo content only.",
    process: [
      { no: "01", title: "Placeholder", body: "Replace with a real project when assets are ready." },
      { no: "02", title: "Placeholder", body: "Replace with a real project when assets are ready." },
      { no: "03", title: "Placeholder", body: "Replace with a real project when assets are ready." },
    ],
    gallery: [
      { kind: "placeholder", variant: "mobile", label: "Home", tone: "dark" },
      { kind: "placeholder", variant: "mobile", label: "Goals", tone: "light" },
    ],
    interactions: [
      { kind: "video", src: "", poster: "", label: "Interaction demo", device: "mobile" },
    ],
    outcomes: [
      { metric: "—", label: "Coming soon" },
      { metric: "—", label: "Coming soon" },
    ],
  },
  {
    slug: "orbit-workspace",
    title: "Orbit",
    subtitle: "A spatial canvas for teams who think in maps, not lists",
    year: "2025",
    client: "Demo placeholder",
    role: ["Product Design"],
    tags: ["SaaS", "Desktop", "Demo"],
    summary: "Placeholder case study — will be replaced with Abel's next real project.",
    accent: "#ff4a1c",
    tone: "light",
    cover: { kind: "placeholder", variant: "desktop", label: "Orbit", tone: "light" },
    hoverPreview: { kind: "placeholder", variant: "desktop", label: "Orbit", tone: "light" },
    context: "Demo content only.",
    problem: "Demo content only.",
    process: [
      { no: "01", title: "Placeholder", body: "Replace with a real project when assets are ready." },
      { no: "02", title: "Placeholder", body: "Replace with a real project when assets are ready." },
      { no: "03", title: "Placeholder", body: "Replace with a real project when assets are ready." },
    ],
    gallery: [
      { kind: "placeholder", variant: "desktop", label: "Canvas", tone: "light" },
      { kind: "placeholder", variant: "detail", label: "Zoom", tone: "dark" },
    ],
    interactions: [
      { kind: "video", src: "", poster: "", label: "Interaction demo", device: "desktop" },
    ],
    outcomes: [
      { metric: "—", label: "Coming soon" },
      { metric: "—", label: "Coming soon" },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
