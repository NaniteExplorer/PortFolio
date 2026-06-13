import type { SocialLink } from "@/types";

/**
 * Social / external profile links. Shown in the navbar and footer.
 * `icon` is a lucide-react icon name (see https://lucide.dev/icons).
 */
export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/debasish1452003", icon: "Github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "Linkedin" },
  { label: "Twitter", href: "https://twitter.com/", icon: "Twitter" },
  { label: "Email", href: "mailto:debasishrana@example.com", icon: "Mail" },
];
