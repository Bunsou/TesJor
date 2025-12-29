import { Listing } from "@/server/db/schema";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import {
  Banknote,
  CircleDollarSign,
  Coins,
  Eye,
  MapPin,
  Star,
} from "lucide-react";

interface ItemHeaderProps {
  item: Listing;
}

export function ItemHeader({ item }: ItemHeaderProps) {
  return (
    <div className="flex flex-col gap-3 md:gap-4 border-b border-gray-100 dark:border-gray-800 pb-4 md:pb-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
          <CategoryBadge category={item.category} />
          {item.avgRating ? (
            <div className="flex items-center gap-1 text-[#E07A5F]">
              <span className="material-symbols-outlined text-sm icon-filled">
                <Star size={16} className="md:w-5 md:h-5" />
              </span>
              <span className="text-xs md:text-sm font-bold">
                {Number(item.avgRating).toFixed(1)}
              </span>
            </div>
          ) : null}
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
          {item.title}
        </h1>
        {item.titleKh ? (
          <h2 className="text-lg md:text-xl lg:text-2xl mt-1 font-khmer text-gray-500 dark:text-gray-400">
            {item.titleKh}
          </h2>
        ) : null}
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center justify-between gap-y-2 md:gap-y-3 gap-x-4 md:gap-x-6 text-xs md:text-sm text-gray-900 dark:text-white">
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          {item.addressText ? (
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-sm text-primary/90">
                  <MapPin size={16} className="md:w-5 md:h-5" />
                </span>
              </div>
              <span className="font-medium text-xs md:text-sm">
                {item.addressText}
              </span>
            </div>
          ) : null}
          {item.priceLevel ? (
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <span className="material-symbols-outlined text-sm">
                  <Banknote size={16} className="md:w-5 md:h-5" />
                </span>
              </div>
              <span className="font-medium text-xs md:text-sm">
                {item.priceLevel}
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex items-center">
          {typeof item.views === "number" ? (
            <div className="flex items-center gap-1.5 md:gap-2 text-primary/90">
              <span className="material-symbols-outlined text-sm md:text-lg">
                <Eye size={16} className="md:w-5 md:h-5" />
              </span>
              <span className="text-xs md:text-sm">{item.views} views</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
