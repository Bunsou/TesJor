"use client";

import Link from "next/link";
import { getDefaultImage } from "@/lib/default-images";
import { Listing } from "@/server/db/schema";

const getCategoryStyle = (category: string) => {
  switch (category?.toLowerCase()) {
    case "place":
      return {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-600 dark:text-orange-400",
      };
    case "event":
      return {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-600 dark:text-green-400",
      };
    case "food":
      return {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-600 dark:text-amber-400",
      };
    case "souvenir":
      return {
        bg: "bg-pink-100 dark:bg-pink-900/30",
        text: "text-pink-600 dark:text-pink-400",
      };
    default:
      return {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-600 dark:text-gray-400",
      };
  }
};

interface PlacePreviewCardProps {
  item: Listing;
  onClose: () => void;
}

export function PlacePreviewCard({ item, onClose }: PlacePreviewCardProps) {
  return (
    <div className="absolute bottom-16 md:bottom-8 left-2 md:left-8 z-30 w-[calc(100%-1rem)] md:w-[380px] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white dark:bg-[#2A201D] rounded-xl md:rounded-2xl shadow-2xl p-3 md:p-4 flex gap-3 md:gap-4 border border-gray-200 dark:border-gray-700">
        {/* Image */}
        <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-lg md:rounded-xl bg-gray-200 overflow-hidden relative group cursor-pointer">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{
              backgroundImage: `url('${
                item.mainImage || getDefaultImage(item.category)
              }')`,
            }}
          />
          {/* Rating Badge */}
          {item.avgRating && (
            <div className="absolute top-1 right-1 md:top-2 md:right-2 px-1 md:px-1.5 py-0.5 bg-white/90 dark:bg-black/60 backdrop-blur-sm rounded-md flex items-center gap-0.5 shadow-sm">
              <span className="text-[9px] md:text-[10px] font-bold text-[#1a110f] dark:text-[#f2eae8]">
                {Number(item.avgRating).toFixed(1)}
              </span>
              <span
                className="material-symbols-outlined text-[9px] md:text-[10px] text-[#1a110f] dark:text-[#f2eae8]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between py-0.5 md:py-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-sm md:text-lg text-[#1a110f] dark:text-[#f2eae8] leading-tight truncate">
              {item.title}
            </h3>
            <button
              onClick={onClose}
              className="text-[#926154] hover:text-primary transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-lg md:text-xl">
                close
              </span>
            </button>
          </div>

          {/* Location */}
          <div className="flex items-center gap-0.5 md:gap-1 text-[#926154] dark:text-[#d6c1bd] text-[10px] md:text-xs">
            <span className="material-symbols-outlined text-xs md:text-sm">
              location_on
            </span>
            <span className="truncate">{item.addressText || "Cambodia"}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-1 md:pt-2">
            {/* Category Tags */}
            <div className="flex gap-1 md:gap-2">
              <span
                className={`px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-md md:rounded-lg ${
                  getCategoryStyle(item.category).bg
                } ${
                  getCategoryStyle(item.category).text
                } text-[9px] md:text-[10px] font-semibold capitalize`}
              >
                {item.category}
              </span>
            </div>

            {/* View Details Button */}
            <Link
              href={`/explore/${item.slug}`}
              className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center shadow-lg shadow-primary/30 transition-all hover:scale-105"
            >
              <span className="material-symbols-outlined text-base md:text-lg">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
