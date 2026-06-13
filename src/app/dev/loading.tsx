/**
 * Skeleton shown while the /dev page aggregates GitHub data (and on the first
 * uncached request after a revalidation window).
 */
export default function DevLoading() {
  return (
    <div className="container min-h-screen animate-pulse pt-32 pb-24">
      <div className="mb-14 max-w-3xl space-y-4">
        <div className="h-4 w-40 rounded bg-surface-2" />
        <div className="h-10 w-80 rounded bg-surface-2" />
        <div className="h-4 w-full max-w-xl rounded bg-surface-2" />
      </div>
      <div className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-surface-2" />
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-surface-2" />
        ))}
      </div>
    </div>
  );
}
