"use client";

/**
 * GitHub-style activity heatmap. Takes a flat array of daily counts (most
 * recent last) and lays them out in week columns. Reusable for any daily
 * activity series.
 */
export function Heatmap({
  data,
  title = "Activity",
}: {
  data: number[];
  title?: string;
}) {
  const max = Math.max(...data, 1);

  // Color intensity buckets (0–4).
  const level = (v: number) => {
    if (v <= 0) return 0;
    const ratio = v / max;
    if (ratio > 0.75) return 4;
    if (ratio > 0.5) return 3;
    if (ratio > 0.25) return 2;
    return 1;
  };

  const levelClass = [
    "bg-surface-2",
    "bg-accent/30",
    "bg-accent/50",
    "bg-accent/75",
    "bg-accent",
  ];

  // Chunk into weeks of 7 days.
  const weeks: number[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  const totalSolves = data.reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted">{title}</h3>
        <span className="text-xs text-muted">{totalSolves} solves · last {weeks.length} weeks</span>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((count, di) => (
              <div
                key={di}
                title={`${count} solve${count === 1 ? "" : "s"}`}
                className={`h-3 w-3 rounded-sm ${levelClass[level(count)]}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-muted">
        <span>Less</span>
        {levelClass.map((c, i) => (
          <span key={i} className={`h-3 w-3 rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
