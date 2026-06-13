import { cn } from "@/lib/utils";

/** Surface card with subtle border + hover lift. */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]",
        className
      )}
    >
      {children}
    </div>
  );
}
