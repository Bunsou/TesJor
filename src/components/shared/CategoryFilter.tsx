"use client";

import { MapPin, Activity, UtensilsCrossed, Coffee, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  { value: "place", label: "Places", icon: MapPin, color: "text-primary" },
  {
    value: "activity",
    label: "Activities",
    icon: Activity,
    color: "text-secondary",
  },
  {
    value: "food",
    label: "Foods",
    icon: UtensilsCrossed,
    color: "text-warning",
  },
  {
    value: "drink",
    label: "Drinks",
    icon: Coffee,
    color: "text-secondary-600",
  },
  {
    value: "souvenir",
    label: "Souvenirs",
    icon: Gift,
    color: "text-primary-700",
  },
];

interface CategoryFilterProps {
  selected?: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Button
        variant={selected === null ? "default" : "outline"}
        size="sm"
        onClick={() => onSelect(null)}
        className="whitespace-nowrap"
      >
        All
      </Button>
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selected === cat.value;

        return (
          <Button
            key={cat.value}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(cat.value)}
            className="whitespace-nowrap"
          >
            <Icon className={cn("h-4 w-4 mr-1.5", !isSelected && cat.color)} />
            {cat.label}
          </Button>
        );
      })}
    </div>
  );
}

export { categories };
