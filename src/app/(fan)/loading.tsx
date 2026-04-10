import { Skeleton } from "@/components/ui/skeleton";

export default function FanLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border p-4">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-3" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
