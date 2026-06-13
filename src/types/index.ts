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
  | "competitive"
  | "experience"
  | "projects"
  | "services"
  | "testimonials"
  | "contact";

/** A social / external profile link rendered in the navbar and footer. */
export interface SocialLink {
  label: string;
  href: string;
  /** Icon registry key (see components/ui/BrandIcon) — e.g. "SiGithub", "Mail". */
  icon: string;
  /** Mark as a primary "connect" channel (highlighted in the contact area). */
  primary?: boolean;
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

/** One skill / technology. */
export interface Skill {
  name: string;
  /** Icon registry key (see components/ui/BrandIcon), e.g. "SiReact". */
  icon?: string;
  /** Brand color for the logo; falls back to the accent. */
  color?: string;
}

/** A named group of skills, e.g. "Frontend". */
export interface SkillGroup {
  category: string;
  /** lucide icon name shown beside the category label. */
  icon?: string;
  /** Short descriptor for the category. */
  caption?: string;
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
  /** Marks the current/ongoing role (renders a live pulse). */
  current?: boolean;
  /** Optional external link (company site, certificate). */
  link?: string;
  /** Icon registry key for a company/school logo (e.g. "SiGithub"). */
  logo?: string;
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

/* ─────────────────────────────  Competitive Programming  ───────────────── */

/** A single key/value metric shown on a platform card (e.g. "Contests · 42"). */
export interface CPMetric {
  label: string;
  value: string | number;
}

/** A slice for charts (donut/bar). */
export interface CPDataPoint {
  label: string;
  value: number;
  /** Optional explicit color; otherwise auto-assigned. */
  color?: string;
}

/** A competitive-programming profile on one platform. */
export interface CPPlatform {
  /** Stable id, also used for brand color lookup (e.g. "leetcode"). */
  id: string;
  /** Display name, e.g. "LeetCode". */
  name: string;
  /** Your handle / username. */
  handle: string;
  /** Profile URL. */
  url: string;
  /** Icon registry key (e.g. "SiLeetcode"); omit to use a monogram. */
  icon?: string;
  /** Brand color (hex). Falls back to a known color or the accent. */
  color?: string;
  /** Current rating, if the platform is rated. */
  rating?: number;
  /** Peak rating. */
  maxRating?: number;
  /** Rank / title, e.g. "Knight", "Expert", "4★". */
  rank?: string;
  /** Total problems solved on this platform. */
  solved?: number;
  /** Number of rated contests participated in. */
  contests?: number;
  /** Extra freeform metrics shown on the card. */
  metrics?: CPMetric[];
  /** Per-platform difficulty/topic breakdown for the platform card chart. */
  breakdown?: CPDataPoint[];
}

/** A standout achievement / badge. */
export interface CPAchievement {
  title: string;
  detail?: string;
  /** lucide icon name. */
  icon?: string;
}

/** Aggregate competitive-programming profile (drives /competitive). */
export interface CPProfile {
  headline: string;
  summary: string;
  platforms: CPPlatform[];
  /** Global difficulty breakdown (e.g. Easy/Medium/Hard) for the donut chart. */
  difficulty: CPDataPoint[];
  /** Highlight achievements / badges. */
  achievements: CPAchievement[];
  /**
   * Optional daily activity counts (most recent last) for the heatmap. Each
   * number is a submission/solve count for one day.
   */
  activity?: number[];
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
  /** Toggle the /competitive analytics route + nav entry. */
  competitiveEnabled: boolean;
  /** Analytics configuration. */
  analytics: {
    provider: "vercel" | "plausible" | "none";
  };
  /** Author keywords for SEO. */
  keywords: string[];
}

export type IconName = keyof typeof import("lucide-react");
export type { LucideIcon };
