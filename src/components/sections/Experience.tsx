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
        subtitle="Where I've worked, studied, and grown as a developer."
      />

      <div className="relative mx-auto max-w-3xl">
        {/* Rail */}
        <div className="absolute left-[22px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-accent/60 via-border to-transparent" />

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
                <span className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-accent">
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

                <div className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/40">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">{exp.role}</h3>
                        {exp.current && (
                          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-muted">
                        {exp.link ? (
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 hover:text-accent"
                          >
                            {exp.company}
                            <ArrowUpRight size={13} />
                          </a>
                        ) : (
                          exp.company
                        )}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-accent">{exp.period}</p>
                  </div>

                  {exp.location && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-muted">
                      <MapPin size={12} /> {exp.location}
                    </p>
                  )}

                  <p className="mt-3 text-sm text-muted">{exp.description}</p>

                  {exp.highlights && (
                    <ul className="mt-3 space-y-1.5">
                      {exp.highlights.map((h) => (
                        <li key={h} className="flex gap-2 text-sm text-muted">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}

                  {exp.tags && (
                    <div className="mt-4 flex flex-wrap gap-2">
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
