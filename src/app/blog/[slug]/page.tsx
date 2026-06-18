import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug, getPostSlugs } from "@/lib/posts";
import { buildMetadata } from "@/lib/seo";
import { mdxComponents } from "@/components/blog/mdx-components";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface Params {
  params: { slug: string };
}

/** Pre-render all post routes at build time (SSG). */
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return buildMetadata({ title: "Post not found" });
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.cover,
    keywords: post.tags,
  });
}

/** Individual blog post rendered from MDX. */
export default function PostPage({ params }: Params) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  // Suggested reading: other recent posts.
  const others = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <article className="container max-w-3xl pt-32 pb-20">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent"
      >
        <ArrowLeft size={16} /> Back to blog
      </Link>

      <header className="mt-8">
        {post.tags && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} /> {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} /> {post.readingTime}
          </span>
        </div>
      </header>

      {post.cover && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mt-8">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>

      {others.length > 0 && (
        <footer className="mt-16 border-t border-border pt-10">
          <h2 className="mb-6 text-xl font-bold">Keep reading</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent/50"
              >
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
}
