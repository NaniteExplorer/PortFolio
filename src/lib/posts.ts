import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Post, PostFrontmatter } from "@/types";
import { readingTime } from "@/lib/utils";

/**
 * Server-only blog loader. Reads `.mdx` files from `src/data/posts`, parses
 * frontmatter with gray-matter, and returns typed Post objects. Runs at build
 * time (App Router server components), so there is no client bundle cost.
 */

const POSTS_DIR = path.join(process.cwd(), "src", "data", "posts");

function ensureDir(): boolean {
  return fs.existsSync(POSTS_DIR);
}

/** All post slugs (filenames without extension). */
export function getPostSlugs(): string[] {
  if (!ensureDir()) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

/** Load a single post by slug, or null if missing. */
export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;

  return {
    ...fm,
    slug,
    content,
    readingTime: readingTime(content),
  };
}

/** All published posts, newest first (drafts excluded in production). */
export function getAllPosts(): Post[] {
  return getPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is Post => p !== null)
    .filter((p) => (process.env.NODE_ENV === "production" ? !p.draft : true))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
