"use client";

interface SavedItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

interface SavedItemsSectionProps {
  items: SavedItem[];
}

export function SavedItemsSection({ items }: SavedItemsSectionProps) {
  return (
    <div className="bg-white dark:bg-[#2A201D] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-[#1a110f] dark:text-[#f2eae8]">
          Saved
        </h3>
        <button className="text-xs text-primary hover:underline font-medium">
          View All
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div
              className="w-16 h-16 rounded-lg bg-cover bg-center bg-gray-200 dark:bg-gray-700 shrink-0"
              style={{ backgroundImage: `url('${item.image}')` }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-[#1a110f] dark:text-[#f2eae8] truncate">
                {item.title}
              </h4>
              <p className="text-xs text-[#926154] dark:text-[#d6c1bd]">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
