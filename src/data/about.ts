import type { AboutContent } from "@/types";
import { contact } from "@/data/contact";

/**
 * About / bio content. Add paragraphs, focus areas, and headline stats here.
 */
export const about: AboutContent = {
  heading: "About Me",
  subheading: "Engineering products that feel effortless to use.",
  photo: "https://i.postimg.cc/W3xW2XR4/IMG20230114163238.jpg",
  location: contact.location,
  availability: "Available for new opportunities",
  paragraphs: [
    "I'm Debasish Rana, a full-stack developer and competitive programmer from NIT Rourkela who turns ambiguous ideas into polished, production-ready products. I'm equally at home designing a clean interface, shaping a resilient API, or untangling the edge cases that decide whether software actually ships.",
    "I optimize for the long game — maintainable code, thoughtful architecture, and experiences that feel fast and intentional. Performance, accessibility, and the small details are where I spend my attention, because that's what separates a demo from a product people trust.",
  ],
  focusAreas: [
    {
      icon: "Palette",
      title: "Interface & UX",
      description: "Designing intuitive, accessible web and mobile interfaces.",
    },
    {
      icon: "Layers",
      title: "Full-Stack Engineering",
      description: "End-to-end apps with the MERN stack and Next.js.",
    },
    {
      icon: "Smartphone",
      title: "Cross-Platform Apps",
      description: "Native-feeling Android and iOS experiences.",
    },
    {
      icon: "ShieldCheck",
      title: "Code Quality",
      description: "Clean, tested, maintainable code built to scale.",
    },
  ],
  highlights: [
    "Designing intuitive Web/App interfaces (UI/UX)",
    "Building full-stack web applications (MERN / Next.js)",
    "Developing cross-platform Android/iOS apps",
    "Writing clean, tested, maintainable code",
  ],
  // When you wrote your first real code — drives the live "Years Coding" stat.
  codingSince: "2022",
  stats: [
    // `value` is the fallback; `source` makes the number live where possible.
    { value: "20+", label: "GitHub Repos", icon: "FolderGit2", source: "repos" },
    { value: "3+", label: "Years Coding", icon: "CalendarClock", source: "years" },
    { value: "15+", label: "Technologies", icon: "Boxes", source: "technologies" },
    {
      value: "500+",
      label: "Contributions",
      icon: "GitCommitHorizontal",
      source: "contributions",
    },
  ],
  resumeUrl: "/resume.pdf",
  secondaryCta: { label: "Let's work together", href: "#contact" },
};
