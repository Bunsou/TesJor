"use client";

import { useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Tag, Navigation } from "lucide-react";

const provinces = [
  "All of Cambodia",
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

const tags = [
  "All Types",
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
  "place",
];

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
  const tagsDropdownRef = useRef<HTMLDivElement>(null);

  // Close tags dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tagsDropdownRef.current &&
        !tagsDropdownRef.current.contains(event.target as Node)
      ) {
        const content = document.getElementById("tags-dropdown-content");
        if (content) {
          content.classList.add("hidden");
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTagToggle = (tag: string) => {
    if (tag === "all") {
      console.log("[MapSearchBar] Clearing all tags");
      onTagsChange([]);
    } else {
      // Toggle tag selection
      if (selectedTags.includes(tag)) {
        const newTags = selectedTags.filter((t) => t !== tag);
        console.log("[MapSearchBar] Removing tag:", tag, "New tags:", newTags);
        onTagsChange(newTags);
      } else {
        const newTags = [...selectedTags, tag];
        console.log("[MapSearchBar] Adding tag:", tag, "New tags:", newTags);
        onTagsChange(newTags);
      }
    }
  };

  const getTagDisplayText = () => {
    if (selectedTags.length === 0) return "All Types";
    if (selectedTags.length === 1) {
      const tag = selectedTags[0];
      return tag.charAt(0).toUpperCase() + tag.slice(1);
    }
    return `${selectedTags.length} types selected`;
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none">
      <div className="max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="flex gap-2 mb-3 pointer-events-auto">
          <div className="relative flex items-center flex-1 bg-white rounded-xl shadow-lg border border-gray-200/50">
            <Search className="absolute left-3 text-[#926154] h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search places by name..."
              className="pl-10 pr-4 py-3 bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full text-[#1a110f] placeholder-[#926154]"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-3 gap-2 pointer-events-auto">
          {/* Province Filter */}
          <Select value={province} onValueChange={onProvinceChange}>
            <SelectTrigger className="w-full bg-white border-gray-200 h-11 shadow-md">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="truncate text-sm">
                  {province === "all" ? "All of Cambodia" : province}
                </span>
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
          <div ref={tagsDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => {
                const content = document.getElementById(
                  "tags-dropdown-content"
                );
                if (content) {
                  content.classList.toggle("hidden");
                }
              }}
              className="w-full bg-white border border-gray-200 h-11 shadow-md rounded-md px-3 flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Tag className="w-4 h-4 text-gray-500 shrink-0" />
              <span className="truncate text-sm flex-1 text-left">
                {getTagDisplayText()}
              </span>
              <svg
                className="w-4 h-4 text-gray-500 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              id="tags-dropdown-content"
              className="hidden absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-70 overflow-y-auto z-50"
            >
              {tags.map((t) => {
                const value = t === "All Types" ? "all" : t;
                const isSelected =
                  value === "all"
                    ? selectedTags.length === 0
                    : selectedTags.includes(value);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTagToggle(value)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <span className="w-4 h-4 flex items-center justify-center">
                      {isSelected && (
                        <span className="text-primary font-bold">✓</span>
                      )}
                    </span>
                    <span>{t}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Distance Filter */}
          <Select
            value={distance?.toString() || "null"}
            onValueChange={(value) =>
              onDistanceChange(value === "null" ? null : Number(value))
            }
          >
            <SelectTrigger className="w-full bg-white border-gray-200 h-11 shadow-md">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-gray-500 shrink-0" />
                <SelectValue placeholder="Any Distance" />
              </div>
            </SelectTrigger>
            <SelectContent>
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
