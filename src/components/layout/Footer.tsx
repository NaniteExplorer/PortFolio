import Link from "next/link";
import { Code2, MapPin, Sparkles } from "lucide-react";
import { siteConfig } from "@/data/config";
import { about } from "@/data/about";
import { SocialBar } from "@/components/ui/SocialBar";
import type { AboutContent, SiteConfig } from "@/types";

/** Professional footer with dynamic owner-managed profile details. */
export function Footer({
  config = siteConfig,
  aboutContent = about,
}: {
  config?: SiteConfig;
  aboutContent?: AboutContent;
}) {
  const year = new Date().getFullYear();
  const quickLinks = [
    { label: "About", href: "/#about" },
    { label: "Projects", href: "/#projects" },
    { label: "Experience", href: "/#experience" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="container grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr_1fr] md:items-start">
        <div>
          <Link href="/#hero" className="text-xl font-bold">
            {config.name}
            <span className="text-accent">.</span>
          </Link>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
            {config.role} building polished, performant products with a practical full-stack mindset.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {aboutContent.availability && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-300">
                <Sparkles size={13} />
                {aboutContent.availability}
              </span>
            )}
            {aboutContent.location && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2/70 px-3 py-1 text-muted">
                <MapPin size={13} className="text-accent" />
                {aboutContent.location}
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Navigate
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-muted transition-colors hover:text-accent">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="md:text-right">
          <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <Code2 size={13} />
            Connect
          </p>
          <div className="flex md:justify-end">
            <SocialBar />
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container flex flex-col gap-2 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {config.name}. All rights reserved.</p>
          <p>Built with Next.js, Three.js, and careful little details.</p>
        </div>
      </div>
    </footer>
  );
}
