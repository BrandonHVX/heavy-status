function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className || ''}`} />;
}

export function PostCardSkeleton({ variant = "standard" }: { variant?: string }) {
  if (variant === "hero") {
    return (
      <div className="aspect-[4/5] rounded-xl overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex gap-3 p-3">
        <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
        <div className="flex-1 py-0.5 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Skeleton className="aspect-[4/3] rounded-xl" />
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="px-4 space-y-3">
      <Skeleton className="h-6 w-32" />
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex-1 space-y-2">
            <Skeleton className="aspect-[3/4] rounded-xl" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
