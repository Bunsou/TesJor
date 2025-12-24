"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Search, MapPin, Tag, Navigation } from "lucide-react";
import { provinces, tags } from "@/constants/constants";

const distances = [
  { label: "Any Distance", value: null },
  { label: "Within 5 km", value: 5 },
  { label: "Within 10 km", value: 10 },
  { label: "Within 25 km", value: 25 },
  { label: "Within 50 km", value: 50 },
  { label: "Within 100 km", value: 100 },
];

interface MapSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  province: string;
  onProvinceChange: (value: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  distance: number | null;
  onDistanceChange: (value: number | null) => void;
}

export function MapSearchBar({
  searchQuery,
  onSearchChange,
  province,
  onProvinceChange,
  selectedTags,
  onTagsChange,
  distance,
  onDistanceChange,
}: MapSearchBarProps) {
  return (
    <div className="absolute top-2 md:top-4 left-2 md:left-4 right-2 md:right-4 z-20 pointer-events-none">
      <div className="max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="flex gap-2 mb-2 md:mb-3 pointer-events-auto">
          <div className="relative flex items-center flex-1 bg-white dark:bg-[#2A201D] rounded-lg md:rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700">
            <Search className="absolute left-2 md:left-3 text-[#926154] h-4 w-4 md:h-5 md:w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search places..."
              className="pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 bg-transparent border-none focus:ring-0 focus:outline-none text-xs md:text-sm w-full text-[#1a110f] dark:text-[#f2eae8] placeholder-[#926154] dark:placeholder-[#d6c1bd]"
              style={{ fontSize: "16px" }}
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-3 gap-1.5 md:gap-2 pointer-events-auto">
          {/* Province Filter */}
          <Select value={province} onValueChange={onProvinceChange}>
            <SelectTrigger className="w-full bg-white dark:bg-[#2A201D] border-gray-200 dark:border-gray-700 h-9 md:h-11 shadow-md">
              <div className="flex items-center gap-1 md:gap-2">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-500 shrink-0" />
                <div className="flex flex-col items-center">
                  {/* Mobile: Shortened text */}
                  <span className="truncate text-[10px] block md:hidden">
                    {province === "all"
                      ? "Cambodia"
                      : province.length > 9
                      ? province.slice(0, 7) + "..."
                      : province}
                  </span>

                  {/* Desktop: Full text */}
                  <span className="truncate text-sm hidden md:block">
                    {province === "all" ? "Cambodia" : province}
                  </span>
                </div>
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-70 overflow-y-auto">
              {provinces.map((p) => (
                <SelectItem key={p} value={p === "All of Cambodia" ? "all" : p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Tags Filter */}
          <Select
            value={selectedTags.length === 0 ? "all" : selectedTags[0]}
            onValueChange={(value) => {
              if (value === "all") {
                onTagsChange([]);
              } else {
                onTagsChange([value]);
              }
            }}
          >
            <SelectTrigger className="w-full bg-white dark:bg-[#2A201D] border-gray-200 dark:border-gray-700 h-9 md:h-11 shadow-md">
              <div className="flex items-center gap-1 md:gap-2">
                <Tag className="w-3 h-3 md:w-4 md:h-4 text-gray-500 shrink-0" />
                <div className="flex flex-col items-center">
                  {/* Mobile: Shortened text */}
                  <span className="truncate text-[10px] block md:hidden">
                    {selectedTags.length === 0
                      ? "All Types"
                      : selectedTags[0]
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ").length > 9
                      ? selectedTags[0]
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")
                          .slice(0, 7) + "..."
                      : selectedTags[0]
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                  </span>

                  {/* Desktop: Full text */}
                  <span className="truncate text-sm hidden md:block">
                    {selectedTags.length === 0
                      ? "All Types"
                      : selectedTags[0]
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                  </span>
                </div>
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-70 overflow-y-auto">
              {tags.map((t) => (
                <SelectItem key={t} value={t === "All Types" ? "all" : t}>
                  {t === "All Types"
                    ? t
                    : t
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Distance Filter */}
          <Select
            value={distance?.toString() || "null"}
            onValueChange={(value) =>
              onDistanceChange(value === "null" ? null : Number(value))
            }
          >
            <SelectTrigger className="w-full bg-white dark:bg-[#2A201D] border-gray-200 dark:border-gray-700 h-9 md:h-11 shadow-md">
              <div className="flex items-center gap-1 md:gap-2">
                <Navigation className="w-3 h-3 md:w-4 md:h-4 text-gray-500 shrink-0" />
                <div className="flex flex-col items-center">
                  {/* 1. Visible ONLY on Small Screens (hidden on md and up) */}
                  <span className="truncate text-[10px] block md:hidden">
                    {distance === null
                      ? "Any Distance".length > 9
                        ? "Any Dis..."
                        : "Any Distance"
                      : `< ${distance} km`}
                  </span>

                  {/* 2. Visible ONLY on Big Screens (hidden by default, block on md) */}
                  <span className="truncate text-sm hidden md:block">
                    {distance === null
                      ? "Any Distance"
                      : `Within ${distance} km`}
                  </span>
                </div>
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-70 overflow-y-auto">
              {distances.map((d) => (
                <SelectItem key={d.label} value={d.value?.toString() || "null"}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
