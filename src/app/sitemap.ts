import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/config";
import { getAllPosts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/seo";

/** Auto-generated sitemap from the home page + all blog posts. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, priority: 1 },
  ];

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
