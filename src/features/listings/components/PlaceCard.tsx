"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookCheck, Heart, MapPin } from "lucide-react";
import type { ListingWithDistance } from "@/shared/types";
import { getDefaultImage } from "@/lib/default-images";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { ActionButton } from "@/components/shared/ActionButton";

interface PlaceCardProps {
  item: ListingWithDistance;
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
      {/* Mobile: Horizontal Layout */}
      <div className="md:hidden flex flex-row bg-white dark:bg-[#2C211F] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
        {/* Image - Left Side */}
        <div className="relative w-32 h-32 shrink-0">
          <Image
            src={imageSrc}
            alt={item.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />

          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex flex-row gap-1 z-10">
            <ActionButton
              icon={<BookCheck className="h-4 w-4" />}
              active={isVisited}
              onClick={(e) => {
                e.preventDefault();
                onVisit?.();
              }}
              title={isVisited ? "Visited" : "Mark as Visited"}
              variant="overlay"
              activeColor="bg-green-700/90 text-white"
              className="hover:text-green-600 hover:bg-green-100/90 w-8 h-8"
            />
            <ActionButton
              icon={
                <Heart
                  className="h-4 w-4"
                  fill={isBookmarked ? "oklch(0.6925 0.1321 36.39)" : "none"}
                />
              }
              active={isBookmarked}
              onClick={(e) => {
                e.preventDefault();
                onBookmark?.();
              }}
              title={isBookmarked ? "Saved" : "Save to Favorites"}
              variant="overlay"
              activeColor="bg-orange-100/90 text-primary"
              className="hover:text-primary hover:bg-orange-100/90 w-8 h-8"
            />
          </div>
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

            <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 mb-2">
              {item.description}
            </p>
          </div>

          <div className="flex items-end justify-between">
            {/* <div className="flex flex-col">
              {showDistance && item.distance !== undefined && (
                <>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    Distance
                  </span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">
                    {item.distance.toFixed(1)}km away
                  </span>
                </>
              )}
            </div> */}
            {item.province && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 line-clamp-1">
                  {item.province === "All of Cambodia"
                    ? "Cambodia"
                    : item.province}
                </span>
              </div>
            )}
            {item.priceLevel && (
              <span className="text-sm font-medium text-[#E07A5F]">
                {item.priceLevel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: Vertical Layout (Original Design) */}
      <div className="hidden md:flex flex-col bg-white dark:bg-[#2C211F] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow group">
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
              activeColor="bg-green-700/90 text-white"
              className="hover:text-green-600 hover:bg-green-100/90"
            />
            <ActionButton
              icon={
                <Heart
                  className="h-5 w-5"
                  fill={isBookmarked ? "oklch(0.6925 0.1321 36.39)" : "none"}
                />
              }
              active={isBookmarked}
              onClick={(e) => {
                e.preventDefault();
                onBookmark?.();
              }}
              title={isBookmarked ? "Saved" : "Save to Favorites"}
              variant="overlay"
              activeColor="bg-orange-100/90 text-primary"
              className="hover:text-primary hover:bg-orange-100/90"
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

          <div className="flex justify-between items-center mb-4">
            {item.titleKh && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-khmer">
                {item.titleKh}
              </p>
            )}
            {item.priceLevel && (
              <span className="text-md font-medium text-[#E07A5F]">
                {item.priceLevel}
              </span>
            )}
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {item.description}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col">
              {/* {showDistance && item.distance !== undefined && (
                <>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    Distance
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.distance.toFixed(1)}km away
                  </span>
                </>
              )} */}

              {item.province && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-md font-medium text-gray-600 dark:text-gray-400 line-clamp-1">
                    {item.province === "All of Cambodia"
                      ? "Cambodia"
                      : item.province}
                  </span>
                </div>
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
