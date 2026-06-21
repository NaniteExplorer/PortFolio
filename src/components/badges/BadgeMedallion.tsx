"use client";

import type { BadgeAchievement, BadgeTier, BadgeTrack } from "@/types";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { Lock, Star } from "lucide-react";

const TIER_STYLE: Record<
  BadgeTier,
  { metal: string; face: string; text: string; glow: string; ribbon: string }
> = {
  bronze: {
    metal: "from-[#6B3A1E] via-[#D99155] to-[#3E2418]",
    face: "from-[#2A1711] via-[#9B552F] to-[#160E0B]",
    text: "text-[#E7A36B]",
    glow: "shadow-[0_18px_42px_-28px_rgba(231,163,107,0.9)]",
    ribbon: "from-[#7C2D12] to-[#C2410C]",
  },
  silver: {
    metal: "from-[#64748B] via-[#F8FAFC] to-[#94A3B8]",
    face: "from-[#111827] via-[#64748B] to-[#0F172A]",
    text: "text-[#E2E8F0]",
    glow: "shadow-[0_18px_42px_-28px_rgba(226,232,240,0.9)]",
    ribbon: "from-[#334155] to-[#94A3B8]",
  },
  gold: {
    metal: "from-[#7C4A03] via-[#FDE68A] to-[#D97706]",
    face: "from-[#211404] via-[#B7791F] to-[#100A04]",
    text: "text-[#FDE68A]",
    glow: "shadow-[0_22px_54px_-28px_rgba(253,230,138,0.95)]",
    ribbon: "from-[#92400E] to-[#F59E0B]",
  },
  platinum: {
    metal: "from-[#0F766E] via-[#CCFBF1] to-[#67E8F9]",
    face: "from-[#062B32] via-[#0F766E] to-[#071923]",
    text: "text-[#A7F3D0]",
    glow: "shadow-[0_22px_54px_-28px_rgba(103,232,249,0.95)]",
    ribbon: "from-[#0F766E] to-[#06B6D4]",
  },
  diamond: {
    metal: "from-[#38BDF8] via-[#FFFFFF] to-[#818CF8]",
    face: "from-[#061626] via-[#2563EB] to-[#111827]",
    text: "text-[#BAE6FD]",
    glow: "shadow-[0_26px_70px_-28px_rgba(186,230,253,1)]",
    ribbon: "from-[#2563EB] to-[#67E8F9]",
  },
  mythic: {
    metal: "from-[#1C1205] via-[#F8D477] to-[#7C2D12]",
    face: "from-[#03010A] via-[#3B0764] to-[#1C1205]",
    text: "text-[#F8D477]",
    glow: "shadow-[0_30px_80px_-28px_rgba(248,212,119,1)]",
    ribbon: "from-[#3B0764] via-[#7C2D12] to-[#F59E0B]",
  },
};

const STATUS_LABEL = {
  earned: "Earned",
  in_progress: "Progress",
  locked: "Locked",
};

const TRACK_SHAPE: Record<BadgeTrack, string> = {
  dedication: "rounded-full",
  monthly: "rounded-[32%]",
  prestige: "[clip-path:polygon(50%_0%,88%_18%,100%_58%,72%_100%,28%_100%,0%_58%,12%_18%)]",
  dev: "[clip-path:polygon(50%_0%,92%_24%,92%_76%,50%_100%,8%_76%,8%_24%)]",
  competitive: "[clip-path:polygon(50%_0%,88%_14%,100%_44%,80%_100%,20%_100%,0%_44%,12%_14%)]",
};

const TRACK_INNER_SHAPE: Record<BadgeTrack, string> = {
  dedication: "rounded-full",
  monthly: "rounded-[30%]",
  prestige: "[clip-path:polygon(50%_5%,84%_22%,94%_58%,69%_94%,31%_94%,6%_58%,16%_22%)]",
  dev: "[clip-path:polygon(50%_5%,86%_26%,86%_74%,50%_95%,14%_74%,14%_26%)]",
  competitive: "[clip-path:polygon(50%_5%,84%_18%,94%_45%,76%_95%,24%_95%,6%_45%,16%_18%)]",
};

const TIER_SHAPE: Record<BadgeTier, string> = {
  bronze: "rounded-full",
  silver: "rounded-[30%]",
  gold: "[clip-path:polygon(50%_0%,91%_22%,91%_78%,50%_100%,9%_78%,9%_22%)]",
  platinum: "[clip-path:polygon(50%_0%,86%_14%,100%_50%,86%_86%,50%_100%,14%_86%,0%_50%,14%_14%)]",
  diamond: "[clip-path:polygon(50%_0%,96%_34%,78%_100%,22%_100%,4%_34%)]",
  mythic: "[clip-path:polygon(50%_0%,72%_18%,96%_10%,88%_48%,100%_76%,66%_82%,50%_100%,34%_82%,0%_76%,12%_48%,4%_10%,28%_18%)]",
};

const TIER_INNER_SHAPE: Record<BadgeTier, string> = {
  bronze: "rounded-full",
  silver: "rounded-[28%]",
  gold: "[clip-path:polygon(50%_5%,86%_25%,86%_75%,50%_95%,14%_75%,14%_25%)]",
  platinum: "[clip-path:polygon(50%_5%,82%_18%,94%_50%,82%_82%,50%_95%,18%_82%,6%_50%,18%_18%)]",
  diamond: "[clip-path:polygon(50%_5%,90%_36%,74%_94%,26%_94%,10%_36%)]",
  mythic: "[clip-path:polygon(50%_6%,70%_22%,91%_16%,83%_49%,92%_72%,64%_78%,50%_94%,36%_78%,8%_72%,17%_49%,9%_16%,30%_22%)]",
};

export function BadgeMedallion({
  badge,
  compact = false,
  favorite = false,
  onToggleFavorite,
}: {
  badge: BadgeAchievement;
  compact?: boolean;
  favorite?: boolean;
  onToggleFavorite?: (badge: BadgeAchievement) => void;
}) {
  const style = TIER_STYLE[badge.tier];
  const ratio = badge.target > 0 ? Math.min(1, badge.progress / badge.target) : 0;
  const locked = badge.status === "locked";
  const size = compact ? "h-20 w-20" : "h-28 w-28";
  const iconSize = compact ? 24 : 34;

  return (
    <article
      tabIndex={0}
      className={cn(
        "group/badge relative isolate grid justify-items-center rounded-xl px-3 pb-4 pt-3 outline-none transition-all duration-300 [perspective:900px] hover:z-50 focus-visible:z-50",
        compact ? "min-w-[124px]" : "min-h-[178px]",
        !locked && "hover:-translate-y-1 focus-visible:-translate-y-1"
      )}
      aria-label={`${badge.title}: ${badge.criteriaLabel}`}
    >
      {onToggleFavorite && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(badge);
          }}
          className={cn(
            "absolute right-1 top-1 z-[90] grid h-7 w-7 place-items-center rounded-full border border-border bg-surface/95 text-muted opacity-0 shadow-lg transition-all hover:border-amber-300/50 hover:text-amber-300 group-hover/badge:opacity-100 group-focus-within/badge:opacity-100",
            favorite && "border-amber-300/50 bg-amber-300/10 text-amber-300 opacity-100"
          )}
          aria-label={favorite ? `Remove ${badge.title} from favorites` : `Mark ${badge.title} as favorite`}
        >
          <Star size={14} fill={favorite ? "currentColor" : "none"} />
        </button>
      )}
      <div className={cn("relative grid justify-items-center transition-opacity", locked && "opacity-45 saturate-50")}>
        <div
          className={cn(
            "absolute top-4 h-16 w-11 rounded-b-md bg-gradient-to-b opacity-80 blur-[0.2px]",
            style.ribbon,
            badge.track === "competitive" && "h-14 w-16 rounded-b-full",
            badge.track === "dev" && "h-14 w-14 rotate-45 rounded-sm",
            badge.track === "prestige" && "h-20 w-16 rounded-b-[45%]",
            badge.track === "monthly" && "h-14 w-12 rounded-[30%]",
             locked && "grayscale opacity-35"
          )}
        />
        <div
          className={cn(
            "relative z-10 grid place-items-center p-[2.5px] transition-transform duration-500 [transform-style:preserve-3d] group-hover/badge:[transform:rotateY(-18deg)_rotateX(10deg)_translateZ(10px)] group-focus-visible/badge:[transform:rotateY(-18deg)_rotateX(10deg)_translateZ(10px)]",
            TIER_SHAPE[badge.tier],
            locked ? "bg-gradient-to-br from-surface-2 via-border to-bg shadow-none" : `bg-gradient-to-br ${style.metal} ${style.glow}`
          )}
          style={{
            backgroundImage:
              badge.status === "in_progress"
                ? `conic-gradient(${badge.accent} ${Math.round(ratio * 360)}deg, rgb(var(--border)) 0deg)`
                : undefined,
          }}
        >
          <div
            className={cn(
              "absolute inset-0 translate-x-1 translate-y-1 bg-black/35 blur-[1px]",
              TIER_SHAPE[badge.tier]
            )}
            style={{ transform: "translateZ(-10px)" }}
          />
          <div
            className={cn(
              "relative grid place-items-center border border-white/10 shadow-[inset_0_2px_10px_rgba(255,255,255,0.18),inset_0_-16px_26px_rgba(0,0,0,0.5)]",
              size,
              TIER_INNER_SHAPE[badge.tier],
              locked
                ? "bg-[radial-gradient(circle_at_35%_22%,rgb(var(--muted)/0.18),rgb(var(--surface-2))_42%,rgb(var(--bg)))] text-muted grayscale"
                : `bg-gradient-to-br ${style.face} ${style.text}`
            )}
          >
            <div className={cn("absolute inset-[5px] border border-white/[0.08]", TIER_INNER_SHAPE[badge.tier])} />
            <div className="absolute left-1/2 top-2.5 h-9 w-3/5 -translate-x-1/2 rounded-full bg-white/25 blur-md" />
            <div className="absolute bottom-2 h-5 w-1/2 rounded-full bg-black/25 blur-md" />
            <div
              className={cn(
                "relative z-10 grid place-items-center border border-white/15 bg-black/25 shadow-[inset_0_1px_4px_rgba(255,255,255,0.15)]",
                badge.track === "competitive" ? "rounded-full" : "rounded-[32%]"
              )}
              style={{
                height: compact ? 38 : 52,
                width: compact ? 38 : 52,
                transform: "translateZ(20px)",
              }}
            >
              <Icon name={badge.icon} size={iconSize} strokeWidth={locked ? 1.6 : 2.35} />
            </div>
            {locked && (
              <div className="absolute right-2 top-2 z-20 grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-black/70 text-white/85 shadow-lg">
                <Lock size={14} />
              </div>
            )}
          </div>
        </div>
      </div>

      <h3 className={cn("mt-3 max-w-[9rem] text-center font-bold leading-tight text-fg", compact ? "text-xs" : "text-sm")}>
        {badge.title}
      </h3>
      <p className={cn("mt-1 text-center text-[10px] font-semibold uppercase tracking-[0.16em]", locked ? "text-muted" : style.text)}>
        {badge.tier}
      </p>
      {favorite && (
        <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-amber-300/25 bg-amber-300/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
          <Star size={10} fill="currentColor" />
          Favorite
        </span>
      )}

      <div className="pointer-events-none absolute left-1/2 top-full z-[80] mt-2 w-64 -translate-x-1/2 translate-y-1 rounded-xl border border-border bg-surface p-4 text-left opacity-0 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.65)] transition-all duration-200 group-hover/badge:translate-y-0 group-hover/badge:opacity-100 group-focus-visible/badge:translate-y-0 group-focus-visible/badge:opacity-100">
        <div className="flex items-center justify-between gap-3">
          <p className="font-bold text-fg">{badge.title}</p>
          <span className={cn("text-[10px] font-bold uppercase tracking-[0.16em]", locked ? "text-muted" : style.text)}>
            {badge.rarity}
          </span>
        </div>
        <p className="mt-1 text-xs leading-5 text-muted">{badge.description}</p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
          <span>{STATUS_LABEL[badge.status]}</span>
          <span className="font-semibold text-fg">
            {badge.progress.toLocaleString("en-US")} / {badge.target.toLocaleString("en-US")}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full" style={{ width: `${ratio * 100}%`, backgroundColor: locked ? "rgb(var(--muted))" : badge.accent }} />
        </div>
        <p className="mt-2 text-[11px] leading-4 text-muted">{badge.criteriaLabel}</p>
      </div>
    </article>
  );
}
