import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookCheck, Heart, History, MapPin } from "lucide-react";
import type { ListingWithProgress } from "@/shared/types";
import { getDefaultImage } from "@/lib/default-images";
import { CategoryBadge } from "@/components/shared/CategoryBadge";

interface TripCardProps {
  item: ListingWithProgress;
  showVisitedState?: boolean;
}

function getCategoryStyle(category: string) {
  const styles: Record<string, string> = {
    place: "bg-green-600/90",
    event: "bg-blue-500/90",
    food: "bg-orange-500/90",
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
    <Link href={`/explore/${item.slug}`}>
      {/* Mobile: Horizontal Layout */}
      <div
        className={`md:hidden flex flex-row bg-white dark:bg-[#2A201D] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
          showVisitedState && item.isVisited
            ? "opacity-80 hover:opacity-100"
            : ""
        }`}
      >
        {/* Image - Left Side */}
        <div className="relative w-32 h-32 shrink-0">
          <Image
            src={imageSrc}
            alt={item.title}
            fill
            className={`object-cover ${
              showVisitedState && item.isVisited ? "grayscale-0" : ""
            }`}
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Category Badge - Top Left */}
          <div className="absolute top-1.5 left-1.5 z-10">
            <span
              className={`px-1.5 py-0.5 rounded ${getCategoryStyle(
                item.category
              )} text-white text-[8px] font-bold uppercase tracking-wide`}
            >
              {item.category}
            </span>
          </div>

          {/* Bookmark/Visited Button - Top Right */}
          <div className="absolute top-1.5 right-1.5 z-10">
            {showVisitedState && item.isVisited ? (
              <div className="w-7 h-7 rounded-full bg-green-200/90 dark:bg-green-900/30 flex items-center justify-center">
                <BookCheck size={16} color="green" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-orange-100/80 dark:bg-orange-900/30 backdrop-blur-md flex items-center justify-center text-primary">
                <Heart
                  fill="currentColor"
                  strokeWidth={0}
                  className="h-4 w-4"
                />
              </div>
            )}
          </div>

          {/* Visited Info - Bottom */}
          {showVisitedState && item.isVisited && (
            <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white text-[9px] font-medium flex items-center gap-0.5">
                <History size={12} />
                <span className="truncate">
                  {item.visitedAt
                    ? new Date(item.visitedAt).toLocaleDateString()
                    : "Visited"}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Content - Right Side */}
        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-semibold text-base text-gray-900 dark:text-white line-clamp-1">
                {item.title}
              </h3>
              <CategoryBadge category={item.category} className="shrink-0" />
            </div>

            {item.titleKh && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-khmer line-clamp-1">
                {item.titleKh}
              </p>
            )}

            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
              {item.description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs">
            {item.province && (
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 min-w-0 flex-1 mr-2">
                <MapPin size={14} className="shrink-0" />
                <span className="truncate text-xs">
                  {item.province === "All of Cambodia"
                    ? "Cambodia"
                    : item.province}
                </span>
              </div>
            )}
            {item.priceLevel && (
              <span className="text-[#E07A5F] font-semibold shrink-0 text-sm">
                {item.priceLevel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: Vertical Layout */}
      <div
        className={`hidden md:block group bg-white dark:bg-[#2A201D] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${
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
              <button className="w-8 h-8 rounded-full bg-green-200/90 dark:bg-green-900/30 text-white shadow-md flex items-center justify-center cursor-default">
                <BookCheck size={20} color="green" />
              </button>
            ) : (
              <button className="w-8 h-8 rounded-full bg-orange-100/80 dark:bg-orange-900/30 backdrop-blur-md flex items-center justify-center text-primary transition-colors">
                <Heart
                  fill="currentColor"
                  strokeWidth={0}
                  className="h-5 w-5"
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
                <History size={16} />
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
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-base text-gray-900 dark:text-white line-clamp-1">
              {item.title}
            </h3>
            <CategoryBadge category={item.category} className="shrink-0 ml-2" />
          </div>

          <div className="flex justify-between items-center mb-4">
            {item.titleKh && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-khmer">
                {item.titleKh}
              </p>
            )}
            {item.priceLevel && (
              <span className="text-md font-medium text-[#E07A5F]">
                {item.priceLevel}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
            {item.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs">
            {item.province && (
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 min-w-0 flex-1 mr-2">
                <MapPin size={14} className="shrink-0" />
                <span className="truncate text-xs">
                  {item.province === "All of Cambodia"
                    ? "Cambodia"
                    : item.province}
                </span>
              </div>
            )}
            {item.priceLevel && (
              <span className="text-[#E07A5F] font-semibold shrink-0 text-sm">
                {item.priceLevel}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
