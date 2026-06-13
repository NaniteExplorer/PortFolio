import type { ComponentType, ReactElement } from "react";
import type { SectionId } from "@/types";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Competitive } from "@/components/sections/Competitive";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

/**
 * Maps each SectionId to its component. `app/page.tsx` reads the ordered
 * `siteConfig.sections` array and renders the matching components — so the
 * page composition is fully data-driven.
 */
// Sections may be plain client/server components OR async server components
// (e.g. `Competitive`, which awaits live data) — hence the Promise return union.
type SectionComponent = ComponentType | (() => Promise<ReactElement>);

export const sectionRegistry: Record<SectionId, SectionComponent> = {
  hero: Hero,
  about: About,
  skills: Skills,
  competitive: Competitive,
  experience: Experience,
  projects: Projects,
  testimonials: Testimonials,
  contact: Contact,
};
