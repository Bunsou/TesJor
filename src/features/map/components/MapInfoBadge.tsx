"use client";

interface MapInfoBadgeProps {
  useRadiusFilter: boolean;
  itemCount: number;
  radius: number;
}

export function MapInfoBadge({
  useRadiusFilter,
  itemCount,
  radius,
}: MapInfoBadgeProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-[#2A201D] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-4 py-2 z-10 hidden md:block">
      <p className="text-sm font-medium text-[#1a110f] dark:text-[#f2eae8]">
        {useRadiusFilter
          ? `Showing ${itemCount} items within ${radius} km`
          : `Showing ${itemCount} items in Cambodia`}
      </p>
    </div>
  );
}
