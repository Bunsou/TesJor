import {
  SkeletonCard,
  SkeletonFeaturedCard,
} from "@/components/shared/SkeletonCard";

export function ListingsSkeletonLoader() {
  return (
    <div className="space-y-8">
      {/* Featured skeleton */}
      <SkeletonFeaturedCard />

      {/* Grid of regular skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function ItemDetailSkeletonLoader() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1A1410] animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb skeleton */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6" />

        {/* Image carousel skeleton */}
        <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Title */}
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
            </div>

            {/* Reviews section */}
            <div className="space-y-4 pt-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-40" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-2"
                  >
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Action Hub */}
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
              <div className="space-y-3">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
