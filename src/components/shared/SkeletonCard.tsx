export function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-white dark:bg-[#2A201D] border border-gray-200 dark:border-gray-800 animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />

        {/* Category badge */}
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20" />

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonFeaturedCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#2A201D] border border-gray-200 dark:border-gray-800 animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-64 lg:h-96 bg-gray-200 dark:bg-gray-700" />

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Badge */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />

        {/* Title */}
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        </div>
      </div>
    </div>
  );
}
