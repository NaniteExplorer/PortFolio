"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/data/skills";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { fadeUp, viewportOnce } from "@/lib/motion";

/** Skills section — grouped skills with proficiency bars. Data: `data/skills.ts`. */
export function Skills() {
  return (
    <Section id="skills">
      <SectionHeader
        eyebrow="What I work with"
        title="Skills & Technologies"
        subtitle="A snapshot of the tools and technologies I use to bring ideas to life."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {skillGroups.map((group) => (
          <motion.div key={group.category} variants={fadeUp}>
            <Card className="h-full">
              <h3 className="mb-6 text-lg font-bold">{group.category}</h3>
              <div className="space-y-5">
                {group.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium">{skill.name}</span>
                      {skill.level != null && (
                        <span className="text-muted">{skill.level}%</span>
                      )}
                    </div>
                    {skill.level != null && (
                      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={viewportOnce}
                          transition={{ duration: 0.9, ease: "easeOut" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
