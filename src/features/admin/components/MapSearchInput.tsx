"use client";

import { Search, MapPin, X } from "lucide-react";

interface SearchSuggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
  description: string;
}

interface MapSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: SearchSuggestion[];
  showSuggestions: boolean;
  onSuggestionClick: (placeId: string) => void;
  onClear: () => void;
}

export function MapSearchInput({
  value,
  onChange,
  suggestions,
  showSuggestions,
  onSuggestionClick,
  onClear,
}: MapSearchInputProps) {
  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 z-10" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 pr-10 w-full py-2 md:py-3 rounded-md border border-gray-300 dark:border-gray-700 focus:border-[#E07A5F] focus:ring-[#E07A5F] dark:bg-[#201512] dark:text-white transition-colors"
          placeholder="Search for a location..."
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#2A201D] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.placeId}
              type="button"
              onClick={() => onSuggestionClick(suggestion.placeId)}
              className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left border-b border-gray-100 dark:border-gray-800 last:border-b-0"
            >
              <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                  {suggestion.mainText}
                </div>
                {suggestion.secondaryText && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {suggestion.secondaryText}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
