import type { Experience } from "@/types";

/**
 * Work & education timeline. Listed newest-first. `type` controls the icon
 * ("work" vs "education").
 */
export const experiences: Experience[] = [
  {
    role: "Full-Stack Developer",
    company: "Freelance / Personal Projects",
    period: "2023 — Present",
    location: "Remote",
    type: "work",
    description:
      "Designing and shipping full-stack web applications for clients and personal ventures, owning everything from UI to deployment.",
    highlights: [
      "Built and deployed multiple MERN-stack and Next.js applications",
      "Implemented responsive, accessible interfaces with reusable component systems",
      "Set up CI/CD and serverless deployments on Vercel",
    ],
    tags: ["React", "Next.js", "Node.js", "MongoDB", "Tailwind CSS"],
  },
  {
    role: "B.Tech, Engineering",
    company: "NIT Rourkela",
    period: "2021 — 2025",
    location: "Rourkela, India",
    type: "education",
    description:
      "Studying engineering while building a strong foundation in data structures, algorithms, and software development.",
    highlights: [
      "Active in coding clubs and hackathons",
      "Self-taught modern web development alongside coursework",
    ],
    tags: ["DSA", "C++", "Web Development", "Algorithms"],
  },
];
