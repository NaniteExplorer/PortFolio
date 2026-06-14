import type { Project } from "@/types";

/**
 * PROJECTS - add a new case study by appending an object to this array.
 * No component edits required: the Projects section maps over this data.
 */
export const projects: Project[] = [
  {
    id: "amazekart",
    title: "AmazeKart",
    description:
      "A full-stack e-commerce platform with a product catalog, cart, checkout flow, admin dashboard, secure authentication, and Stripe payments.",
    image: "https://i.postimg.cc/pLzBzS8k/Screenshot-2026-06-14-193035.png",
    tags: ["MongoDB", "Express", "React", "Node.js", "Stripe"],
    liveUrl: "https://buy-genius-amaze-kart.vercel.app/",
    repoUrl: "https://github.com/NaniteExplorer/AmaezeKart",
    featured: false,
    year: "2023",
  },
  {
    id: "nex-hire",
    title: "NexHire",
    description:
      "A campus-to-career platform that connects students, colleges, and recruiters through role-based dashboards, hiring workflows, and profile management.",
    image: "https://i.postimg.cc/rwDwH6QX/Screenshot-2026-06-14-193827.png",
    tags: ["React", "Redux", "Tailwind CSS", "Node.js", "Express", "MongoDB"],
    liveUrl: "https://nexhire-role.vercel.app/",
    repoUrl: "https://github.com/NaniteExplorer/NexHIRE",
    featured: true,
    year: "2024",
  },
  {
    id: "nexus-dag",
    title: "NexusDAG",
    description:
      "A graph-based project planning app with role-aware dashboards, Kanban execution, task reviews, critical path analysis, delay analytics, and Three.js workflow visualization.",
    image: "https://i.postimg.cc/VkKHdpcT/Screenshot-2026-06-14-194512.png",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Three.js"],
    liveUrl: "https://nexusdag.vercel.app/",
    repoUrl: "https://github.com/NaniteExplorer/NexusDAG",
    featured: true,
    year: "2025",
  },
  {
    id: "crave-radar",
    title: "CraveRADAR",
    description:
      "A real-time street-food discovery platform with live vendor locations, reviews, and media feeds for vendors who do not stay in one place.",
    image: "https://i.postimg.cc/hPPLfjPR/Screenshot-2026-06-14-194803.png",
    tags: ["React", "TypeScript", "MongoDB"],
    liveUrl: "https://crave-radar-web.vercel.app/",
    repoUrl: "https://github.com/NaniteExplorer/CraveRadar",
    featured: true,
    year: "2026",
  },
  {
    id: "asme-nitrkl",
    title: "ASME NIT Rourkela",
    description:
      "The official v1 landing page for the ASME student chapter at NIT Rourkela, built to present events, initiatives, and club information.",
    image: "https://i.postimg.cc/RCGPP2WG/Screenshot-2026-06-14-200051.png",
    tags: ["React", "Node.js", "Tailwind CSS"],
    liveUrl: "https://asme-nitrkl.vercel.app/",
    repoUrl: "https://github.com/NaniteExplorer/ASME-Website",
    featured: false,
    year: "2023",
  },
  {
    id: "algo-viz",
    title: "AlgoVIZ",
    description:
      "A Three.js-powered algorithm visualization platform that demonstrates sorting, searching, traversal, and graph algorithms through interactive 3D scenes.",
    image: "https://i.postimg.cc/yYmN4XzD/Screenshot-2026-06-14-195514.png",
    tags: ["React", "Node.js", "Three.js", "React Three Fiber", "Algorithms"],
    liveUrl: "https://algo-viz-neon.vercel.app/",
    repoUrl: "https://github.com/NaniteExplorer/AlgoVIZ",
    featured: true,
    year: "2026",
  },
  {
    id: "stock-mania",
    title: "StockMania",
    description:
      "A finance tracker that helps users monitor expenses, organize transactions, and understand spending patterns through a clean dashboard.",
    image: "https://i.postimg.cc/1Xc4HpmD/Screenshot-2026-06-14-200925.png",
    tags: ["Next.js", "TypeScript"],
    liveUrl: "https://stock-mania.vercel.app/sign-in",
    repoUrl: "https://github.com/NaniteExplorer/Stock-Mania",
    featured: true,
    year: "2026",
  },
  {
    id: "cric-verse",
    title: "CricVerse",
    description:
      "A cricket analytics platform with an automated ESPNcricinfo scraping pipeline, Cricsheet-backed historical data, ML-ready datasets, and a Next.js web app.",
    image: "https://i.postimg.cc/g2hQBN9T/Screenshot-2026-06-14-201407.png",
    tags: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Auth.js",
      "Cheerio",
      "Node Cron",
    ],
    liveUrl: "https://crick-verse-web.vercel.app/",
    repoUrl: "https://github.com/NaniteExplorer/CrickVerse",
    featured: true,
    year: "2026",
  },
];
