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
  gallery: MediaItem[];
  interactions: MediaItem[];
  outcomes: Outcome[];
}

export const projects: Project[] = [
  {
    slug: "lumen-banking",
    title: "Lumen",
    subtitle: "A calm banking app that makes money feel human",
    year: "2025",
    client: "Lumen Financial",
    role: ["Product Design", "Interaction", "Prototyping"],
    tags: ["Fintech", "Mobile", "Design System"],
    summary:
      "Reimagining mobile banking around emotion and clarity — turning anxiety-inducing numbers into a calm, guided daily ritual.",
    accent: "#3b47ff",
    tone: "dark",
    cover: { kind: "placeholder", variant: "mobile", label: "Lumen", tone: "dark" },
    hoverPreview: { kind: "placeholder", variant: "mobile", label: "Lumen", tone: "dark" },
    context:
      "Lumen is a neobank targeting first-time savers. They had strong infrastructure but a cold, spreadsheet-like app that scared new users away in the first week.",
    problem:
      "Early churn was driven by anxiety: dense dashboards, jargon, and no sense of progress. People opened the app, felt worse, and left.",
    process: [
      {
        no: "01",
        title: "Reframing the emotion",
        body: "I ran 12 diary studies and mapped the emotional arc of a payday. The insight: users wanted reassurance, not more data. We designed for the feeling first.",
      },
      {
        no: "02",
        title: "A calmer information model",
        body: "Balance became a single confident number with a soft context ring. Everything else collapsed into progressive disclosure, revealed only on intent.",
      },
      {
        no: "03",
        title: "Motion as reassurance",
        body: "Micro-interactions confirm every action with gentle physics — a settling coin, a breathing progress ring — so the app feels alive and trustworthy.",
      },
    ],
    figmaEmbedUrl: "",
    gallery: [
      { kind: "placeholder", variant: "mobile", label: "Home", tone: "dark" },
      { kind: "placeholder", variant: "mobile", label: "Goals", tone: "light" },
      { kind: "placeholder", variant: "detail", label: "Settle animation", tone: "dark" },
      { kind: "placeholder", variant: "mobile", label: "Insights", tone: "light" },
    ],
    interactions: [
      { kind: "video", src: "", poster: "", label: "Balance breathing ring", device: "mobile" },
      { kind: "video", src: "", poster: "", label: "Save-to-goal drag", device: "mobile" },
    ],
    outcomes: [
      { metric: "-38%", label: "First-week churn" },
      { metric: "2.4x", label: "Weekly active use" },
      { metric: "4.8★", label: "App Store rating" },
    ],
  },
  {
    slug: "orbit-workspace",
    title: "Orbit",
    subtitle: "A spatial canvas for teams who think in maps, not lists",
    year: "2025",
    client: "Orbit Labs",
    role: ["Product Design", "Design Systems"],
    tags: ["SaaS", "Desktop", "Productivity"],
    summary:
      "A collaborative workspace that replaces endless nested docs with a zoomable, spatial canvas your whole team can navigate.",
    accent: "#ff4a1c",
    tone: "light",
    cover: { kind: "placeholder", variant: "desktop", label: "Orbit", tone: "light" },
    hoverPreview: { kind: "placeholder", variant: "desktop", label: "Orbit", tone: "light" },
    context:
      "Orbit wanted to challenge document-based tools. Their prototype was powerful but overwhelming — users got lost in infinite space.",
    problem:
      "Infinite canvases are freeing but disorienting. We needed structure without cages: a way to feel located at every zoom level.",
    process: [
      {
        no: "01",
        title: "Wayfinding first",
        body: "I designed a persistent minimap and semantic zoom so content changes fidelity as you move — titles at distance, detail up close.",
      },
      {
        no: "02",
        title: "A gestural language",
        body: "Every action maps to a spatial gesture. Grouping, linking, and diving in all feel physical and reversible.",
      },
      {
        no: "03",
        title: "Systemising the chaos",
        body: "A 60-token design system kept the interface quiet so the user's content could be loud.",
      },
    ],
    figmaEmbedUrl: "",
    gallery: [
      { kind: "placeholder", variant: "desktop", label: "Canvas", tone: "light" },
      { kind: "placeholder", variant: "detail", label: "Semantic zoom", tone: "dark" },
      { kind: "placeholder", variant: "desktop", label: "Minimap", tone: "light" },
      { kind: "placeholder", variant: "flow", label: "Zoom flow", tone: "light" },
    ],
    interactions: [
      { kind: "video", src: "", poster: "", label: "Semantic zoom", device: "desktop" },
      { kind: "video", src: "", poster: "", label: "Group & link gesture", device: "desktop" },
    ],
    outcomes: [
      { metric: "+52%", label: "Task completion" },
      { metric: "-27%", label: "Time to first map" },
      { metric: "$6M", label: "Seed raised post-redesign" },
    ],
  },
  {
    slug: "sprout-health",
    title: "Sprout",
    subtitle: "Playful habit-building for kids and the grown-ups who love them",
    year: "2024",
    client: "Sprout Health",
    role: ["Product Design", "Illustration", "Motion"],
    tags: ["Health", "Mobile", "Playful"],
    summary:
      "A family wellness app that turns daily habits into a living garden — where consistency literally grows into something beautiful.",
    accent: "#12b886",
    tone: "light",
    cover: { kind: "placeholder", variant: "mobile", label: "Sprout", tone: "light" },
    hoverPreview: { kind: "placeholder", variant: "mobile", label: "Sprout", tone: "light" },
    context:
      "Sprout helps families build healthy routines together. Existing habit apps felt like chores — spreadsheets with streaks.",
    problem:
      "How do you make consistency feel joyful for a 7-year-old and a 37-year-old in the same interface, without patronising either?",
    process: [
      {
        no: "01",
        title: "One metaphor, two audiences",
        body: "The garden metaphor rewards kids with visible growth and gives adults a calm, ambient sense of progress. No numbers required.",
      },
      {
        no: "02",
        title: "Reward through motion",
        body: "Completing a habit triggers a hand-animated bloom. I designed a spring-based system so each reward feels earned, never repetitive.",
      },
      {
        no: "03",
        title: "Accessible delight",
        body: "Every animation has a reduced-motion equivalent, and the palette passes AAA contrast — delight that includes everyone.",
      },
    ],
    figmaEmbedUrl: "",
    gallery: [
      { kind: "placeholder", variant: "mobile", label: "Garden", tone: "light" },
      { kind: "placeholder", variant: "detail", label: "Bloom reward", tone: "light" },
      { kind: "placeholder", variant: "mobile", label: "Family", tone: "dark" },
      { kind: "placeholder", variant: "flow", label: "Habit flow", tone: "light" },
    ],
    interactions: [
      { kind: "video", src: "", poster: "", label: "Bloom reward", device: "mobile" },
      { kind: "video", src: "", poster: "", label: "Streak celebration", device: "mobile" },
    ],
    outcomes: [
      { metric: "71%", label: "30-day retention" },
      { metric: "3.1", label: "Habits per family / day" },
      { metric: "Webby", label: "Nominee, Health 2024" },
    ],
  },
  {
    slug: "arc-commerce",
    title: "Arc",
    subtitle: "A checkout so fast it feels like cheating",
    year: "2024",
    client: "Arc Commerce",
    role: ["Interaction Design", "Prototyping"],
    tags: ["E-commerce", "Web", "Conversion"],
    summary:
      "Rebuilding a multi-step checkout into a single fluid surface — cutting friction, drop-off, and doubt in one motion-led redesign.",
    accent: "#ffd028",
    tone: "dark",
    cover: { kind: "placeholder", variant: "desktop", label: "Arc", tone: "dark" },
    hoverPreview: { kind: "placeholder", variant: "desktop", label: "Arc", tone: "dark" },
    context:
      "Arc powers checkout for 400+ independent brands. Their funnel bled users at every one of five steps.",
    problem:
      "Each page reload was a moment of doubt. We needed to compress five screens into one continuous, confidence-building flow.",
    process: [
      {
        no: "01",
        title: "Collapsing the funnel",
        body: "I prototyped a single-surface checkout where sections expand in place. No reloads, no lost context, always one clear next step.",
      },
      {
        no: "02",
        title: "Choreographing trust",
        body: "Motion guides the eye to exactly the right field, and success states resolve instantly — the interface never leaves you guessing.",
      },
      {
        no: "03",
        title: "Prototype-driven testing",
        body: "High-fidelity Figma prototypes let us A/B the motion itself before a line of code shipped.",
      },
    ],
    figmaEmbedUrl: "",
    gallery: [
      { kind: "placeholder", variant: "desktop", label: "Checkout", tone: "dark" },
      { kind: "placeholder", variant: "detail", label: "Inline expand", tone: "light" },
      { kind: "placeholder", variant: "flow", label: "Single-surface flow", tone: "dark" },
      { kind: "placeholder", variant: "desktop", label: "Success", tone: "light" },
    ],
    interactions: [
      { kind: "video", src: "", poster: "", label: "Section expand", device: "desktop" },
      { kind: "video", src: "", poster: "", label: "Pay success", device: "desktop" },
    ],
    outcomes: [
      { metric: "+19%", label: "Checkout conversion" },
      { metric: "-44%", label: "Step drop-off" },
      { metric: "9s", label: "Median checkout time" },
    ],
  },
  {
    slug: "field-notes",
    title: "Field Notes",
    subtitle: "A field-research tool designed to disappear",
    year: "2024",
    client: "Meridian Research",
    role: ["Product Design", "Research"],
    tags: ["Enterprise", "Tablet", "Data"],
    summary:
      "An offline-first data capture tool for researchers in the field — designed to get out of the way in harsh, high-stakes conditions.",
    accent: "#ff8fb1",
    tone: "light",
    cover: { kind: "placeholder", variant: "detail", label: "Field Notes", tone: "light" },
    hoverPreview: { kind: "placeholder", variant: "detail", label: "Field Notes", tone: "light" },
    context:
      "Meridian's researchers capture data in remote locations — bright sun, gloves, no signal. Their old tool assumed a comfortable desk.",
    problem:
      "The interface failed exactly where it mattered: glare, fat-finger errors, and lost work when connectivity dropped.",
    process: [
      {
        no: "01",
        title: "Designing for the worst case",
        body: "I designed a high-contrast, large-target UI tested with gloves in direct sunlight, and an offline-first sync model that never loses a keystroke.",
      },
      {
        no: "02",
        title: "One-handed everything",
        body: "Core capture actions live within thumb reach. Voice and quick-tags cut data entry time dramatically.",
      },
      {
        no: "03",
        title: "Quiet confidence",
        body: "A persistent, honest sync status means researchers always trust their data is safe — the single most requested outcome.",
      },
    ],
    figmaEmbedUrl: "",
    gallery: [
      { kind: "placeholder", variant: "desktop", label: "Capture", tone: "light" },
      { kind: "placeholder", variant: "detail", label: "Sync status", tone: "dark" },
      { kind: "placeholder", variant: "flow", label: "Offline flow", tone: "light" },
      { kind: "placeholder", variant: "desktop", label: "Review", tone: "light" },
    ],
    interactions: [
      { kind: "video", src: "", poster: "", label: "Quick capture", device: "desktop" },
      { kind: "video", src: "", poster: "", label: "Offline sync", device: "desktop" },
    ],
    outcomes: [
      { metric: "-61%", label: "Data-entry time" },
      { metric: "0", label: "Records lost in pilot" },
      { metric: "100%", label: "Researcher adoption" },
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
