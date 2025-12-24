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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <div className="bg-white dark:bg-[#2A201D] p-4 md:p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center gap-0.5 md:gap-1 group hover:border-primary/30 transition-colors">
        <MapPlus className="w-7 h-7 md:w-8 md:h-8 text-primary mb-0.5 md:mb-1 group-hover:scale-110 transition-transform" />
        <span className="text-xl md:text-2xl font-bold text-[#1a110f] dark:text-[#f2eae8]">
          {visitedCount}
        </span>
        <span className="text-[10px] md:text-xs text-[#926154] dark:text-[#d6c1bd] font-medium uppercase tracking-wider text-center">
          Visited
        </span>
      </div>
      <div className="bg-white dark:bg-[#2A201D] p-4 md:p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center gap-0.5 md:gap-1 group hover:border-primary/30 transition-colors">
        <CircleStar className="w-7 h-7 md:w-8 md:h-8 text-primary mb-0.5 md:mb-1 group-hover:scale-110 transition-transform" />
        <span className="text-xl md:text-2xl font-bold text-[#1a110f] dark:text-[#f2eae8]">
          {points.toLocaleString()}
        </span>
        <span className="text-[10px] md:text-xs text-[#926154] dark:text-[#d6c1bd] font-medium uppercase tracking-wider text-center">
          XP Earned
        </span>
      </div>
      <div className="bg-white dark:bg-[#2A201D] p-4 md:p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center gap-0.5 md:gap-1 group hover:border-primary/30 transition-colors">
        <MessageSquareHeart className="w-7 h-7 md:w-8 md:h-8 text-primary mb-0.5 md:mb-1 group-hover:scale-110 transition-transform" />
        <span className="text-xl md:text-2xl font-bold text-[#1a110f] dark:text-[#f2eae8]">
          {reviewCount || 0}
        </span>
        <span className="text-[10px] md:text-xs text-[#926154] dark:text-[#d6c1bd] font-medium uppercase tracking-wider text-center">
          Reviews
        </span>
      </div>
      <div className="bg-white dark:bg-[#2A201D] p-4 md:p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center gap-0.5 md:gap-1 group hover:border-primary/30 transition-colors">
        <Heart
          fill="currentColor"
          strokeWidth={0}
          className="w-7 h-7 md:w-8 md:h-8 text-primary mb-0.5 md:mb-1 group-hover:scale-110 transition-transform"
        />
        <span className="text-xl md:text-2xl font-bold text-[#1a110f] dark:text-[#f2eae8]">
          {bookmarkedCount}
        </span>
        <span className="text-[10px] md:text-xs text-[#926154] dark:text-[#d6c1bd] font-medium uppercase tracking-wider text-center">
          Saved
        </span>
      </div>
    </div>
  );
}
