import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/config";
import { getAllPosts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/seo";

/** Auto-generated sitemap for public, indexable pages. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, priority: 1 },
  ];

  if (siteConfig.competitiveEnabled) {
    routes.push({ url: absoluteUrl("/competitive"), lastModified: now, priority: 0.9 });
  }

  if (siteConfig.devProfileEnabled) {
    routes.push({ url: absoluteUrl("/dev"), lastModified: now, priority: 0.85 });
  }

  if (siteConfig.dedicationEnabled) {
    routes.push({ url: absoluteUrl("/dedication"), lastModified: now, priority: 0.7 });
  }

  if (siteConfig.blogEnabled) {
    routes.push({ url: absoluteUrl("/blog"), lastModified: now, priority: 0.8 });
    for (const post of getAllPosts()) {
      routes.push({
        url: absoluteUrl(`/blog/${post.slug}`),
        lastModified: new Date(post.date),
        priority: 0.6,
      });
    }
  }

  return routes;
}
