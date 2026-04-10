import { Skeleton } from "@/components/ui/skeleton";

export default function CreatorLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-border p-5">
            <Skeleton className="w-5 h-5 mb-3" />
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border p-6">
          <Skeleton className="h-5 w-24 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 rounded-xl border border-border p-6">
          <Skeleton className="h-5 w-32 mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
