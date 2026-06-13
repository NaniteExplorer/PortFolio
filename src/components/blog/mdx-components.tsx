import Link from "next/link";
import type { MDXComponents } from "mdx/types";

/**
 * Styling overrides for MDX-rendered content (used by next-mdx-remote).
 * Keeps blog posts visually consistent with the site.
 */
export const mdxComponents: MDXComponents = {
  h1: (props) => <h1 className="mt-8 text-3xl font-bold" {...props} />,
  h2: (props) => <h2 className="mt-8 text-2xl font-bold" {...props} />,
  h3: (props) => <h3 className="mt-6 text-xl font-bold" {...props} />,
  p: (props) => <p className="mt-4 leading-relaxed text-muted" {...props} />,
  ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-6 text-muted" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  a: ({ href = "#", ...props }) => (
    <Link href={href} className="text-accent underline underline-offset-2" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="mt-6 border-l-2 border-accent pl-4 italic text-fg"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-surface-2 px-1.5 py-0.5 text-sm text-accent"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface-2 p-4 text-sm"
      {...props}
    />
  ),
};
