"use client";

interface MapLoadingOverlayProps {
  isLoading: boolean;
}

export function MapLoadingOverlay({ isLoading }: MapLoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white dark:bg-[#2A201D] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg px-4 py-2 z-30">
      <div className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <p className="text-sm text-[#926154] dark:text-[#d6c1bd]">
          Loading items...
        </p>
      </div>
    </div>
  );
}
