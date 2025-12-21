"use client";

const CATEGORY_OPTIONS = [
  { id: "all", label: "All", icon: "apps" },
  { id: "place", label: "Cultural", icon: "temple_buddhist" },
  { id: "event", label: "Events", icon: "celebration" },
  { id: "food", label: "Food", icon: "restaurant" },
  { id: "drink", label: "Drinks", icon: "local_cafe" },
  { id: "souvenir", label: "Shops", icon: "storefront" },
];

interface MapCategoryPillsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function MapCategoryPills({
  selectedCategory,
  onCategoryChange,
}: MapCategoryPillsProps) {
  return (
    <div className="absolute bottom-20 left-0 right-0 flex justify-center z-20 pointer-events-none md:hidden">
      <div className="flex gap-2 pointer-events-auto bg-white/90 dark:bg-[#2A201D]/90 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-x-auto hide-scrollbar mx-4">
        {CATEGORY_OPTIONS.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              onCategoryChange(selectedCategory === cat.id ? "all" : cat.id)
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
              selectedCategory === cat.id
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-white/5 text-[#1a110f] dark:text-[#f2eae8]"
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {cat.icon}
            </span>
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
