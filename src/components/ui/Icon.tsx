"use client";

import { icons } from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { IconName } from "@/types";

/**
 * Resolve a lucide icon by name at runtime so data files can reference icons
 * by string (e.g. `icon: "Github"`). Falls back to a neutral dot if unknown.
 */
export function Icon({
  name,
  ...props
}: { name: IconName } & LucideProps) {
  const LucideIcon = icons[name as keyof typeof icons] ?? icons.Circle;
  return <LucideIcon {...props} />;
}
