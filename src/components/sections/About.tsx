"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, animate, useInView } from "framer-motion";
import { Download, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { about } from "@/data/about";
import { skillGroups } from "@/data/skills";
import type { Stat } from "@/types";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { fadeUp } from "@/lib/motion";

/** Live numbers fetched from /api/about-stats (GitHub-derived). */
interface LiveStats {
  repos: number;
  contributions: number;
}

/** Total distinct technologies across every skill group. */
const TECH_COUNT = new Set(
  skillGroups.flatMap((g) => g.skills.map((s) => s.name))
).size;

/** Whole years since `about.codingSince` (min 1). */
function yearsCoding(): number {
  if (!about.codingSince) return 0;
  const start = new Date(about.codingSince);
  if (Number.isNaN(start.getTime())) return 0;
  const years = (Date.now() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  return Math.max(1, Math.floor(years));
}

/** Resolve a stat's display string, preferring live data over the fallback. */
function resolveStat(stat: Stat, live: LiveStats, years: number): string {
  switch (stat.source) {
    case "repos":
      return live.repos > 0 ? `${live.repos}+` : stat.value;
    case "contributions":
      return live.contributions > 0 ? `${live.contributions}+` : stat.value;
    case "years":
      return years > 0 ? `${years}+` : stat.value;
    case "technologies":
      return TECH_COUNT > 0 ? `${TECH_COUNT}+` : stat.value;
    default:
      return stat.value;
  }
}

/** Animated count-up for stat values like "20+", "3+", "734+". Re-runs when
 *  the value changes (e.g. when live GitHub numbers arrive). */
function StatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  // Split into prefix / number / suffix so "100%" and "20+" both animate.
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const [display, setDisplay] = useState(match ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    if (!inView || !match) {
      if (!match) setDisplay(value);
      return;
    }
    const target = parseFloat(match[2]);
    const controls = animate(0, target, {
      duration: 1.3,
      ease: [0.21, 0.47, 0.32, 0.98],
      onUpdate: (v) => setDisplay(`${match[1]}${Math.round(v)}${match[3]}`),
    });
    return () => controls.stop();
    // Re-animate when the resolved value string changes.
  }, [inView, value]); // eslint-disable-line react-hooks/exhaustive-deps

  return <span ref={ref}>{display}</span>;
}

/** About section — bio, focus areas, live animated stats, resume CTA. Data: `data/about.ts`. */
export function About() {
  const focusAreas =
    about.focusAreas ??
    about.highlights.map((h) => ({ icon: "Check" as const, title: h, description: "" }));

  const years = useMemo(yearsCoding, []);
  const [live, setLive] = useState<LiveStats>({ repos: 0, contributions: 0 });

  useEffect(() => {
    let active = true;
    fetch("/api/about-stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (active && d) {
          setLive({
            repos: Number(d.repos) || 0,
            contributions: Number(d.contributions) || 0,
          });
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <Section id="about">
      <SectionHeader eyebrow="Get to know me" title={about.heading} />

      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-16">
        {/* ── Portrait ─────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="relative mx-auto w-full max-w-sm">
          {/* Ambient glow */}
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-accent/30 via-accent/5 to-transparent blur-2xl" />

          <div className="group relative overflow-hidden rounded-[1.75rem] border border-border bg-surface">
            <Image
              src={about.photo}
              alt="Portrait"
              width={500}
              height={620}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              priority={false}
            />
            {/* Bottom fade for legibility of overlaid card */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
          </div>

          {/* Floating availability / location card */}
          {(about.availability || about.location) && (
            <div className="absolute -bottom-5 left-1/2 w-[88%] -translate-x-1/2 rounded-2xl border border-border bg-surface/90 p-4 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md">
              {about.availability && (
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-sm font-semibold text-fg">
                    {about.availability}
                  </span>
                </div>
              )}
              {about.location && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
                  <MapPin size={13} className="text-accent" /> {about.location}
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* ── Bio + focus areas ────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="lg:pt-2">
          {about.subheading && (
            <p className="mb-5 inline-flex items-center gap-2 text-xl font-semibold leading-snug tracking-tight text-fg md:text-2xl">
              <Sparkles size={18} className="shrink-0 text-accent" />
              {about.subheading}
            </p>
          )}

          {about.paragraphs.map((p, i) => (
            <p key={i} className="mb-4 leading-relaxed text-muted">
              {p}
            </p>
          ))}

          {/* Focus area cards */}
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {focusAreas.map((f) => (
              <div
                key={f.title}
                className="group flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors duration-200 hover:border-accent/50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
                  <Icon name={f.icon} size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-fg">{f.title}</p>
                  {f.description && (
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">
                      {f.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            {about.resumeUrl && (
              <Button href={about.resumeUrl} external>
                <Download size={16} /> Download Resume
              </Button>
            )}
            {about.secondaryCta && (
              <Button href={about.secondaryCta.href} variant="ghost">
                {about.secondaryCta.label} <ArrowRight size={16} />
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {about.stats.map((s) => (
          <div
            key={s.label}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
          >
            {/* Accent wash on hover */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/0 to-accent/0 opacity-0 transition-opacity duration-300 group-hover:from-accent/[0.07] group-hover:opacity-100" />
            {s.icon && (
              <Icon
                name={s.icon}
                size={20}
                className="mx-auto mb-2 text-accent/70 transition-colors duration-300 group-hover:text-accent"
              />
            )}
            <p className="text-3xl font-extrabold tracking-tight text-accent md:text-4xl">
              <StatValue value={resolveStat(s, live, years)} />
            </p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </motion.div>
    </Section>
  );
}
