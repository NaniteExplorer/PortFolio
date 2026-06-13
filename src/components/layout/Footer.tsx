import Link from "next/link";
import { siteConfig } from "@/data/config";
import { SocialBar } from "@/components/ui/SocialBar";

/** Site footer with quick links and socials. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
        <div className="text-center md:text-left">
          <Link href="/#hero" className="text-lg font-bold">
            {siteConfig.name}
            <span className="text-accent">.</span>
          </Link>
          <p className="mt-1 text-sm text-muted">
            {siteConfig.role} · Built with Next.js &amp; Three.js
          </p>
        </div>

        <SocialBar />
      </div>
      <div className="border-t border-border">
        <p className="container py-4 text-center text-xs text-muted">
          © {year} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
