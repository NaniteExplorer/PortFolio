"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { fadeUp } from "@/lib/motion";

/** Testimonials / recommendations. Data: `data/testimonials.ts`. */
export function Testimonials() {
  return (
    <Section id="testimonials">
      <SectionHeader
        eyebrow="Kind words"
        title="What People Say"
        subtitle="Feedback from people I've worked with."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <motion.div key={t.author} variants={fadeUp}>
            <Card className="flex h-full flex-col">
              <Quote className="mb-4 text-accent" size={28} />
              <p className="flex-1 text-sm leading-relaxed text-fg">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                {t.avatar ? (
                  <Image
                    src={t.avatar}
                    alt={t.author}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 font-bold text-accent">
                    {t.author.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold">{t.author}</p>
                  <p className="text-xs text-muted">
                    {t.role}
                    {t.company ? ` · ${t.company}` : ""}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
