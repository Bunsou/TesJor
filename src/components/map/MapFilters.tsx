"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

interface MapFiltersProps {
  categories: string[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  radius: number;
  onRadiusChange: (radius: number) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  place: "Places",
  activity: "Activities",
  food: "Food",
  drink: "Drinks",
  souvenir: "Souvenirs",
};

const CATEGORY_COLORS: Record<string, string> = {
  place: "bg-blue-500",
  activity: "bg-green-500",
  food: "bg-amber-500",
  drink: "bg-purple-500",
  souvenir: "bg-pink-500",
};

export function MapFilters({
  categories,
  selectedCategories,
  onCategoriesChange,
  radius,
  onRadiusChange,
}: MapFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

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

  const clearAll = () => {
    onCategoriesChange([]);
  };

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 shadow-lg"
      >
        Filters ({selectedCategories.length})
      </Button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-80 bg-card border-l border-border shadow-xl overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Filters</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <Label>Categories</Label>
                <div className="flex gap-2">
                  <button
                    onClick={selectAll}
                    className="text-sm text-primary hover:underline"
                  >
                    All
                  </button>
                  <span className="text-foreground-muted">|</span>
                  <button
                    onClick={clearAll}
                    className="text-sm text-foreground-muted hover:underline"
                  >
                    None
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      selectedCategories.includes(category)
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background hover:bg-accent"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full ${CATEGORY_COLORS[category]}`}
                    />
                    <span className="font-medium">
                      {CATEGORY_LABELS[category]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Radius */}
            <div>
              <Label>Search Radius: {radius} km</Label>
              <input
                type="range"
                min="1"
                max="100"
                value={radius}
                onChange={(e) => onRadiusChange(Number(e.target.value))}
                className="w-full mt-3"
              />
              <div className="flex justify-between text-xs text-foreground-muted mt-1">
                <span>1 km</span>
                <span>100 km</span>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Apply Button */}
            <Button
              onClick={() => setIsOpen(false)}
              className="w-full"
              size="lg"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
