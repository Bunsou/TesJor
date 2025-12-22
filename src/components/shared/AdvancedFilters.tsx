"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Tag, Star, DollarSign } from "lucide-react";

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
  "Historical",
  "Temple",
  "Nature",
  "Cultural",
  "Adventure",
  "Religious",
  "Beach",
  "Mountain",
  "Street Food",
  "Fine Dining",
  "Local Cuisine",
  "International",
  "Coffee Shop",
  "Bar",
  "Night Market",
  "Shopping Mall",
  "Art Gallery",
  "Museum",
];

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
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-4 lg:px-0 mb-4">
      {/* Province Filter */}
      <Select value={province} onValueChange={onProvinceChange}>
        <SelectTrigger className="w-full bg-white border-gray-200 h-11">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <SelectValue placeholder="All of Cambodia" />
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-[280px] overflow-y-auto">
          {provinces.map((p) => (
            <SelectItem key={p} value={p === "All of Cambodia" ? "all" : p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Tags Filter */}
      <Select value={tag} onValueChange={onTagChange}>
        <SelectTrigger className="w-full bg-white border-gray-200 h-11">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <SelectValue placeholder="All Types" />
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-[280px] overflow-y-auto">
          {tags.map((t) => (
            <SelectItem key={t} value={t === "All Types" ? "all" : t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Rating Filter */}
      <Select value={rating} onValueChange={onRatingChange}>
        <SelectTrigger className="w-full bg-white border-gray-200 h-11">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-gray-500" />
            <SelectValue placeholder="Any Rating" />
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
        <SelectTrigger className="w-full bg-white border-gray-200 h-11">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <SelectValue placeholder="Any Price" />
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
