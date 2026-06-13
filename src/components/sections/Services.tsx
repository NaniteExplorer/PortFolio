"use client";

import { motion } from "framer-motion";
import { services } from "@/data/services";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { fadeUp } from "@/lib/motion";

/** Services offered. Data: `data/services.ts`. */
export function Services() {
  return (
    <Section id="services">
      <SectionHeader
        eyebrow="What I offer"
        title="Services"
        subtitle="How I can help bring your ideas to life."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <motion.div key={service.title} variants={fadeUp}>
            <Card className="h-full">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Icon name={service.icon} size={24} />
              </div>
              <h3 className="mb-2 text-lg font-bold">{service.title}</h3>
              <p className="text-sm text-muted">{service.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
