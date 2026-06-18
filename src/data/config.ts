import type { SiteConfig } from "@/types";

/**
 * ───────────────────────────────────────────────────────────────────────────
 *  SITE CONFIG — the control panel for your portfolio.
 * ───────────────────────────────────────────────────────────────────────────
 *  Edit your name, role, SEO text, navigation, and which sections appear
 *  (and in what order) here. Reorder `sections` to rearrange the page; remove
 *  an id to hide that section entirely.
 */
export const siteConfig: SiteConfig = {
  name: "Debasish Rana",
  role: "Full-Stack Web Developer",
  description:
    "Debasish Rana is a full-stack developer and competitive programmer from NIT Rourkela, building fast web apps with React, Next.js, and Node.js.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://debasishrana.vercel.app",
  ogImage: "/og.png",
  locale: "en_US",

  // Order here = order on the page. Remove an entry to hide that section.
  sections: [
    "hero",
    "about",
    "skills",
    "competitive",
    "dedication",
    "experience",
    "projects",
    // "testimonials" — hidden until real recommendations are available.
    "contact",
  ],

  nav: [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
  ],

  blogEnabled: true,
  competitiveEnabled: true,
  devProfileEnabled: true,
  dedicationEnabled: true,

  analytics: {
    provider: "none", // "vercel" | "plausible" | "none"
  },

  keywords: [
    "Debasish Rana",
    "debasishRana",
    "debasish",
    "NaniteExplorer",
    "Nanite Explorer",
    "Full-Stack Developer",
    "Competitive Programmer",
    "React Developer",
    "Next.js",
    "Node.js",
    "MERN Stack",
    "Web Developer Portfolio",
    "NIT Rourkela",
  ],
};
