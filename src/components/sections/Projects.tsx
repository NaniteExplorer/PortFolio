"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Star } from "lucide-react";
import { projects } from "@/data/projects";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";

/**
 * Projects gallery with tag filtering. Driven entirely by `data/projects.ts` —
 * add an entry there and it appears here automatically.
 */
export function Projects() {
  const [filter, setFilter] = useState<string>("All");

  // Unique tags across all projects, for the filter bar.
  const tags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ["All", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    const list =
      filter === "All"
        ? projects
        : projects.filter((p) => p.tags.includes(filter));
    // Featured first.
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [filter]);

  return (
    <Section id="projects">
      <SectionHeader
        eyebrow="My work"
        title="Featured Projects"
        subtitle="A selection of things I've designed and built. Filter by technology below."
      />

      {/* Filter bar */}
      <motion.div
        variants={fadeUp}
        className="mb-10 flex flex-wrap justify-center gap-2"
      >
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filter === tag
                ? "border-accent bg-accent text-white"
                : "border-border text-muted hover:border-accent hover:text-accent"
            )}
          >
            {tag}
          </button>
        ))}
      </motion.div>

      <motion.div
        layout
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.article
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="group relative flex h-full min-h-[520px] flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/50"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
                <SmartImage
                  src={project.image}
                  alt={project.title}
                  fill
                  loaderSize="sm"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {project.featured && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent/90 px-2.5 py-1 text-xs font-semibold text-white">
                    <Star size={12} /> Featured
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold leading-snug">{project.title}</h3>
                  {project.year && (
                    <span className="shrink-0 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-muted">
                      {project.year}
                    </span>
                  )}
                </div>
                <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-muted">
                  {project.description}
                </p>

                <div className="mt-4 flex min-h-[4.75rem] flex-wrap content-start gap-2">
                  {project.tags.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>

                <div className="mt-auto flex items-center gap-3 border-t border-border/70 pt-5 text-sm">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 font-medium text-accent transition-colors hover:bg-accent hover:text-white"
                    >
                      <ExternalLink size={15} /> Live
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-medium text-muted transition-colors hover:border-accent/50 hover:text-fg"
                    >
                      <Github size={15} /> Code
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
