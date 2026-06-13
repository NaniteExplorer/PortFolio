"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/data/skills";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

/**
 * Skills — a refined, logo-led tech stack. No percentage bars (those read as
 * junior); instead, brand-accurate logos in elegant grouped cards with a subtle
 * brand-colored glow on hover. Data: `data/skills.ts`.
 */
export function Skills() {
  return (
    <Section id="skills">
      <SectionHeader
        eyebrow="What I work with"
        title="Tech Stack"
        subtitle="The tools and technologies I reach for to design, build, and ship."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <motion.div
            key={group.category}
            variants={fadeUp}
            className="rounded-3xl border border-border bg-surface p-7"
          >
            <div className="mb-1 flex items-center gap-2.5">
              {group.icon && (
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon name={group.icon as never} size={18} />
                </span>
              )}
              <h3 className="text-lg font-bold">{group.category}</h3>
            </div>
            {group.caption && (
              <p className="mb-6 text-sm text-muted">{group.caption}</p>
            )}

            <motion.ul
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="flex flex-wrap gap-2.5"
            >
              {group.skills.map((skill) => (
                <motion.li
                  key={skill.name}
                  variants={fadeUp}
                  className="group/chip relative flex items-center gap-2 rounded-xl border border-border bg-surface-2/60 px-3.5 py-2.5 transition-all duration-200 hover:border-transparent"
                  style={{ ["--brand" as string]: skill.color ?? "rgb(var(--accent))" }}
                >
                  {/* brand glow on hover */}
                  <span
                    className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover/chip:opacity-100"
                    style={{
                      boxShadow: `0 0 0 1px ${skill.color ?? "rgb(var(--accent))"}, 0 8px 24px -12px ${skill.color ?? "rgb(var(--accent))"}`,
                    }}
                  />
                  <span
                    className="relative text-muted transition-colors duration-200 group-hover/chip:[color:var(--brand)]"
                    style={{ ["--brand" as string]: skill.color ?? "rgb(var(--accent))" }}
                  >
                    <BrandIcon name={skill.icon} fallbackLabel={skill.name} size={18} />
                  </span>
                  <span className="relative text-sm font-medium">{skill.name}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
