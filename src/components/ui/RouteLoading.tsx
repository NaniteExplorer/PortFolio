import { Loader3D } from "@/components/ui/Loader3D";

export function RouteLoading({ label = "Rendering page" }: { label?: string }) {
  return (
    <div className="relative min-h-screen">
      <div className="container animate-pulse pt-32 pb-24 opacity-35">
        <div className="mb-12 max-w-3xl space-y-4">
          <div className="h-4 w-44 rounded bg-surface-2" />
          <div className="h-10 w-full max-w-md rounded bg-surface-2" />
          <div className="h-4 w-full max-w-xl rounded bg-surface-2" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-surface-2" />
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="rounded-2xl border border-border bg-bg/80 p-6 backdrop-blur">
          <Loader3D size="md" label={label} />
        </div>
      </div>
    </div>
  );
}
