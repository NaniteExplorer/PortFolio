import type { ComponentType } from "react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiDocker,
  SiVercel,
  SiFigma,
  SiThreedotjs,
  SiLeetcode,
  SiCodeforces,
  SiCodechef,
  SiHackerrank,
  SiGeeksforgeeks,
  SiHackerearth,
  SiCodingninjas,
  SiWhatsapp,
  SiInstagram,
  SiX,
  SiGmail,
} from "react-icons/si";
import { Linkedin, Mail, Globe, Code2, Twitter } from "lucide-react";

// Permissive shape so both lucide-react and react-icons components fit.
type IconComponent = ComponentType<{
  size?: number | string;
  className?: string;
  color?: string;
}>;

/**
 * ───────────────────────────────────────────────────────────────────────────
 *  ICON REGISTRY — the single place to register brand/tech logos.
 * ───────────────────────────────────────────────────────────────────────────
 *  Data files reference icons by these string keys (e.g. icon: "SiReact").
 *  To add a new logo: import it above and add ONE line here. Everything that
 *  uses <BrandIcon /> (skills, socials, CP platforms) picks it up automatically.
 *
 *  Tree-shaken: only the icons imported here ship in the bundle.
 */
export const iconRegistry: Record<string, IconComponent> = {
  // Tech / skills
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiDocker,
  SiVercel,
  SiFigma,
  SiThreedotjs,
  // Competitive programming platforms
  SiLeetcode,
  SiCodeforces,
  SiCodechef,
  SiHackerrank,
  SiGeeksforgeeks,
  SiHackerearth,
  SiCodingninjas,
  // Social / connect
  SiWhatsapp,
  SiInstagram,
  SiX,
  SiGmail,
  Linkedin,
  Mail,
  Globe,
  Code2,
  Twitter,
};

/** Brand colors used by monogram fallbacks and accents. */
export const brandColors: Record<string, string> = {
  leetcode: "#FFA116",
  codeforces: "#1F8ACB",
  atcoder: "#222222",
  codechef: "#5B4638",
  geeksforgeeks: "#2F8D46",
  hackerrank: "#00EA64",
  hackerearth: "#2C3454",
  codingninjas: "#FC4F41",
};

interface BrandIconProps {
  /** A registry key (e.g. "SiReact") or undefined for the monogram fallback. */
  name?: string;
  /** Fallback label used to render a monogram when no icon is registered. */
  fallbackLabel?: string;
  size?: number;
  className?: string;
  color?: string;
}

/**
 * Renders a brand/tech logo by registry key. If the key isn't registered, it
 * draws a tasteful monogram from `fallbackLabel` — so platforms without an
 * official icon (e.g. AtCoder) still look intentional.
 */
export function BrandIcon({
  name,
  fallbackLabel,
  size = 22,
  className,
  color,
}: BrandIconProps) {
  const Cmp = name ? iconRegistry[name] : undefined;

  if (Cmp) {
    return <Cmp size={size} className={className} color={color} />;
  }

  // Monogram fallback.
  const letter = (fallbackLabel ?? name ?? "?").charAt(0).toUpperCase();
  return (
    <span
      className={className}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.55,
        color,
      }}
      aria-hidden
    >
      <span className="flex h-full w-full items-center justify-center font-bold leading-none">
        {letter}
      </span>
    </span>
  );
}
