"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Code2, Mail, Menu, Trophy, X, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/data/config";
import { useScrolled } from "@/hooks/useScrolled";
import { useActiveSection } from "@/hooks/useActiveSection";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SocialBar } from "@/components/ui/SocialBar";
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
  const featureNav: Array<{ label: string; href: string; icon: LucideIcon }> = [];
  if (siteConfig.competitiveEnabled)
    featureNav.push({ label: "Competitive", href: "/competitive", icon: Trophy });
  if (siteConfig.dedicationEnabled)
    featureNav.push({ label: "Dedication", href: "/dedication", icon: Activity });
  if (siteConfig.devProfileEnabled)
    featureNav.push({ label: "Dev", href: "/dev", icon: Code2 });
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
      <nav className="container grid grid-cols-[auto_1fr_auto] items-center gap-4">
        <Link
          href="/#hero"
          className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/40 py-1.5 pl-1.5 pr-3 backdrop-blur transition-colors hover:border-accent/50"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-xs font-bold text-white shadow-[0_8px_24px_-12px_rgb(var(--accent))]">
            DR
          </span>
          <span className="hidden text-sm font-bold tracking-tight sm:inline">
            {siteConfig.name.split(" ")[0]}
            <span className="text-accent">.</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden justify-center lg:flex">
          <div className="flex items-center gap-2 rounded-full border border-border/70 bg-surface/50 p-1.5 shadow-[0_18px_60px_-36px_rgb(0_0_0)] backdrop-blur-xl">
            <ul className="flex items-center gap-0.5">
              {nav.map((item) => {
                const activeItem = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href.startsWith("#") ? `/${item.href}` : item.href}
                      aria-current={activeItem ? "page" : undefined}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                        activeItem
                          ? "bg-fg text-bg"
                          : "text-muted hover:bg-surface-2 hover:text-fg"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {featureNav.length > 0 && (
              <ul className="flex items-center gap-1 border-l border-border/70 pl-2">
                {featureNav.map((item) => {
                  const Icon = item.icon;
                  const activeItem = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={activeItem ? "page" : undefined}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors",
                          activeItem
                            ? "border-accent bg-accent text-white"
                            : "border-accent/25 bg-accent/10 text-accent hover:bg-accent hover:text-white"
                        )}
                      >
                        <Icon size={14} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_36px_-16px_rgb(var(--accent))] transition-colors hover:bg-accent-2"
          >
            <Mail size={15} />
            Let&apos;s Connect
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 lg:hidden">
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
        <div className="container mt-3 lg:hidden">
          <ul className="flex flex-col gap-1 rounded-2xl border border-border bg-surface p-3 shadow-[0_20px_70px_-45px_rgb(0_0_0)]">
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
            {featureNav.length > 0 && (
              <li className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
                {featureNav.map((item) => {
                  const Icon = item.icon;
                  const activeItem = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={activeItem ? "page" : undefined}
                      className={cn(
                        "inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors",
                        activeItem
                          ? "border-accent bg-accent text-white"
                          : "border-accent/25 bg-accent/10 text-accent"
                      )}
                    >
                      <Icon size={15} />
                      {item.label}
                    </Link>
                  );
                })}
              </li>
            )}
            <li className="mt-2 flex items-center justify-between border-t border-border px-2 pt-3">
              <SocialBar />
              <Link
                href="/#contact"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
              >
                <Mail size={15} />
                Connect
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
