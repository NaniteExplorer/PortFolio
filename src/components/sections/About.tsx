"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Download, CheckCircle2 } from "lucide-react";
import { about } from "@/data/about";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { fadeUp } from "@/lib/motion";

/** About section — bio, highlights, stats, resume CTA. Data: `data/about.ts`. */
export function About() {
  return (
    <Section id="about">
      <SectionHeader eyebrow="Get to know me" title={about.heading} />

      <div className="grid items-center gap-12 md:grid-cols-2">
        <motion.div variants={fadeUp} className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-tr from-accent/30 to-transparent blur-2xl" />
          <div className="overflow-hidden rounded-3xl border border-border">
            <Image
              src={about.photo}
              alt="Portrait"
              width={500}
              height={600}
              className="h-full w-full object-cover"
              priority={false}
            />
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          {about.paragraphs.map((p, i) => (
            <p key={i} className="mb-4 text-muted">
              {p}
            </p>
          ))}

          <ul className="mt-6 space-y-3">
            {about.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 shrink-0 text-accent" size={18} />
                <span className="text-sm text-fg">{h}</span>
              </li>
            ))}
          </ul>

          {about.resumeUrl && (
            <Button href={about.resumeUrl} external className="mt-8">
              <Download size={16} /> Download Resume
            </Button>
          )}
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div
        variants={fadeUp}
        className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {about.stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-surface p-6 text-center"
          >
            <p className="text-3xl font-extrabold text-accent">{s.value}</p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </motion.div>
    </Section>
  );
}
