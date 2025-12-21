import { Listing } from "@/server/db/schema";
import { CategoryBadge } from "@/components/shared/CategoryBadge";

interface ItemHeaderProps {
  item: Listing;
}

export function ItemHeader({ item }: ItemHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 dark:border-gray-800 pb-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 mb-2">
          <CategoryBadge category={item.category} />
          {item.avgRating && (
            <div className="flex items-center gap-1 text-[#E07A5F]">
              <span className="material-symbols-outlined text-sm icon-filled">
                star
              </span>
              <span className="text-sm font-bold">{item.avgRating}</span>
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
          {item.title}
        </h1>
        {item.titleKh && (
          <h2 className="text-2xl mt-1 font-khmer text-gray-500 dark:text-gray-400">
            {item.titleKh}
          </h2>
        )}
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-gray-900 dark:text-white">
        {item.addressText && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              <span className="material-symbols-outlined text-sm">
                location_on
              </span>
            </div>
            <span className="font-medium">{item.addressText}</span>
          </div>
        )}
        {item.priceLevel && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <span className="material-symbols-outlined text-sm">
                payments
              </span>
            </div>
            <span className="font-medium">{item.priceLevel}</span>
          </div>
        )}
        {item.views !== undefined && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <span className="material-symbols-outlined text-lg">
              visibility
            </span>
            <span>{item.views} views</span>
          </div>
        )}
      </div>
    </div>
  );
}
