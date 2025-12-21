"use client";

import { Search, SlidersHorizontal } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Where do you want to go in Cambodia?",
  onFilterClick,
}: SearchBarProps) {
  return (
    <header className="w-full px-4 py-6 lg:px-10 lg:pt-8 bg-background dark:bg-[#201512] z-10 sticky top-0">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex w-full items-center rounded-2xl h-14 bg-white dark:bg-[#2C211F] shadow-sm border border-transparent focus-within:border-[#E07A5F]/50 focus-within:ring-4 focus-within:ring-[#E07A5F]/10 transition-all">
          <div className="flex items-center justify-center pl-5 pr-3">
            <Search className="text-[#E07A5F] h-6 w-6" />
          </div>
          <input
            className="w-full bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-400 text-base font-medium h-full outline-none"
            placeholder={placeholder}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {onFilterClick && (
            <button
              onClick={onFilterClick}
              className="mr-2 p-2 rounded-xl bg-[#2D6A4F]/10 hover:bg-[#2D6A4F]/20 text-[#2D6A4F] transition-colors"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
