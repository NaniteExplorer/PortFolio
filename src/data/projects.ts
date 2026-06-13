import type { Project } from "@/types";

/**
 * ───────────────────────────────────────────────────────────────────────────
 *  PROJECTS — add a new case study by appending an object to this array.
 *  No component edits required: the Projects section maps over this data.
 * ───────────────────────────────────────────────────────────────────────────
 *  `featured: true` surfaces a project in the highlighted grid.
 */
export const projects: Project[] = [
  {
    id: "amazekart",
    title: "AmazeKart",
    description:
      "A full-featured e-commerce platform with product catalog, cart, checkout, and an admin dashboard. Built on the MERN stack with secure auth and Stripe payments.",
    image: "https://i.postimg.cc/85Dk5vhF/Image-Editor-1.png",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    liveUrl: "#",
    repoUrl: "#",
    featured: true,
    year: "2024",
  },
  {
    id: "portfolio-3d",
    title: "3D Portfolio",
    description:
      "This very portfolio — a performant Next.js site with an interactive Three.js hero, data-driven content, and a built-in MDX blog.",
    image: "https://i.postimg.cc/nrtyFHqS/i-Phone-15.png",
    tags: ["Next.js", "Three.js", "TypeScript", "Tailwind"],
    liveUrl: "#",
    repoUrl: "#",
    featured: true,
    year: "2024",
  },
  {
    id: "task-manager",
    title: "TaskFlow",
    description:
      "A collaborative task management app with real-time updates, drag-and-drop boards, and team workspaces.",
    image: "https://i.postimg.cc/nrtyFHqS/i-Phone-15.png",
    tags: ["React", "Express", "Socket.IO", "PostgreSQL"],
    liveUrl: "#",
    repoUrl: "#",
    featured: true,
    year: "2023",
  },
  {
    id: "weather-app",
    title: "SkyCast",
    description:
      "A clean weather dashboard with location search, 7-day forecasts, and animated condition visuals powered by a public weather API.",
    image: "https://i.postimg.cc/nrtyFHqS/i-Phone-15.png",
    tags: ["React", "API", "Chart.js"],
    liveUrl: "#",
    repoUrl: "#",
    year: "2023",
  },
  {
    id: "blog-cms",
    title: "InkWell CMS",
    description:
      "A headless content management system with a markdown editor, role-based access, and a fast public-facing blog.",
    image: "https://i.postimg.cc/nrtyFHqS/i-Phone-15.png",
    tags: ["Next.js", "Prisma", "tRPC"],
    liveUrl: "#",
    repoUrl: "#",
    year: "2023",
  },
  {
    id: "chat-app",
    title: "Converse",
    description:
      "A real-time chat application with group rooms, typing indicators, and message persistence.",
    image: "https://i.postimg.cc/nrtyFHqS/i-Phone-15.png",
    tags: ["React", "Node.js", "WebSockets"],
    liveUrl: "#",
    repoUrl: "#",
    year: "2022",
  },
];
