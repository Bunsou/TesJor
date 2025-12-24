"use client";

import { Heart, BookCheck } from "lucide-react";
import { StatsCard } from "./StatsCard";

interface TripsHeaderProps {
  savedCount: number;
  visitedCount: number;
}

export function TripsHeader({ savedCount, visitedCount }: TripsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          My Trips
        </h1>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">
          Manage your saved adventures and travel history.
        </p>
      </div>

      <div className="flex gap-3 md:gap-4">
        <StatsCard
          icon={<Heart fill="currentColor" strokeWidth={0} />}
          iconBgColor="bg-orange-100 dark:bg-orange-900/30"
          iconColor="text-[#E07A5F]"
          value={savedCount}
          label="Saved"
        />
        <StatsCard
          icon={<BookCheck />}
          iconBgColor="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
          value={visitedCount}
          label="Visited"
        />
      </div>
    </div>
  );
}
