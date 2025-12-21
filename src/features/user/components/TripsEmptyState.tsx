"use client";

import Link from "next/link";

interface TripsEmptyStateProps {
  type: "bookmarked" | "visited";
}

export function TripsEmptyState({ type }: TripsEmptyStateProps) {
  const isBookmarked = type === "bookmarked";

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <span className="material-symbols-outlined text-3xl text-gray-400">
          {isBookmarked ? "bookmark_border" : "location_off"}
        </span>
      </div>
      <p className="text-gray-500 text-lg mb-2">
        {isBookmarked ? "No bookmarked items yet" : "No visited places yet"}
      </p>
      <p className="text-gray-400 text-sm mb-6">
        {isBookmarked
          ? "Start exploring and bookmark your favorites!"
          : "Check in to places you visit to track your journey!"}
      </p>
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#E07A5F] hover:bg-[#c66a50] text-white rounded-xl font-medium shadow-lg shadow-[#E07A5F]/20 transition-colors"
      >
        <span className="material-symbols-outlined">explore</span>
        Start Exploring
      </Link>
    </div>
  );
}
