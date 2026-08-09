# Portfolio — Ava Mercer (interactive UX portfolio)

An award-style, interactive portfolio for a UI/UX designer. The site is built so
the medium demonstrates the craft: a WebGL hero, a custom magnetic cursor,
smooth scroll, page transitions, scroll-driven case studies, live Figma
prototypes inside device frames, and hover-to-play interaction videos.

Built with **Next.js 16** (App Router, Turbopack), React 19, Tailwind CSS v4,
`motion` (Framer Motion), `lenis`, and `gsap`.

## Run

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve production build
```

## Make it yours

Everything content-related lives in `src/content/`:

- `src/content/site.ts` — your name, role, tagline, email, socials, availability.
- `src/content/about.ts` — bio, capabilities, tools, and the marquee words.
- `src/content/projects.ts` — the case studies.

### Adding real assets

Each project uses a small `MediaItem` union so it works with designed
placeholders today and real assets later. Just change the entry:

```ts
// Placeholder (default) — a generated SVG mockup, no file needed:
{ kind: "placeholder", variant: "mobile", label: "Home", tone: "dark" }

// Real image — drop the file in /public and point to it:
{ kind: "image", src: "/projects/lumen/home.png", alt: "Lumen home", device: "mobile" }

// Real interaction video — muted/looping, shown in a device frame:
{ kind: "video", src: "/projects/lumen/save.mp4", poster: "/projects/lumen/save.jpg", label: "Save to goal", device: "mobile" }
```

Put media under `public/projects/<slug>/`.

### Adding a live Figma prototype

In Figma: **Share → Get embed code**, copy the `src` URL from the iframe, and
set it on the project:

```ts
figmaEmbedUrl: "https://embed.figma.com/proto/....?embed-host=share"
```

The prototype is click-to-load (kept off the initial page for performance) and
rendered inside a phone or browser frame based on the cover's `variant`/`device`.

## Accessibility & performance

- Full `prefers-reduced-motion` fallbacks (no smooth scroll, cursor, shader
  animation, marquees, or scroll pinning).
- The custom cursor only activates on fine pointers.
- Videos are muted, `playsInline`, lazy (`preload="metadata"`), and fall back to
  a designed placeholder if a source is missing.
- Heavy Figma iframes load only on click.
