/**
 * Shared type definitions for all portfolio content.
 *
 * These types are the contract for everything under `src/data/*`. When you edit
 * a data file, your editor will autocomplete fields and flag mistakes against
 * the shapes defined here.
 */

import type { LucideIcon } from "lucide-react";

/** A single navigation entry. `href` is an in-page anchor or a route. */
export interface NavItem {
  label: string;
  href: string;
}

/** Identifies which section components exist and can be ordered/toggled. */
export type SectionId =
  | "hero"
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "services"
  | "testimonials"
  | "contact";

/** A social / external profile link rendered in the navbar and footer. */
export interface SocialLink {
  label: string;
  href: string;
  /** lucide-react icon name, resolved in components/ui/SocialBar. */
  icon: keyof typeof import("lucide-react");
}

/** Call-to-action button used in the hero and elsewhere. */
export interface CTA {
  label: string;
  href: string;
  /** "primary" = filled accent, "ghost" = outlined. */
  variant?: "primary" | "ghost";
}

/** Hero / banner content. */
export interface HeroContent {
  /** Small eyebrow text above the name, e.g. "Full-Stack Developer". */
  eyebrow: string;
  /** Your name. */
  name: string;
  /** Words cycled by the typewriter effect. */
  roles: string[];
  /** Supporting sentence under the headline. */
  tagline: string;
  ctas: CTA[];
}

/** A single stat shown in the About section (e.g. "5+ Years"). */
export interface Stat {
  value: string;
  label: string;
}

/** About / bio content. */
export interface AboutContent {
  heading: string;
  /** Paragraphs of bio copy. */
  paragraphs: string[];
  /** Profile photo (local path under /public or remote URL). */
  photo: string;
  /** Short bullet highlights. */
  highlights: string[];
  stats: Stat[];
  /** Path to resume file under /public, e.g. "/resume.pdf". */
  resumeUrl?: string;
}

/** One skill with an optional 0–100 proficiency. */
export interface Skill {
  name: string;
  /** lucide icon name, or a remote/local logo URL. Optional. */
  icon?: string;
  level?: number;
}

/** A named group of skills, e.g. "Frontend". */
export interface SkillGroup {
  category: string;
  skills: Skill[];
}

/** A work / education timeline entry. */
export interface Experience {
  role: string;
  company: string;
  /** e.g. "Jan 2023 — Present". */
  period: string;
  location?: string;
  description: string;
  /** Bullet achievements. */
  highlights?: string[];
  /** Tech used in this role. */
  tags?: string[];
  type?: "work" | "education";
}

/** A portfolio project / case study. */
export interface Project {
  /** Stable unique id / slug. */
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  /** Live deployment URL. */
  liveUrl?: string;
  /** Source repository URL. */
  repoUrl?: string;
  /** Featured projects are highlighted first. */
  featured?: boolean;
  year?: string;
}

/** A service you offer. */
export interface Service {
  title: string;
  description: string;
  /** lucide icon name. */
  icon: keyof typeof import("lucide-react");
}

/** A testimonial / recommendation. */
export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
}

/** Blog post frontmatter parsed from MDX files. */
export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  cover?: string;
  draft?: boolean;
}

/** A fully resolved blog post (frontmatter + slug + raw body). */
export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
  readingTime: string;
}

/** Top-level site configuration. */
export interface SiteConfig {
  /** Used for <title>, OpenGraph, JSON-LD. */
  name: string;
  /** Job title / role for SEO and JSON-LD. */
  role: string;
  /** Site-wide meta description. */
  description: string;
  /** Canonical URL (no trailing slash). Falls back to env. */
  url: string;
  /** OpenGraph image path under /public. */
  ogImage: string;
  /** Locale, e.g. "en_US". */
  locale: string;
  /** Navigation items. */
  nav: NavItem[];
  /** Ordered list of sections to render on the home page. */
  sections: SectionId[];
  /** Toggle the blog route + nav entry. */
  blogEnabled: boolean;
  /** Analytics configuration. */
  analytics: {
    provider: "vercel" | "plausible" | "none";
  };
  /** Author keywords for SEO. */
  keywords: string[];
}

export type IconName = keyof typeof import("lucide-react");
export type { LucideIcon };
