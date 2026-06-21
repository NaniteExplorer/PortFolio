"use client";

import { useMemo, useState } from "react";

/**
 * Activity heatmap with two modes:
 *
 *  1. LEGACY — pass `data` (a flat array of daily counts, most recent last) and
 *     it renders the familiar GitHub-style week grid. Used by /dev.
 *
 *  2. CALENDAR — pass `byDay` (a date→count map) and it renders a proper
 *     month-labelled, weekday-aligned calendar with a YEAR FILTER ("Last 12
 *     months" + one tab per year present in the data) and richer stats
 *     (total · active days · current & best streak · best day). Used by
 *     /competitive to club every platform's activity into one view.
 *
 * `scheme` picks the color ramp; `unit` is the singular noun for counts.
 */

type Scheme = "accent" | "green";

const SCHEMES: Record<Scheme, string[]> = {
  accent: ["bg-surface-2", "bg-accent/30", "bg-accent/50", "bg-accent/75", "bg-accent"],
  green: [
    "bg-surface-2",
    "bg-emerald-500/25",
    "bg-emerald-500/45",
    "bg-emerald-500/70",
    "bg-emerald-500",
  ],
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""];
const DATE_LOCALE = "en-US";
const DATE_ZONE = "UTC";

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setUTCDate(out.getUTCDate() + n);
  return out;
}

/** A single rendered cell: a real day, or a leading/trailing padding slot. */
type Cell = { key: string; date: Date; count: number } | null;

/**
 * Build week columns (each 7 cells, Sun→Sat) spanning [start, end] inclusive,
 * padded out to whole weeks so weekday rows line up. Padding slots are null.
 */
function buildWeeks(start: Date, end: Date, byDay: Record<string, number>): Cell[][] {
  const gridStart = addDays(start, -start.getUTCDay()); // back to Sunday
  const gridEnd = addDays(end, 6 - end.getUTCDay()); // forward to Saturday

  const weeks: Cell[][] = [];
  let col: Cell[] = [];
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) {
    if (d < start || d > end) {
      col.push(null);
    } else {
      const key = dayKey(d);
      col.push({ key, date: new Date(d), count: byDay[key] ?? 0 });
    }
    if (col.length === 7) {
      weeks.push(col);
      col = [];
    }
  }
  if (col.length) weeks.push(col);
  return weeks;
}

function colorLevel(count: number, max: number): number {
  if (count <= 0) return 0;
  const r = count / max;
  if (r > 0.75) return 4;
  if (r > 0.5) return 3;
  if (r > 0.25) return 2;
  return 1;
}

function formatDate(date: Date, options: Intl.DateTimeFormatOptions): string {
  return date.toLocaleDateString(DATE_LOCALE, { ...options, timeZone: DATE_ZONE });
}

function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

/** Longest run of consecutive active days, ending today (current) and ever (best). */
function streaks(cells: Cell[]): { current: number; best: number } {
  let best = 0;
  let run = 0;
  let current = 0;
  for (const c of cells) {
    if (c && c.count > 0) {
      run += 1;
      best = Math.max(best, run);
      current = run; // tracks the run that reaches the final cell
    } else if (c) {
      run = 0;
    }
  }
  return { current, best };
}

export function Heatmap({
  data,
  byDay,
  anchorDate,
  title = "Activity",
  scheme = "accent",
  unit = "solve",
}: {
  /** Legacy flat series (most recent last). Ignored when `byDay` is set. */
  data?: number[];
  /** date(YYYY-MM-DD) → count. Enables the calendar + year filter. */
  byDay?: Record<string, number>;
  /** ISO date to anchor "today" (keeps SSR/CSR identical — avoids hydration drift). */
  anchorDate?: string;
  title?: string;
  scheme?: Scheme;
  unit?: string;
}) {
  const levelClass = SCHEMES[scheme] ?? SCHEMES.accent;

  // ── Calendar mode ────────────────────────────────────────────────────────
  const years = useMemo(() => {
    if (!byDay) return [];
    const set = new Set<string>();
    for (const k of Object.keys(byDay)) set.add(k.slice(0, 4));
    return [...set].sort((a, b) => Number(b) - Number(a));
  }, [byDay]);

  const ROLLING = "Last 12 months";
  const [range, setRange] = useState<string>(ROLLING);

  if (byDay) {
    const anchor = anchorDate ? new Date(anchorDate) : new Date();
    let start: Date;
    let end: Date;
    if (range === ROLLING) {
      end = anchor;
      start = addDays(anchor, -364);
    } else {
      start = new Date(`${range}-01-01T00:00:00Z`);
      // Cap the current year at the anchor so we don't draw empty future weeks.
      const yearEnd = new Date(`${range}-12-31T00:00:00Z`);
      end = yearEnd > anchor && range === String(anchor.getUTCFullYear()) ? anchor : yearEnd;
    }

    const weeks = buildWeeks(start, end, byDay);
    const cells = weeks.flat().filter(Boolean) as Exclude<Cell, null>[];
    const max = Math.max(...cells.map((c) => c.count), 1);
    const total = cells.reduce((a, c) => a + c.count, 0);
    const activeDays = cells.filter((c) => c.count > 0).length;
    const { current, best } = streaks(weeks.flat());
    const peak = cells.reduce((a, c) => (c.count > a.count ? c : a), cells[0] ?? { count: 0 });

    return (
      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-fg">{title}</h3>
          <div className="max-w-full overflow-x-auto rounded-full border border-border bg-surface-2/50 p-1">
            <div className="flex min-w-max items-center gap-1">
            {[ROLLING, ...years].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setRange(opt)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  range === opt
                    ? "bg-accent text-white"
                    : "text-muted hover:text-fg"
                }`}
              >
                {opt === ROLLING ? "Last 12 mo" : opt}
              </button>
            ))}
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
          <Stat value={total} label={`${unit}s`} />
          <Stat value={activeDays} label="active days" />
          <Stat value={current} label="current streak" />
          <Stat value={best} label="best streak" />
          {peak.count > 0 && (
            <span>
              <span className="font-bold text-fg">{formatNumber(peak.count)}</span> peak day ·{" "}
              {formatDate(peak.date, { month: "short", day: "numeric" })}
            </span>
          )}
        </div>

        <div className="-mx-1 overflow-x-auto px-1 pb-2">
          <div className="min-w-max [--heat-cell:clamp(7px,calc((100vw-5.5rem)/55),12px)] [--heat-gap:clamp(2px,0.7vw,4px)] sm:[--heat-cell:clamp(8px,calc((100vw-12rem)/55),12px)]">
          {/* Month labels — same pitch as the grid (w-3 cell + gap-1 = 1rem) */}
          <div className="mb-1 flex pl-7" style={{ gap: "var(--heat-gap)" }}>
            {weeks.map((week, wi) => {
              const firstReal = week.find(Boolean) as Exclude<Cell, null> | undefined;
              const prevWeek = weeks[wi - 1];
              const prevFirst = prevWeek?.find(Boolean) as Exclude<Cell, null> | undefined;
              const showMonth =
                firstReal &&
                (wi === 0 || !prevFirst || prevFirst.date.getUTCMonth() !== firstReal.date.getUTCMonth());
              return (
                <div key={wi} className="shrink-0" style={{ width: "var(--heat-cell)" }}>
                  {showMonth && (
                    <span className="whitespace-nowrap text-[10px] text-muted">
                      {MONTHS[firstReal!.date.getUTCMonth()]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex">
            {/* Weekday labels */}
            <div className="mr-1 flex w-6 flex-col" style={{ gap: "var(--heat-gap)" }}>
              {WEEKDAYS.map((w, i) => (
                <span
                  key={i}
                  className="text-[8px] text-muted sm:text-[9px]"
                  style={{ height: "var(--heat-cell)", lineHeight: "var(--heat-cell)" }}
                >
                  {w}
                </span>
              ))}
            </div>
            {/* Week columns */}
            <div className="flex min-w-0" style={{ gap: "var(--heat-gap)" }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex min-w-0 flex-col" style={{ gap: "var(--heat-gap)" }}>
                  {week.map((cell, di) =>
                    cell ? (
                      <div
                        key={cell.key}
                        title={`${cell.count} ${unit}${cell.count === 1 ? "" : "s"} · ${formatDate(
                          cell.date,
                          { weekday: "short", month: "short", day: "numeric", year: "numeric" }
                        )}`}
                        className={`rounded-sm ${levelClass[colorLevel(cell.count, max)]} transition-colors hover:ring-1 hover:ring-fg/30`}
                        style={{ height: "var(--heat-cell)", width: "var(--heat-cell)" }}
                      />
                    ) : (
                      <div
                        key={`pad-${wi}-${di}`}
                        className="rounded-sm bg-transparent"
                        style={{ height: "var(--heat-cell)", width: "var(--heat-cell)" }}
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>

        <Legend levelClass={levelClass} />
      </div>
    );
  }

  // ── Legacy mode (flat series) ──────────────────────────────────────────────
  const series = data ?? [];
  const max = Math.max(...series, 1);
  const weeks: number[][] = [];
  for (let i = 0; i < series.length; i += 7) weeks.push(series.slice(i, i + 7));
  const total = series.reduce((a, b) => a + b, 0);
  const activeDays = series.filter((d) => d > 0).length;

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-muted">{title}</h3>
        <span className="text-xs text-muted">
          {formatNumber(total)} {unit}s · {activeDays} active days · last {weeks.length} weeks
        </span>
      </div>

      <div className="-mx-1 overflow-x-auto px-1 pb-2">
        <div
          className="flex min-w-max [--heat-cell:clamp(7px,calc((100vw-4rem)/55),12px)] [--heat-gap:clamp(2px,0.7vw,4px)] sm:[--heat-cell:clamp(8px,calc((100vw-10rem)/55),12px)]"
          style={{ gap: "var(--heat-gap)" }}
        >
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col" style={{ gap: "var(--heat-gap)" }}>
            {week.map((count, di) => (
              <div
                key={di}
                title={`${count} ${unit}${count === 1 ? "" : "s"}`}
                className={`rounded-sm ${levelClass[colorLevel(count, max)]} transition-colors`}
                style={{ height: "var(--heat-cell)", width: "var(--heat-cell)" }}
              />
            ))}
          </div>
        ))}
        </div>
      </div>

      <Legend levelClass={levelClass} />
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <span>
      <span className="font-bold text-fg">{formatNumber(value)}</span> {label}
    </span>
  );
}

function Legend({ levelClass }: { levelClass: string[] }) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-end gap-1.5 text-xs text-muted">
      <span>Less</span>
      {levelClass.map((c, i) => (
        <span key={i} className={`h-2.5 w-2.5 rounded-sm sm:h-3 sm:w-3 ${c}`} />
      ))}
      <span>More</span>
    </div>
  );
}
