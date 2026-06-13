"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, MapPin } from "lucide-react";
import { experiences } from "@/data/experience";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { fadeUp } from "@/lib/motion";

/** Experience timeline. Data: `data/experience.ts`. */
export function Experience() {
  return (
    <Section id="experience">
      <SectionHeader
        eyebrow="My journey"
        title="Experience & Education"
        subtitle="Where I've worked, studied, and grown as a developer."
      />

      <div className="relative mx-auto max-w-3xl">
        {/* Vertical line */}
        <div className="absolute left-4 top-2 h-full w-px bg-border md:left-1/2" />

        <div className="space-y-10">
          {experiences.map((exp, i) => {
            const Icon = exp.type === "education" ? GraduationCap : Briefcase;
            const leftSide = i % 2 === 0;
            return (
              <motion.div
                key={`${exp.company}-${exp.role}`}
                variants={fadeUp}
                className={`relative pl-12 md:w-1/2 md:pl-0 ${
                  leftSide ? "md:pr-12 md:text-right" : "md:ml-auto md:pl-12"
                }`}
              >
                {/* Node */}
                <span
                  className={`absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-accent bg-bg text-accent md:left-auto ${
                    leftSide ? "md:-right-4" : "md:-left-4"
                  }`}
                >
                  <Icon size={16} />
                </span>

                <div className="rounded-2xl border border-border bg-surface p-6">
                  <p className="text-sm font-semibold text-accent">{exp.period}</p>
                  <h3 className="mt-1 text-lg font-bold">{exp.role}</h3>
                  <p className="text-sm text-muted">{exp.company}</p>
                  {exp.location && (
                    <p
                      className={`mt-1 flex items-center gap-1 text-xs text-muted ${
                        leftSide ? "md:justify-end" : ""
                      }`}
                    >
                      <MapPin size={12} /> {exp.location}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-muted">{exp.description}</p>

                  {exp.highlights && (
                    <ul
                      className={`mt-3 space-y-1 text-sm text-muted ${
                        leftSide ? "md:list-none" : ""
                      }`}
                    >
                      {exp.highlights.map((h) => (
                        <li key={h}>• {h}</li>
                      ))}
                    </ul>
                  )}

                  {exp.tags && (
                    <div
                      className={`mt-4 flex flex-wrap gap-2 ${
                        leftSide ? "md:justify-end" : ""
                      }`}
                    >
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
