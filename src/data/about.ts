import type { AboutContent } from "@/types";

/**
 * About / bio content. Add paragraphs, highlights, and headline stats here.
 */
export const about: AboutContent = {
  heading: "About Me",
  photo: "https://i.postimg.cc/W3xW2XR4/IMG20230114163238.jpg",
  paragraphs: [
    "I'm a full-stack web developer from NIT Rourkela who loves turning ideas into polished, production-ready products. I work across the stack — designing clean interfaces, building robust APIs, and shipping features that scale.",
    "My focus is on writing maintainable code, crafting delightful user experiences, and continuously learning. Whether it's a marketing site, a complex dashboard, or a mobile app, I care about performance, accessibility, and the details that make software feel great to use.",
  ],
  highlights: [
    "Designing intuitive Web/App interfaces (UI/UX)",
    "Building full-stack web applications (MERN / Next.js)",
    "Developing cross-platform Android/iOS apps",
    "Writing clean, tested, maintainable code",
  ],
  stats: [
    { value: "20+", label: "Projects Built" },
    { value: "3+", label: "Years Coding" },
    { value: "15+", label: "Technologies" },
    { value: "100%", label: "Commitment" },
  ],
  resumeUrl: "/resume.pdf",
};
