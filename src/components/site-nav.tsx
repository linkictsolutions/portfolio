"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/content/site";
import { getLenis } from "@/components/smooth-scroll";

export function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleAnchor = (e: React.MouseEvent, href: string) => {
    // Only intercept in-page anchors like "/#work".
    if (!href.includes("#")) return;
    const [path, hash] = href.split("#");
    const onSamePage = path === "" || path === "/" ? pathname === "/" : pathname === path;

    if (onSamePage) {
      e.preventDefault();
      const el = document.getElementById(hash);
      if (!el) return;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(el, { offset: -40, duration: 1.4 });
      else el.scrollIntoView({ behavior: "smooth" });
    } else if (pathname !== "/") {
      // Navigate home first, hash handled by browser.
      e.preventDefault();
      router.push(href);
    }
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 70,
        mixBlendMode: "difference",
      }}
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 md:px-10 md:py-7">
        <Link
          href="/"
          className="text-display text-[color:white] text-lg md:text-xl"
          data-cursor="hover"
          style={{ color: "white" }}
        >
          {siteConfig.name}
          <span style={{ color: "var(--color-accent)" }}>.</span>
        </Link>

        <ul className="flex items-center gap-5 md:gap-9" style={{ color: "white" }}>
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={(e) => handleAnchor(e, item.href)}
                data-cursor="hover"
                className="text-label transition-opacity hover:opacity-60"
                style={{ color: "white" }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
