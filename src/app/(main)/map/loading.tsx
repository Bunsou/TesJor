"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function MapLoading() {
  return (
    <div className="relative w-full h-[calc(100vh-4rem)] md:h-screen bg-gray-200 dark:bg-gray-800 overflow-hidden">
      {/* Map Skeleton - Main Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 animate-pulse" />

      {/* Search Bar Skeleton */}
      <div className="absolute top-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-20">
        <Skeleton className="h-14 w-full md:w-[600px] rounded-lg" />
      </div>

      {/* Category Pills Skeleton */}
      <div className="absolute top-20 left-4 right-4 z-20">
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton
              key={i}
              className="h-10 w-24 rounded-full flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Map Controls Skeleton (Recenter button) */}
      <div className="absolute bottom-24 right-4 z-20">
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>

      {/* Info Badge Skeleton */}
      <div className="absolute top-36 left-4 z-20">
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>

      {/* Marker Skeletons - Scattered across map */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative w-full h-full max-w-4xl">
          {/* Simulate scattered markers */}
          <Skeleton className="absolute top-1/4 left-1/3 h-8 w-8 rounded-full" />
          <Skeleton className="absolute top-1/3 left-1/2 h-8 w-8 rounded-full" />
          <Skeleton className="absolute top-2/3 left-1/4 h-8 w-8 rounded-full" />
          <Skeleton className="absolute top-1/2 left-2/3 h-8 w-8 rounded-full" />
          <Skeleton className="absolute top-3/4 left-1/2 h-8 w-8 rounded-full" />
          <Skeleton className="absolute top-1/4 left-3/4 h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Loading overlay text */}
      <div className="absolute inset-0 flex items-center justify-center z-30">
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <Skeleton className="h-6 w-48 mb-2 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>

      {/* Copyright text skeleton */}
      <div className="absolute bottom-2 right-2 z-10">
        <Skeleton className="h-4 w-40" />
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
