import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Heart, History, MapPin } from "lucide-react";
import type { ListingWithProgress } from "@/shared/types";
import { getDefaultImage } from "@/lib/default-images";

interface TripCardProps {
  item: ListingWithProgress;
  showVisitedState?: boolean;
}

function getCategoryStyle(category: string) {
  const styles: Record<string, string> = {
    place: "bg-green-600/90",
    event: "bg-blue-500/90",
    food: "bg-orange-500/90",
    drink: "bg-purple-500/90",
    souvenir: "bg-pink-500/90",
  };
  return styles[category] || "bg-[#E07A5F]/90";
}

export function TripCard({ item, showVisitedState = false }: TripCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageSrc =
    imageError || !item.mainImage
      ? getDefaultImage(item.category)
      : item.mainImage;

  return (
    <Link href={`/explore/${item.id}`}>
      <div
        className={`group bg-white dark:bg-[#2A201D] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${
          showVisitedState && item.isVisited
            ? "opacity-80 hover:opacity-100"
            : ""
        }`}
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <div
            className={`absolute inset-0 transition-transform duration-500 group-hover:scale-110 ${
              showVisitedState && item.isVisited
                ? "grayscale-0 group-hover:grayscale-0"
                : ""
            }`}
          >
            <Image
              src={imageSrc}
              alt={item.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

          {/* Bookmark/Visited Button */}
          <div className="absolute top-3 right-3 z-10">
            {showVisitedState && item.isVisited ? (
              <button className="w-8 h-8 rounded-full bg-green-500 text-white shadow-md flex items-center justify-center cursor-default">
                <span className="material-symbols-outlined text-lg">
                  <Check />
                </span>
              </button>
            ) : (
              <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-[#E07A5F] transition-colors">
                <Heart
                  fill="currentColor"
                  strokeWidth={0}
                  className="h-4 w-4"
                />
              </button>
            )}
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`px-2.5 py-1 rounded-md ${getCategoryStyle(
                item.category
              )} text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm`}
            >
              {item.category}
            </span>
          </div>

          {/* Visited Info */}
          {showVisitedState && item.isVisited && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white text-xs font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  <History size={16} />
                </span>
                Visited{" "}
                {item.visitedAt
                  ? new Date(item.visitedAt).toLocaleDateString()
                  : ""}
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-1 line-clamp-1">
            {item.title}
          </h3>
          {item.titleKh && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-khmer line-clamp-1">
              {item.titleKh}
            </p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {item.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs">
            {item.addressText && (
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-sm">
                  <MapPin size={16} />
                </span>
                <span className="truncate">{item.addressText}</span>
              </div>
            )}
            {item.priceLevel && (
              <span className="text-[#E07A5F] font-semibold shrink-0">
                {item.priceLevel}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
