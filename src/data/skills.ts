import type { SkillGroup } from "@/types";

/**
 * Skills grouped by category. Each skill renders as a logo chip — `icon` is an
 * icon-registry key (see components/ui/BrandIcon) and `color` is the brand
 * color used on hover. `icon` on the group is a lucide name for the header.
 *
 * To add a skill: append to the relevant group. To add a logo that isn't
 * registered yet, add it once in components/ui/BrandIcon.tsx.
 */
export const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    icon: "Layout",
    caption: "Crafting fast, accessible interfaces",
    skills: [
      { name: "React", icon: "SiReact", color: "#61DAFB" },
      { name: "Next.js", icon: "SiNextdotjs", color: "#FFFFFF" },
      { name: "TypeScript", icon: "SiTypescript", color: "#3178C6" },
      { name: "JavaScript", icon: "SiJavascript", color: "#F7DF1E" },
      { name: "Tailwind CSS", icon: "SiTailwindcss", color: "#38BDF8" },
      { name: "HTML5", icon: "SiHtml5", color: "#E34F26" },
      { name: "CSS", icon: "SiCss", color: "#663399" },
      { name: "Three.js", icon: "SiThreedotjs", color: "#FFFFFF" },
    ],
  },
  {
    category: "Backend",
    icon: "Server",
    caption: "APIs, databases & business logic",
    skills: [
      { name: "Node.js", icon: "SiNodedotjs", color: "#5FA04E" },
      { name: "Express", icon: "SiExpress", color: "#FFFFFF" },
      { name: "MongoDB", icon: "SiMongodb", color: "#47A248" },
      { name: "PostgreSQL", icon: "SiPostgresql", color: "#4169E1" },
    ],
  },
  {
    category: "Tools & Platforms",
    icon: "Wrench",
    caption: "Shipping & collaborating",
    skills: [
      { name: "Git", icon: "SiGit", color: "#F05032" },
      { name: "GitHub", icon: "SiGithub", color: "#FFFFFF" },
      { name: "Docker", icon: "SiDocker", color: "#2496ED" },
      { name: "Vercel", icon: "SiVercel", color: "#FFFFFF" },
      { name: "Figma", icon: "SiFigma", color: "#F24E1E" },
    ],
  },
];
