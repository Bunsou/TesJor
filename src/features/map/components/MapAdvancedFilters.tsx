"use client";

import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const PROVINCES = [
  "Banteay Meanchey",
  "Battambang",
  "Kampong Cham",
  "Kampong Chhnang",
  "Kampong Speu",
  "Kampong Thom",
  "Kampot",
  "Kandal",
  "Kep",
  "Koh Kong",
  "Kratie",
  "Mondulkiri",
  "Oddar Meanchey",
  "Pailin",
  "Phnom Penh",
  "Preah Sihanouk",
  "Preah Vihear",
  "Prey Veng",
  "Pursat",
  "Ratanakiri",
  "Siem Reap",
  "Stung Treng",
  "Svay Rieng",
  "Takeo",
  "Tboung Khmum",
];

const POPULAR_TAGS = [
  "temple",
  "beach",
  "mountain",
  "waterfall",
  "historical",
  "nature",
  "adventure",
  "family-friendly",
  "romantic",
  "photography",
  "unesco",
  "ancient",
  "scenic",
  "cultural",
  "wildlife",
];

const DISTANCE_OPTIONS = [
  { value: null, label: "Any distance" },
  { value: 5, label: "Within 5 km" },
  { value: 10, label: "Within 10 km" },
  { value: 25, label: "Within 25 km" },
  { value: 50, label: "Within 50 km" },
  { value: 100, label: "Within 100 km" },
];

interface MapAdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProvince: string;
  onProvinceChange: (province: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  maxDistance: number | null;
  onDistanceChange: (distance: number | null) => void;
}

export function MapAdvancedFilters({
  isOpen,
  onClose,
  selectedProvince,
  onProvinceChange,
  selectedTags,
  onTagsChange,
  maxDistance,
  onDistanceChange,
}: MapAdvancedFiltersProps) {
  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    onProvinceChange("all");
    onTagsChange([]);
    onDistanceChange(null);
  };

  const hasActiveFilters =
    selectedProvince !== "all" ||
    selectedTags.length > 0 ||
    maxDistance !== null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Filter Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-white dark:bg-[#2A201D] z-50 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-bold text-[#1a110f] dark:text-[#f2eae8]">
              Advanced Filters
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-[#926154] dark:text-[#d6c1bd]" />
            </button>
          </div>

          <ScrollArea className="flex-1 p-4">
            {/* Province Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#1a110f] dark:text-[#f2eae8] mb-3">
                Province
              </h3>
              <select
                value={selectedProvince}
                onChange={(e) => onProvinceChange(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#201512] text-[#1a110f] dark:text-[#f2eae8] focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Provinces</option>
                {PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            {/* Distance Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#1a110f] dark:text-[#f2eae8] mb-3">
                Distance from You
              </h3>
              <div className="space-y-2">
                {DISTANCE_OPTIONS.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => onDistanceChange(option.value)}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
                      maxDistance === option.value
                        ? "bg-primary text-white"
                        : "bg-gray-100 dark:bg-white/5 text-[#1a110f] dark:text-[#f2eae8] hover:bg-gray-200 dark:hover:bg-white/10"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#1a110f] dark:text-[#f2eae8] mb-3">
                Tags ({selectedTags.length} selected)
              </h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? "bg-primary text-white"
                        : "bg-gray-100 dark:bg-white/5 text-[#926154] dark:text-[#d6c1bd] hover:bg-gray-200 dark:hover:bg-white/10"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-[#926154] dark:text-[#d6c1bd] font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                Clear All Filters
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full px-4 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
