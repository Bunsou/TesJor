import { ListingsSkeletonLoader } from "@/features/listings/components/SkeletonLoader";

export default function ExploreLoading() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Search Header Skeleton */}
      <div className="p-4 lg:px-10 animate-pulse">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl max-w-5xl mx-auto" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 lg:px-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Category Pills Skeleton */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-24 flex-shrink-0 animate-pulse"
              />
            ))}
          </div>

          {/* Listings Skeleton */}
          <ListingsSkeletonLoader />
        </div>
      </div>
    </div>
  );
}
