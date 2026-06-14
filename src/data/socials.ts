import type { SocialLink } from "@/types";
import { contact } from "@/data/contact";

/**
 * Social / connect links. Shown in the navbar, footer, and contact area.
 * `icon` is an icon-registry key (see components/ui/BrandIcon) — add new logos
 * there. `primary: true` highlights it as a featured "connect" channel.
 *
 * The "Email" entry is built from `data/contact.ts` so the address stays in
 * sync everywhere.
 */
export const socials: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/debasish1452003",
    icon: "SiGithub",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/debasish-rana-6b4bb021a/",
    icon: "Linkedin",
    primary: true,
  },
  {
    label: "WhatsApp",
    href: `https://wa.me/91${contact.phone}?text=Hi%20Debasish%2C%20I%20saw%20your%20portfolio`,
    icon: "SiWhatsapp",
    primary: true,
  },
  {
    label: "Email",
    href: `mailto:${contact.email}`,
    icon: "Mail",
    primary: true,
  },
  { label: "X", href: "https://x.com/Debasis03527067", icon: "SiX" },
  { label: "Instagram", href: "https://instagram.com/", icon: "SiInstagram" },
];
