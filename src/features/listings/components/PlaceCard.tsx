import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookCheck, Heart } from "lucide-react";
import type { Listing } from "@/shared/types";
import { getDefaultImage } from "@/lib/default-images";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { ActionButton } from "@/components/shared/ActionButton";

interface PlaceCardProps {
  item: Listing;
  isBookmarked?: boolean;
  isVisited?: boolean;
  onBookmark?: () => void;
  onVisit?: () => void;
  showDistance?: boolean;
}

export function PlaceCard({
  item,
  isBookmarked = false,
  isVisited = false,
  onBookmark,
  onVisit,
  showDistance = false,
}: PlaceCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageSrc =
    imageError || !item.mainImage
      ? getDefaultImage(item.category)
      : item.mainImage;

  return (
    <Link href={`/explore/${item.slug}`}>
      <div className="flex flex-col bg-white dark:bg-[#2C211F] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageSrc}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            <ActionButton
              icon={<BookCheck className="h-5 w-5" />}
              active={isVisited}
              onClick={(e) => {
                e.preventDefault();
                onVisit?.();
              }}
              title={isVisited ? "Visited" : "Mark as Visited"}
              variant="overlay"
              activeColor="bg-[#2D6A4F] text-white"
            />
            <ActionButton
              icon={<Heart className="h-5 w-5" />}
              active={isBookmarked}
              onClick={(e) => {
                e.preventDefault();
                onBookmark?.();
              }}
              title={isBookmarked ? "Saved" : "Save to Favorites"}
              variant="overlay"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
              {item.title}
            </h3>
            <CategoryBadge category={item.category} className="shrink-0 ml-2" />
          </div>

          {item.titleKh && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-khmer">
              {item.titleKh}
            </p>
          )}

          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {item.description}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col">
              {showDistance && item.distance !== undefined && (
                <>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    Distance
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.distance.toFixed(1)}km away
                  </span>
                </>
              )}
              {item.priceLevel && (
                <span className="text-sm font-medium text-[#E07A5F]">
                  {item.priceLevel}
                </span>
              )}
            </div>
            <button
              className="bg-[#E07A5F] hover:bg-[#c66a50] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-[#E07A5F]/20"
              onClick={(e) => e.preventDefault()}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
