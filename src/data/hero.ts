import type { HeroContent } from "@/types";

/**
 * Hero / banner content. `roles` cycle through a typewriter effect.
 */
export const hero: HeroContent = {
  eyebrow: "Web Developer",
  name: "Debasish Rana",
  roles: [
    "Full-Stack Developer",
    "React & Next.js Engineer",
    "Competitive Programmer",
    "Problem Solver",
  ],
  tagline:
    "Debasish Rana is a full-stack developer and competitive programmer from NIT Rourkela, designing fast, accessible web experiences end to end.",
  ctas: [
    { label: "View My Work", href: "#projects", variant: "primary" },
    { label: "Get In Touch", href: "#contact", variant: "ghost" },
  ],
};
