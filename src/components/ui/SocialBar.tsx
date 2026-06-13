import { socials } from "@/data/socials";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** Row of social icon links, driven by `data/socials.ts`. */
export function SocialBar({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target={s.href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          aria-label={s.label}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
        >
          <Icon name={s.icon} size={18} />
        </a>
      ))}
    </div>
  );
}
