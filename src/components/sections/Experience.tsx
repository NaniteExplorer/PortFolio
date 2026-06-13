"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { experiences } from "@/data/experience";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { fadeUp } from "@/lib/motion";

/**
 * Experience timeline — a clean single-rail layout with logo nodes, a live
 * pulse on current roles, company links, and tech tags. Data: `data/experience.ts`.
 */
export function Experience() {
  return (
    <Section id="experience">
      <SectionHeader
        eyebrow="My journey"
        title="Experience & Education"
        subtitle="From building a student chapter's first website to engineering CAD-based product software — a path defined by ownership and craft."
      />

      <div className="relative mx-auto max-w-3xl">
        {/* Rail */}
        <div className="absolute left-[22px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-accent/70 via-border to-transparent" />

        <div className="space-y-8">
          {experiences.map((exp) => {
            // Prefer a registered logo; fall back to a lucide glyph by type.
            const fallbackIcon = exp.type === "education" ? "GraduationCap" : "Briefcase";
            return (
              <motion.div
                key={`${exp.company}-${exp.role}`}
                variants={fadeUp}
                className="relative pl-16"
              >
                {/* Node */}
                <span className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-accent shadow-sm ring-1 ring-inset ring-white/5">
                  {exp.logo && exp.logo.startsWith("Si") ? (
                    <BrandIcon name={exp.logo} size={20} />
                  ) : (
                    <Icon name={(exp.logo as never) ?? (fallbackIcon as never)} size={20} />
                  )}
                  {exp.current && (
                    <span className="absolute -right-1 -top-1 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
                    </span>
                  )}
                </span>

                <div className="group rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
                  {/* Meta row: category chip + period */}
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {exp.kind && (
                        <span className="rounded-full border border-border bg-bg/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                          {exp.kind}
                        </span>
                      )}
                      {exp.current && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/12 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                          Current
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-xs font-semibold tracking-wide text-accent">
                      {exp.period}
                    </p>
                  </div>

                  <h3 className="text-lg font-bold tracking-tight">{exp.role}</h3>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                    {exp.link ? (
                      <a
                        href={exp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 font-medium text-fg/80 transition-colors hover:text-accent"
                      >
                        {exp.company}
                        <ArrowUpRight size={13} />
                      </a>
                    ) : (
                      <span className="font-medium text-fg/80">{exp.company}</span>
                    )}
                    {exp.location && (
                      <>
                        <span className="text-border">•</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} /> {exp.location}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted">{exp.description}</p>

                  {exp.highlights && (
                    <ul className="mt-4 space-y-2 border-l border-border/70 pl-4">
                      {exp.highlights.map((h) => (
                        <li key={h} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}

                  {exp.tags && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {exp.tags.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
