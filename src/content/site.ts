export const siteConfig = {
  name: "Ava Mercer",
  role: "Product & Interaction Designer",
  // Short tagline used in the hero.
  tagline: "I design interfaces people feel, not just use.",
  description:
    "Portfolio of Ava Mercer, a product and interaction designer crafting bold, human, and playful digital experiences — shown through live prototypes, not static mockups.",
  url: "https://example.com",
  location: "Berlin, DE",
  availability: "Available for select projects — 2026",
  email: "hello@avamercer.design",
  socials: [
    { label: "Figma", href: "https://figma.com" },
    { label: "Dribbble", href: "https://dribbble.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Read.cv", href: "https://read.cv" },
  ],
  nav: [
    { label: "Work", href: "/#work" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
};

export type SiteConfig = typeof siteConfig;
