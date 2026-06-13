import type { Experience } from "@/types";

/**
 * Work & education timeline, newest-first. `current: true` adds a live pulse;
 * `logo` is an icon-registry key; `link` makes the company clickable.
 */
export const experiences: Experience[] = [
  {
    role: "Full-Stack Developer",
    company: "Freelance / Personal Projects",
    period: "2023 — Present",
    location: "Remote",
    type: "work",
    current: true,
    logo: "Code2",
    description:
      "Designing and shipping full-stack web applications for clients and personal ventures, owning everything from UI to deployment.",
    highlights: [
      "Built and deployed 10+ MERN-stack and Next.js applications end to end",
      "Designed reusable component systems and accessible, responsive UIs",
      "Set up CI/CD and serverless deployments on Vercel with 99.9% uptime",
    ],
    tags: ["React", "Next.js", "Node.js", "MongoDB", "Tailwind CSS"],
  },
  {
    role: "Open Source Contributor",
    company: "GitHub Community",
    period: "2022 — Present",
    location: "Remote",
    type: "work",
    current: true,
    logo: "SiGithub",
    link: "https://github.com/debasish1452003",
    description:
      "Contributing to open-source projects and maintaining personal repositories used by other developers.",
    highlights: [
      "Submitted pull requests to community libraries and tooling",
      "Maintain well-documented starter templates and utilities",
    ],
    tags: ["Git", "TypeScript", "Documentation"],
  },
  {
    role: "B.Tech, Engineering",
    company: "NIT Rourkela",
    period: "2021 — 2025",
    location: "Rourkela, India",
    type: "education",
    logo: "GraduationCap",
    description:
      "Building a strong foundation in data structures, algorithms, and software engineering alongside hands-on project work.",
    highlights: [
      "Active in coding clubs, hackathons, and competitive programming",
      "Self-taught modern web development alongside the core curriculum",
    ],
    tags: ["DSA", "C++", "Algorithms", "Web Development"],
  },
];
