"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { hero } from "@/data/hero";
import { Button } from "@/components/ui/Button";
import { Typewriter } from "@/components/ui/Typewriter";
import { SocialBar } from "@/components/ui/SocialBar";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { fadeUp, stagger } from "@/lib/motion";

/**
 * Hero / banner. The Three.js scene sits behind the headline; content is
 * data-driven from `data/hero.ts`.
 */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* 3D background */}
      <HeroCanvas />

      {/* Readability gradient over the canvas */}
      <div className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-b from-bg/40 via-bg/10 to-bg" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="container relative z-10"
      >
        <motion.p
          variants={fadeUp}
          className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-accent"
        >
          {hero.eyebrow}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl"
        >
          Hi, I&apos;m {hero.name}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-4 text-2xl font-semibold md:text-3xl"
        >
          I&apos;m a <Typewriter words={hero.roles} />
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-xl text-base text-muted md:text-lg"
        >
          {hero.tagline}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
          {hero.ctas.map((cta) => (
            <Button key={cta.label} href={cta.href} variant={cta.variant}>
              {cta.label}
            </Button>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-8">
          <SocialBar />
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted transition-colors hover:text-accent"
      >
        <ChevronDown className="animate-bounce" size={28} />
      </a>
    </section>
  );
}
