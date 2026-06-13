import type { SkillGroup } from "@/types";

/**
 * Skills grouped by category. `level` (0–100) drives the proficiency bar;
 * omit it to render a plain chip. `icon` can be a lucide name or a logo URL.
 */
export const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    skills: [
      { name: "React", level: 92 },
      { name: "Next.js", level: 88 },
      { name: "TypeScript", level: 85 },
      { name: "JavaScript (ES6+)", level: 90 },
      { name: "Tailwind CSS", level: 90 },
      { name: "HTML & CSS", level: 95 },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", level: 85 },
      { name: "Express", level: 82 },
      { name: "MongoDB", level: 80 },
      { name: "REST APIs", level: 85 },
      { name: "PostgreSQL", level: 70 },
    ],
  },
  {
    category: "Tools & Platforms",
    skills: [
      { name: "Git & GitHub", level: 90 },
      { name: "Docker", level: 65 },
      { name: "Vercel", level: 85 },
      { name: "Figma", level: 75 },
      { name: "Three.js", level: 70 },
    ],
  },
];
