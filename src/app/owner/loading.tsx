import { Loader3D } from "@/components/ui/Loader3D";

export default function OwnerLoading() {
  return (
    <div className="container flex min-h-screen items-center justify-center pt-32 pb-24">
      <div className="rounded-2xl border border-border bg-surface/80 p-8 backdrop-blur">
        <Loader3D size="md" label="Opening control room" />
      </div>
    </div>
  );
}
