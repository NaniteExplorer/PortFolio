import type { ComponentType } from "react";
import type { SectionId } from "@/types";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

/**
 * Maps each SectionId to its component. `app/page.tsx` reads the ordered
 * `siteConfig.sections` array and renders the matching components — so the
 * page composition is fully data-driven.
 */
export const sectionRegistry: Record<SectionId, ComponentType> = {
  hero: Hero,
  about: About,
  skills: Skills,
  experience: Experience,
  projects: Projects,
  services: Services,
  testimonials: Testimonials,
  contact: Contact,
};
