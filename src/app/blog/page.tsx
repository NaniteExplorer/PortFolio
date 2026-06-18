import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminSettings, mergeSiteConfig } from "@/lib/admin-settings";
import { getAllPosts } from "@/lib/posts";
import { buildMetadata } from "@/lib/seo";
import { PostCard } from "@/components/blog/PostCard";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Articles by Debasish Rana on web development, Next.js, Three.js, competitive programming, and software engineering.",
  path: "/blog",
  keywords: [
    "Debasish Rana blog",
    "Debasish Rana articles",
    "Next.js blog",
    "competitive programming blog",
  ],
});

/** Blog index — lists all published posts (server component, SSG). */
export default async function BlogPage() {
  const config = mergeSiteConfig(await getAdminSettings());
  if (!config.blogEnabled) notFound();

  const posts = getAllPosts();

  return (
    <div className="container min-h-screen pt-32 pb-20">
      <header className="mb-14 max-w-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Writing
        </p>
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-4 text-muted">
          Thoughts on web development, design, and the tools I use.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-muted">
          No posts yet. Add an <code className="text-accent">.mdx</code> file to{" "}
          <code className="text-accent">src/data/posts/</code>.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
