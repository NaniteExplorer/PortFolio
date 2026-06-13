import type { Testimonial } from "@/types";

/**
 * Testimonials / recommendations. `avatar` is optional (local or remote URL).
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Debasish delivered our platform ahead of schedule and the quality was outstanding. He communicates clearly and genuinely cares about the end result.",
    author: "Priya Sharma",
    role: "Product Manager",
    company: "TechNova",
  },
  {
    quote:
      "One of the most reliable developers I've worked with. Clean code, thoughtful architecture, and a great eye for design.",
    author: "Arjun Mehta",
    role: "Founder",
    company: "StartupX",
  },
  {
    quote:
      "He took a vague idea and turned it into a polished product. Highly recommend for anyone needing full-stack expertise.",
    author: "Sarah Williams",
    role: "Design Lead",
    company: "Creatify",
  },
];
