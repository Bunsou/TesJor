"use client";

import { MapPlus, CircleStar, MessageSquareHeart, Heart } from "lucide-react";

interface ProfileStatsProps {
  visitedCount: number;
  points: number;
  reviewCount: number;
  bookmarkedCount: number;
}

export function ProfileStatsCards({
  visitedCount,
  points,
  reviewCount,
  bookmarkedCount,
}: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-[#2A201D] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-primary/30 transition-colors">
        <span className="material-symbols-outlined text-3xl text-primary mb-1 group-hover:scale-110 transition-transform">
          <MapPlus />
        </span>
        <span className="text-2xl font-bold text-[#1a110f] dark:text-[#f2eae8]">
          {visitedCount}
        </span>
        <span className="text-xs text-[#926154] dark:text-[#d6c1bd] font-medium uppercase tracking-wider">
          Places Visited
        </span>
      </div>
      <div className="bg-white dark:bg-[#2A201D] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-primary/30 transition-colors">
        <span className="material-symbols-outlined text-3xl text-primary mb-1 group-hover:scale-110 transition-transform">
          <CircleStar />
        </span>
        <span className="text-2xl font-bold text-[#1a110f] dark:text-[#f2eae8]">
          {points.toLocaleString()}
        </span>
        <span className="text-xs text-[#926154] dark:text-[#d6c1bd] font-medium uppercase tracking-wider">
          XP Earned
        </span>
      </div>
      <div className="bg-white dark:bg-[#2A201D] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-primary/30 transition-colors">
        <span className="material-symbols-outlined text-3xl text-primary mb-1 group-hover:scale-110 transition-transform">
          <MessageSquareHeart />
        </span>
        <span className="text-2xl font-bold text-[#1a110f] dark:text-[#f2eae8]">
          {reviewCount || 0}
        </span>
        <span className="text-xs text-[#926154] dark:text-[#d6c1bd] font-medium uppercase tracking-wider">
          Reviews
        </span>
      </div>
      <div className="bg-white dark:bg-[#2A201D] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-primary/30 transition-colors">
        <span
          className="material-symbols-outlined text-3xl text-primary mb-1 icon-filled"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          <Heart fill="currentColor" strokeWidth={0} />
        </span>
        <span className="text-2xl font-bold text-[#1a110f] dark:text-[#f2eae8]">
          {bookmarkedCount}
        </span>
        <span className="text-xs text-[#926154] dark:text-[#d6c1bd] font-medium uppercase tracking-wider">
          Bookmarked
        </span>
      </div>
    </div>
  );
}
