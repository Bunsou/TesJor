"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MapPin,
  Activity,
  UtensilsCrossed,
  Coffee,
  Gift,
  MapPinned,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MapFiltersProps {
  categories: string[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  radius: number;
  onRadiusChange: (radius: number) => void;
  useRadiusFilter: boolean;
  onUseRadiusFilterChange: (use: boolean) => void;
}

const CATEGORY_CONFIG = [
  {
    value: "place",
    label: "Places",
    icon: MapPin,
    color: "text-red-500",
    bgColor: "bg-red-500",
  },
  {
    value: "event",
    label: "Events",
    icon: Activity,
    color: "text-green-500",
    bgColor: "bg-green-500",
  },
  {
    value: "food",
    label: "Food & Drink",
    icon: UtensilsCrossed,
    color: "text-amber-500",
    bgColor: "bg-amber-500",
  },
  {
    value: "souvenir",
    label: "Souvenirs",
    icon: Gift,
    color: "text-pink-500",
    bgColor: "bg-pink-500",
  },
];

export function MapFilters({
  categories,
  selectedCategories,
  onCategoriesChange,
  radius,
  onRadiusChange,
  useRadiusFilter,
  onUseRadiusFilterChange,
}: MapFiltersProps) {
  const [isRadiusPopupOpen, setIsRadiusPopupOpen] = useState(false);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const selectAll = () => {
    onCategoriesChange(categories);
  };

  const isAllSelected = selectedCategories.length === categories.length;

  return (
    <>
      {/* Top Filter Bar - Centered */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-4xl px-4">
        <div className="flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-2">
          {/* All Button */}
          <Button
            variant={isAllSelected ? "default" : "outline"}
            size="sm"
            onClick={selectAll}
            className="whitespace-nowrap"
          >
            <span className="md:inline">All</span>
          </Button>

          {/* Category Filters */}
          {CATEGORY_CONFIG.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategories.includes(cat.value);

            return (
              <Button
                key={cat.value}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => toggleCategory(cat.value)}
                className="whitespace-nowrap"
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    !isSelected && cat.color,
                    "md:mr-1.5"
                  )}
                />
                <span className="hidden md:inline">{cat.label}</span>
              </Button>
            );
          })}

          {/* Separator */}
          <div className="h-6 w-px bg-border mx-1" />

          {/* Radius Filter Button */}
          <Button
            variant={useRadiusFilter ? "default" : "outline"}
            size="sm"
            onClick={() => setIsRadiusPopupOpen(true)}
            className={cn(
              "whitespace-nowrap",
              useRadiusFilter && "ring-2 ring-primary ring-offset-2"
            )}
          >
            <MapPinned className="h-4 w-4 md:mr-1.5" />
            <span className="hidden md:inline">
              {useRadiusFilter ? `${radius} km` : "Radius"}
            </span>
          </Button>
        </div>
      </div>

      {/* Radius Filter Popup */}
      {isRadiusPopupOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsRadiusPopupOpen(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-card border border-border rounded-lg shadow-xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Radius Filter
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsRadiusPopupOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Use Radius Checkbox */}
            <div className="mb-6">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background/50">
                <Checkbox
                  id="use-radius"
                  checked={useRadiusFilter}
                  onCheckedChange={(checked: boolean) =>
                    onUseRadiusFilterChange(checked)
                  }
                />
                <Label
                  htmlFor="use-radius"
                  className="cursor-pointer font-medium flex-1"
                >
                  Enable Radius Filter
                </Label>
              </div>
              <p className="text-xs text-foreground-muted mt-2 px-1">
                {useRadiusFilter
                  ? "Showing items within the selected radius from your location"
                  : "Currently showing all items in Cambodia"}
              </p>
            </div>

            {/* Radius Slider */}
            {useRadiusFilter && (
              <div className="mb-6">
                <Label className="mb-3 block">
                  Search Radius: <span className="font-bold">{radius} km</span>
                </Label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={radius}
                  onChange={(e) => onRadiusChange(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-foreground-muted mt-2">
                  <span>1 km</span>
                  <span>50 km</span>
                  <span>100 km</span>
                </div>
              </div>
            )}

            {/* Close Button */}
            <Button
              onClick={() => setIsRadiusPopupOpen(false)}
              className="w-full"
            >
              Done
            </Button>
          </div>
        </>
      )}
    </>
  );
}
