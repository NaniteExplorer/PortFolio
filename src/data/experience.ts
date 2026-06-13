import type { Experience } from "@/types";

/**
 * Work & education timeline, newest-first. `current: true` adds a live pulse;
 * `logo` is an icon-registry key; `link` makes the company clickable.
 *
 * NOTE: Copy is intentionally concise and outcome-focused — refine the metrics
 * and tech tags as roles evolve.
 */
export const experiences: Experience[] = [
  {
    role: "Software Engineer",
    company: "Evolutionary Algorithms (EVA)",
    period: "2025 — Present",
    location: "Bhubaneswar, Odisha, India",
    type: "work",
    kind: "Full-time",
    current: true,
    logo: "Boxes",
    description:
      "Building a CAD-based product platform — turning complex geometric and engineering workflows into performant, dependable software used by design and manufacturing teams.",
    highlights: [
      "Develop core product modules with a focus on correctness, performance, and clean architecture",
      "Collaborate across engineering and design to ship features against real production workloads",
      "Own components end to end — from design and implementation through testing and release",
    ],
    tags: ["Software Engineering", "CAD", "Algorithms", "System Design"],
  },
  {
    role: "Web Development Head — ASME Student Chapter",
    company: "ASME, NIT Rourkela",
    period: "2023 — 2024",
    location: "Rourkela, India",
    type: "work",
    kind: "Leadership",
    logo: "Code2",
    description:
      "Led the web team for the ASME student chapter and shipped the chapter's first official website — establishing the digital presence used for events, recruitment, and member engagement.",
    highlights: [
      "Designed, built, and launched the chapter's first-ever website (v1 release)",
      "Led a small web team — set direction, reviewed work, and drove the project to delivery",
      "Delivered a responsive, accessible site that became the chapter's primary public face",
    ],
    tags: ["React", "Next.js", "Tailwind CSS", "Team Leadership"],
  },
  {
    role: "B.Tech, Engineering",
    company: "NIT Rourkela",
    period: "2021 — 2025",
    location: "Rourkela, India",
    type: "education",
    kind: "Education",
    logo: "GraduationCap",
    description:
      "Built a strong foundation in data structures, algorithms, and software engineering alongside hands-on project and leadership work.",
    highlights: [
      "Active in coding clubs, hackathons, and competitive programming",
      "Self-taught modern web development alongside the core curriculum",
    ],
    tags: ["DSA", "C++", "Algorithms", "Web Development"],
  },
];
