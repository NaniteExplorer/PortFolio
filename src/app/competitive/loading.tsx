import { Loader3D } from "@/components/ui/Loader3D";

/**
 * Skeleton shown while the /competitive page fetches its live snapshot (and on
 * the first uncached request after a revalidation window). A centered Three.js
 * loader sits over a faint skeleton that hints at the page layout.
 */
export default function CompetitiveLoading() {
  return (
    <div className="relative min-h-screen">
      <div className="container animate-pulse pt-32 pb-24 opacity-40">
        <div className="mb-14 max-w-3xl space-y-4">
          <div className="h-4 w-44 rounded bg-surface-2" />
          <div className="h-10 w-72 rounded bg-surface-2" />
          <div className="h-4 w-full max-w-xl rounded bg-surface-2" />
        </div>
        <div className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-surface-2" />
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-surface-2" />
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Loader3D size="lg" label="Crunching the numbers…" />
      </div>
    </div>
  );
}
