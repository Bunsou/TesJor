"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Tag, Star, DollarSign } from "lucide-react";

import { provinces, tags } from "@/constants/constants";

const ratings = [
  { label: "Any Rating", value: "default" },
  { label: "Highest Rated", value: "desc" },
  { label: "Lowest Rated", value: "asc" },
];

const prices = [
  { label: "Any Price", value: "default" },
  { label: "Highest Price", value: "desc" },
  { label: "Lowest Price", value: "asc" },
];

interface AdvancedFiltersProps {
  province: string;
  tag: string;
  rating: string;
  price: string;
  onProvinceChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  onPriceChange: (value: string) => void;
}

export default function AdvancedFilters({
  province,
  tag,
  rating,
  price,
  onProvinceChange,
  onTagChange,
  onRatingChange,
  onPriceChange,
}: AdvancedFiltersProps) {
  const getTagDisplayLabel = (value: string) => {
    if (value === "all") return "All Types";
    return value
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleProvinceChange = (value: string) => {
    console.log("[AdvancedFilters] Province change:", value);
    onProvinceChange(value);
  };

  const handleTagChange = (value: string) => {
    console.log("[AdvancedFilters] Tag change:", value);
    onTagChange(value);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 px-0 mb-4">
      {/* Province Filter */}
      <Select value={province} onValueChange={handleProvinceChange}>
        <SelectTrigger className="w-full bg-white dark:bg-[#2A201D] border-gray-200 dark:border-gray-700 h-10 md:h-11">
          <div className="flex items-center gap-1.5 md:gap-2">
            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 flex-shrink-0" />
            <span className="truncate text-xs md:text-sm">
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
      <Select value={tag} onValueChange={handleTagChange}>
        <SelectTrigger className="w-full bg-white dark:bg-[#2A201D] border-gray-200 dark:border-gray-700 h-10 md:h-11">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Tag className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 flex-shrink-0" />
            <span className="truncate text-xs md:text-sm">
              {getTagDisplayLabel(tag)}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-70 overflow-y-auto">
          {tags.map((t) => {
            const value = t === "All Types" ? "all" : t;
            const label =
              t === "All Types"
                ? t
                : t
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");
            return (
              <SelectItem key={t} value={value}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {/* Rating Filter */}
      <Select value={rating} onValueChange={onRatingChange}>
        <SelectTrigger className="w-full bg-white dark:bg-[#2A201D] border-gray-200 dark:border-gray-700 h-10 md:h-11">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 flex-shrink-0" />
            <SelectValue
              placeholder="Any Rating"
              className="text-xs md:text-sm"
            />
          </div>
        </SelectTrigger>
        <SelectContent>
          {ratings.map((r) => (
            <SelectItem key={r.value} value={r.value}>
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Price Filter */}
      <Select value={price} onValueChange={onPriceChange}>
        <SelectTrigger className="w-full bg-white dark:bg-[#2A201D] border-gray-200 dark:border-gray-700 h-10 md:h-11">
          <div className="flex items-center gap-1.5 md:gap-2">
            <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 flex-shrink-0" />
            <SelectValue
              placeholder="Any Price"
              className="text-xs md:text-sm"
            />
          </div>
        </SelectTrigger>
        <SelectContent>
          {prices.map((p) => (
            <SelectItem
              key={p.value.toLowerCase()}
              value={p.value.toLowerCase()}
            >
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
