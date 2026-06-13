"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/data/config";
import { useScrolled } from "@/hooks/useScrolled";
import { useActiveSection } from "@/hooks/useActiveSection";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SocialBar } from "@/components/ui/SocialBar";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Sticky navbar with scroll-aware styling and active-section highlighting.
 * Nav items come from `data/config.ts`. Replaces the original react-bootstrap
 * NavBar.
 */
export function Navbar() {
  const scrolled = useScrolled(50);
  const [open, setOpen] = useState(false);

  const nav = [...siteConfig.nav];
  if (siteConfig.competitiveEnabled)
    nav.push({ label: "Competitive", href: "/competitive" });
  if (siteConfig.blogEnabled) nav.push({ label: "Blog", href: "/blog" });

  // Observe in-page anchor sections only.
  const sectionIds = siteConfig.nav
    .filter((n) => n.href.startsWith("#"))
    .map((n) => n.href.slice(1));
  const active = useActiveSection(sectionIds);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-bg/80 py-3 backdrop-blur-lg"
          : "py-5"
      )}
    >
      <nav className="container flex items-center justify-between">
        <Link href="/#hero" className="text-lg font-bold tracking-tight">
          {siteConfig.name.split(" ")[0]}
          <span className="text-accent">.</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const isActive =
              item.href.startsWith("#") && active === item.href.slice(1);
            return (
              <li key={item.href}>
                <Link
                  href={item.href.startsWith("#") ? `/${item.href}` : item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-accent"
                      : "text-muted hover:text-fg"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <SocialBar />
          <ThemeToggle />
          <Button href="#contact" className="px-5 py-2">
            Let&apos;s Connect
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="container mt-4 md:hidden">
          <ul className="flex flex-col gap-1 rounded-2xl border border-border bg-surface p-4">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href.startsWith("#") ? `/${item.href}` : item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-muted hover:bg-surface-2 hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex items-center justify-between px-2">
              <SocialBar />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
