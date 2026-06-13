import type { SocialLink } from "@/types";

/**
 * Social / connect links. Shown in the navbar, footer, and contact area.
 * `icon` is an icon-registry key (see components/ui/BrandIcon) — add new logos
 * there. `primary: true` highlights it as a featured "connect" channel.
 */
export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/debasish1452003", icon: "SiGithub" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "Linkedin", primary: true },
  {
    label: "WhatsApp",
    // Replace 91XXXXXXXXXX with your country code + number.
    href: "https://wa.me/91XXXXXXXXXX?text=Hi%20Debasish%2C%20I%20saw%20your%20portfolio",
    icon: "SiWhatsapp",
    primary: true,
  },
  { label: "Email", href: "mailto:debasishrana@example.com", icon: "Mail", primary: true },
  { label: "X", href: "https://x.com/", icon: "SiX" },
  { label: "Instagram", href: "https://instagram.com/", icon: "SiInstagram" },
];
