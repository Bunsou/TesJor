"use client";

import { Search, SlidersHorizontal } from "lucide-react";

const CATEGORY_OPTIONS = [
  { id: "all", label: "All", icon: "apps" },
  { id: "place", label: "Cultural", icon: "temple_buddhist" },
  { id: "event", label: "Events", icon: "celebration" },
  { id: "food", label: "Food", icon: "restaurant" },
  { id: "drink", label: "Drinks", icon: "local_cafe" },
  { id: "souvenir", label: "Shops", icon: "storefront" },
];

const RADIUS_OPTIONS = [5, 10, 25, 50, 100];

interface MapSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  useRadiusFilter: boolean;
  onToggleRadiusFilter: () => void;
  onNearMeClick: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  radius: number;
  onRadiusChange: (radius: number) => void;
  showRadiusDropdown: boolean;
  onToggleRadiusDropdown: () => void;
}

export function MapSearchBar({
  searchQuery,
  onSearchChange,
  useRadiusFilter,
  onToggleRadiusFilter,
  onNearMeClick,
  selectedCategory,
  onCategoryChange,
  radius,
  onRadiusChange,
  showRadiusDropdown,
  onToggleRadiusDropdown,
}: MapSearchBarProps) {
  return (
    <div className="absolute top-4 md:top-6 left-4 md:left-6 right-4 md:right-6 flex justify-center z-20 pointer-events-none">
      <div className="flex gap-2 md:gap-3 pointer-events-auto bg-white/90 dark:bg-[#2A201D]/90 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-x-auto hide-scrollbar max-w-full">
        {/* Search Input */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-[#926154] text-xl">
            <Search />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search places..."
            className="pl-10 pr-4 py-2 bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-32 md:w-48 text-[#1a110f] dark:text-[#f2eae8] placeholder-[#926154]"
          />
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden md:block"></div>
        </div>

        {/* Filters Button */}
        <button
          onClick={onToggleRadiusFilter}
          className={`px-3 md:px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap ${
            useRadiusFilter
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-[#1a110f] dark:text-[#f2eae8]"
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            <SlidersHorizontal />
          </span>
          <span className="hidden md:inline">Filters</span>
        </button>

        {/* Near Me Toggle */}
        <button
          onClick={onNearMeClick}
          className={`px-3 md:px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
            useRadiusFilter
              ? "bg-primary text-white"
              : "bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-[#1a110f] dark:text-[#f2eae8]"
          }`}
        >
          Near Me
        </button>

        {/* Category Pills - Hidden on mobile */}
        <div className="hidden lg:flex gap-2">
          {CATEGORY_OPTIONS.slice(1, 4).map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                onCategoryChange(selectedCategory === cat.id ? "all" : cat.id)
              }
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-[#1a110f] dark:text-[#f2eae8]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Radius Dropdown */}
        {useRadiusFilter && (
          <div className="relative">
            <button
              onClick={onToggleRadiusDropdown}
              className="px-3 md:px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-[#1a110f] dark:text-[#f2eae8] text-sm font-medium transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <span>Radius: {radius}km</span>
              <span className="material-symbols-outlined text-base">
                expand_more
              </span>
            </button>

            {showRadiusDropdown && (
              <div className="absolute top-full mt-2 right-0 bg-white dark:bg-[#2A201D] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                {RADIUS_OPTIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onRadiusChange(r);
                      onToggleRadiusDropdown();
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${
                      radius === r
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-[#1a110f] dark:text-[#f2eae8]"
                    }`}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
