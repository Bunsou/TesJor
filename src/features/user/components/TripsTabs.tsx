"use client";

interface TripsTabsProps {
  activeTab: "bookmarked" | "visited";
  onTabChange: (tab: "bookmarked" | "visited") => void;
}

export function TripsTabs({ activeTab, onTabChange }: TripsTabsProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <nav aria-label="Tabs" className="flex gap-8">
        <button
          onClick={() => onTabChange("bookmarked")}
          className={`border-b-2 py-4 px-1 text-sm font-semibold transition-colors ${
            activeTab === "bookmarked"
              ? "border-[#E07A5F] text-[#E07A5F]"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300"
          }`}
        >
          Bookmarked
        </button>
        <button
          onClick={() => onTabChange("visited")}
          className={`border-b-2 py-4 px-1 text-sm font-semibold transition-colors ${
            activeTab === "visited"
              ? "border-[#E07A5F] text-[#E07A5F]"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300"
          }`}
        >
          Visited
        </button>
      </nav>
    </div>
  );
}
