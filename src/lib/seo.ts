import type { Metadata } from "next";
import { competitive } from "@/data/competitive";
import { siteConfig } from "@/data/config";
import { devAccounts } from "@/data/devprofile";
import { socials } from "@/data/socials";

/** Absolute URL helper, given a path. */
export function absoluteUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Build a Next.js Metadata object with OpenGraph/Twitter defaults and
 * page-level controls for keywords and indexing.
 */
export function buildMetadata(
  overrides: {
    title?: string;
    description?: string;
    path?: string;
    image?: string;
    keywords?: string[];
    noindex?: boolean;
  } = {}
): Metadata {
  const title = overrides.title
    ? `${overrides.title} | ${siteConfig.name}`
    : `${siteConfig.name} | Full-Stack Developer from NIT Rourkela`;
  const description = overrides.description ?? siteConfig.description;
  const url = absoluteUrl(overrides.path ?? "/");
  const image = absoluteUrl(overrides.image ?? siteConfig.ogImage);
  const keywords = Array.from(
    new Set([...(siteConfig.keywords ?? []), ...(overrides.keywords ?? [])])
  );

  return {
    title,
    description,
    keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    alternates: { canonical: url },
    robots: overrides.noindex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/** JSON-LD structured data describing the person behind the portfolio. */
export function personJsonLd() {
  const sameAs = Array.from(
    new Set([
      ...socials
        .filter((social) => ["GitHub", "LinkedIn", "X"].includes(social.label))
        .map((social) => social.href),
      ...devAccounts.map((account) => account.url),
      ...competitive.platforms.map((platform) => platform.url),
    ])
  );

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    alternateName: ["debasishRana", "NaniteExplorer", "Nanite Explorer"],
    jobTitle: `${siteConfig.role} and Competitive Programmer`,
    description: siteConfig.description,
    url: siteConfig.url,
    image: absoluteUrl(siteConfig.ogImage),
    email: "mailto:debasishrana1452003@gmail.com",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "National Institute of Technology Rourkela",
      alternateName: "NIT Rourkela",
      url: "https://www.nitrkl.ac.in/",
    },
    knowsAbout: [
      "Full-stack web development",
      "Competitive programming",
      "React",
      "Next.js",
      "Node.js",
      "Algorithms",
      "Data structures",
      "TypeScript",
      "MERN stack",
    ],
    sameAs,
  };
}

/** JSON-LD structured data describing the portfolio website. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: ["Debasish Rana Portfolio", "debasishRana", "NaniteExplorer"],
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: {
      "@type": "Person",
      name: siteConfig.name,
    },
  };
}
