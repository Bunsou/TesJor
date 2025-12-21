import { SkeletonCard } from "@/components/shared/SkeletonCard";

export default function MyTripsLoading() {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-background dark:bg-[#201512]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-8">
        {/* Header Skeleton */}
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64" />
          <div className="flex gap-4">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl w-48" />
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl w-48" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-4 animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32" />
        </div>

        {/* Grid of cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
