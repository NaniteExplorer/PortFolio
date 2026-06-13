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
    "UI/UX Enthusiast",
    "Problem Solver",
  ],
  tagline:
    "I design and build performant, accessible web experiences end to end — from NIT Rourkela to the world.",
  ctas: [
    { label: "View My Work", href: "#projects", variant: "primary" },
    { label: "Get In Touch", href: "#contact", variant: "ghost" },
  ],
};
