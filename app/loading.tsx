import { SectionSkeleton } from "@/components/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="pb-20 pt-4 space-y-6">
      <SectionSkeleton />
      <SectionSkeleton />
    </div>
  );
}
