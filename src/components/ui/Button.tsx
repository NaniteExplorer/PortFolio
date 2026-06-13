import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "subtle";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-2 shadow-[0_8px_30px_-12px_rgb(var(--accent))]",
  ghost:
    "border border-border text-fg hover:border-accent hover:text-accent bg-transparent",
  subtle: "bg-surface-2 text-fg hover:bg-surface",
};

interface ButtonProps {
  href?: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}

/** Polymorphic button: renders a Link when `href` is given, else a <button>. */
export function Button({
  href,
  variant = "primary",
  className,
  children,
  external,
  type = "button",
  onClick,
  disabled,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-60 disabled:pointer-events-none",
    variants[variant],
    className
  );

  if (href) {
    const isExternal = external ?? /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
