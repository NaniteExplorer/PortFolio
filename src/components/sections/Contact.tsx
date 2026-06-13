"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2, AlertCircle, Mail, MapPin } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { SocialBar } from "@/components/ui/SocialBar";
import { fadeUp } from "@/lib/motion";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Contact section with a working form posting to /api/contact. Shows inline
 * success/error feedback. The API route gracefully no-ops (logs only) if no
 * email provider is configured.
 */
export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

  return (
    <Section id="contact">
      <SectionHeader
        eyebrow="Get in touch"
        title="Let's Work Together"
        subtitle="Have a project in mind or just want to say hi? Drop me a message."
      />

      <div className="grid gap-10 md:grid-cols-2">
        <motion.div variants={fadeUp} className="space-y-6">
          <p className="text-muted">
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision. Let&apos;s build something
            great.
          </p>
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Mail size={18} />
              </span>
              debasishrana@example.com
            </p>
            <p className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                <MapPin size={18} />
              </span>
              Rourkela, India
            </p>
          </div>
          <SocialBar />
        </motion.div>

        <motion.form variants={fadeUp} onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="name" required placeholder="Your name" className={inputClass} />
            <input
              name="email"
              type="email"
              required
              placeholder="Your email"
              className={inputClass}
            />
          </div>
          <input name="subject" placeholder="Subject" className={inputClass} />
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Your message"
            className={inputClass}
          />

          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-2 disabled:opacity-60"
          >
            {status === "sending" ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Sending…
              </>
            ) : (
              <>
                <Send size={16} /> Send Message
              </>
            )}
          </button>

          {status === "success" && (
            <p className="flex items-center gap-2 text-sm text-green-500">
              <CheckCircle2 size={16} /> Thanks! Your message has been sent.
            </p>
          )}
          {status === "error" && (
            <p className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle size={16} /> {error}
            </p>
          )}
        </motion.form>
      </div>
    </Section>
  );
}
