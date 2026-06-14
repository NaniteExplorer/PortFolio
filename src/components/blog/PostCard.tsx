import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import type { Post } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { SmartImage } from "@/components/ui/SmartImage";
import { formatDate } from "@/lib/utils";

/** Card linking to a blog post. Used on the blog index. */
export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
    >
      {post.cover && (
        <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
          <SmartImage
            src={post.cover}
            alt={post.title}
            fill
            loaderSize="sm"
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        {post.tags && (
          <div className="mb-3 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        )}
        <h3 className="text-lg font-bold transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-muted">{post.excerpt}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Calendar size={13} /> {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} /> {post.readingTime}
          </span>
        </div>
      </div>
    </Link>
  );
}
