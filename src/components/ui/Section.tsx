"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

interface SectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * A page section wrapper: provides the scroll anchor id, vertical rhythm, and a
 * staggered in-view animation container. Use <SectionHeader> for the title.
 */
export function Section({ id, className, children }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={stagger}
      className={cn("scroll-mt-24 py-20 md:py-28", className)}
    >
      <div className="container">{children}</div>
    </motion.section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeaderProps) {
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "mb-14 max-w-2xl",
        align === "center" && "mx-auto text-center"
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-muted">{subtitle}</p>}
      <div
        className={cn(
          "mt-5 h-1 w-16 rounded-full bg-accent",
          align === "center" && "mx-auto"
        )}
      />
    </motion.div>
  );
}
