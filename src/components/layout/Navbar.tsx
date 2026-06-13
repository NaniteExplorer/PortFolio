"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/data/config";
import { useScrolled } from "@/hooks/useScrolled";
import { useActiveSection } from "@/hooks/useActiveSection";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SocialBar } from "@/components/ui/SocialBar";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Sticky navbar with scroll-aware styling and active highlighting that works
 * for BOTH in-page anchor sections (home) and standalone routes (/competitive,
 * /dev, /blog). Nav items come from `data/config.ts`.
 */
export function Navbar() {
  const scrolled = useScrolled(50);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = [...siteConfig.nav];
  if (siteConfig.competitiveEnabled)
    nav.push({ label: "Competitive", href: "/competitive" });
  if (siteConfig.devProfileEnabled) nav.push({ label: "Dev", href: "/dev" });
  if (siteConfig.blogEnabled) nav.push({ label: "Blog", href: "/blog" });

  // Observe in-page anchor sections only.
  const sectionIds = siteConfig.nav
    .filter((n) => n.href.startsWith("#"))
    .map((n) => n.href.slice(1));
  const active = useActiveSection(sectionIds);

  /** Anchor links light up only while on the home page; route links match the
   *  current pathname (and any nested path, e.g. /blog/my-post). */
  const isActive = (href: string) => {
    if (href.startsWith("#")) return pathname === "/" && active === href.slice(1);
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-bg/70 py-2.5 backdrop-blur-xl"
          : "py-4"
      )}
    >
      <nav className="container flex items-center justify-between">
        <Link
          href="/#hero"
          className="text-base font-bold tracking-tight transition-opacity hover:opacity-80"
        >
          {siteConfig.name.split(" ")[0]}
          <span className="text-accent">.</span>
        </Link>

        {/* Desktop links */}
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 md:flex">
          {nav.map((item) => {
            const activeItem = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href.startsWith("#") ? `/${item.href}` : item.href}
                  aria-current={activeItem ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                    activeItem
                      ? "bg-accent/10 text-accent"
                      : "text-muted hover:text-fg"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button href="/#contact" className="px-4 py-1.5 text-sm">
            Let&apos;s Connect
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="container mt-3 md:hidden">
          <ul className="flex flex-col gap-1 rounded-2xl border border-border bg-surface p-3">
            {nav.map((item) => {
              const activeItem = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href.startsWith("#") ? `/${item.href}` : item.href}
                    onClick={() => setOpen(false)}
                    aria-current={activeItem ? "page" : undefined}
                    className={cn(
                      "block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                      activeItem
                        ? "bg-accent/10 text-accent"
                        : "text-muted hover:bg-surface-2 hover:text-fg"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-2 flex items-center justify-between border-t border-border px-2 pt-3">
              <SocialBar />
              <Button href="/#contact" className="px-4 py-1.5 text-sm">
                Connect
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
