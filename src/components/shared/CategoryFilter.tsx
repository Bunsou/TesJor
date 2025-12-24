"use client";

import { ReactNode } from "react";

export interface CategoryOption {
  id: string;
  label: string;
  icon?: ReactNode | string;
}

interface CategoryFilterProps {
  categories: CategoryOption[];
  selected: string;
  onSelect: (category: string) => void;
  variant?: "pills" | "buttons";
  className?: string;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
  variant = "pills",
  className = "",
}: CategoryFilterProps) {
  if (variant === "buttons") {
    return (
      <div className={`flex gap-2 flex-wrap ${className}`}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selected === cat.id
                ? "bg-primary text-white shadow-md"
                : "bg-white dark:bg-[#2A201D] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary/50"
            }`}
          >
            {typeof cat.icon === "string" ? (
              <span className="material-symbols-outlined mr-2">{cat.icon}</span>
            ) : (
              cat.icon && <span className="mr-2">{cat.icon}</span>
            )}
            {cat.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory ${className}`}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all snap-start flex-shrink-0 min-h-[36px] md:min-h-[40px] ${
            selected === cat.id
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "bg-white dark:bg-[#2A201D] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary/50"
          }`}
        >
          {typeof cat.icon === "string" ? (
            <span className="material-symbols-outlined text-base md:text-lg">
              {cat.icon}
            </span>
          ) : (
            cat.icon && (
              <span className="w-4 h-4 md:w-5 md:h-5">{cat.icon}</span>
            )
          )}
          {cat.label}
        </button>
      ))}
    </div>
  );
}
