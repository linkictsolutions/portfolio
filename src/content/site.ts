export const siteConfig = {
  name: "Abel Abebaw",
  role: "UI/UX Designer",
  // Short tagline used in the hero.
  tagline: "I design clean, intuitive digital products that feel effortless to use.",
  description:
    "Portfolio of Abel Abebaw, a UI/UX designer in Addis Ababa crafting clean, intuitive, human-centered digital products — shown through live prototypes, not static mockups.",
  // Placeholder domain — update when you deploy (used for SEO/OG links).
  url: "https://abelabebaw.design",
  location: "Addis Ababa, Ethiopia",
  availability: "Open to freelance & full-time opportunities — 2026",
  email: "abel.abebaw019@gmail.com",
  socials: [] as { label: string; href: string }[],
  nav: [
    { label: "Work", href: "/#work" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
};

export type SiteConfig = typeof siteConfig;
