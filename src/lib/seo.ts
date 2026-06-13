import type { Metadata } from "next";
import { siteConfig } from "@/data/config";

/** Absolute URL helper, given a path. */
export function absoluteUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Build a Next.js Metadata object with sensible OpenGraph/Twitter defaults.
 * Pass overrides per page.
 */
export function buildMetadata(overrides: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
} = {}): Metadata {
  const title = overrides.title
    ? `${overrides.title} — ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.role}`;
  const description = overrides.description ?? siteConfig.description;
  const url = absoluteUrl(overrides.path ?? "/");
  const image = absoluteUrl(overrides.image ?? siteConfig.ogImage);

  return {
    title,
    description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    alternates: { canonical: url },
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

/** JSON-LD structured data describing the person (rich results). */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    description: siteConfig.description,
    url: siteConfig.url,
  };
}
