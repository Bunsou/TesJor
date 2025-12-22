"use client";

import { Search, SlidersHorizontal } from "lucide-react";

interface MapSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFiltersClick: () => void;
  hasActiveFilters?: boolean;
}

export function MapSearchBar({
  searchQuery,
  onSearchChange,
  onFiltersClick,
  hasActiveFilters = false,
}: MapSearchBarProps) {
  return (
    <div className="absolute top-4 md:top-6 left-4 md:left-6 right-4 md:right-6 flex justify-center z-20 pointer-events-none">
      <div className="flex gap-2 md:gap-3 pointer-events-auto bg-white/90 dark:bg-[#2A201D]/90 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 max-w-full">
        {/* Search Input */}
        <div className="relative flex items-center flex-1 min-w-0">
          <Search className="absolute left-3 text-[#926154] h-5 w-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search places by name..."
            className="pl-10 pr-4 py-2 bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full text-[#1a110f] dark:text-[#f2eae8] placeholder-[#926154]"
          />
        </div>

        {/* Filters Button */}
        <button
          onClick={onFiltersClick}
          className={`px-3 md:px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap relative ${
            hasActiveFilters
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-[#1a110f] dark:text-[#f2eae8]"
          }`}
        >
          <SlidersHorizontal className="h-5 w-5" />
          <span className="hidden md:inline">Filters</span>
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-[#2A201D]" />
          )}
        </button>
      </div>
    </div>
  );
}
