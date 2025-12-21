import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookCheck, Heart } from "lucide-react";
import type { Listing } from "@/shared/types";
import { getDefaultImage } from "@/lib/default-images";
import { ActionButton } from "@/components/shared/ActionButton";

interface FeaturedCardProps {
  item: Listing;
  isBookmarked?: boolean;
  isVisited?: boolean;
  onBookmark?: () => void;
  onVisit?: () => void;
}

export function FeaturedCard({
  item,
  isBookmarked = false,
  isVisited = false,
  onBookmark,
  onVisit,
}: FeaturedCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageSrc =
    imageError || !item.mainImage
      ? getDefaultImage(item.category)
      : item.mainImage;

  return (
    <Link href={`/explore/${item.id}`}>
      <div className="w-full rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-[#2C211F] group cursor-pointer">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Trending badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-primary/80 backdrop-blur-sm text-white text-xs font-bold border border-primary/30">
              Trending
            </span>
          </div>

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <ActionButton
              icon={<BookCheck className="h-5 w-5" />}
              active={isVisited}
              onClick={(e) => {
                e.preventDefault();
                onVisit?.();
              }}
              title="Mark as Visited"
              variant="overlay"
              activeColor="bg-[#2D6A4F] text-white"
              className="bg-white/20 backdrop-blur-md text-white hover:bg-[#2D6A4F] hover:text-white border border-white/30"
            />
            <ActionButton
              icon={<Heart className="h-5 w-5" />}
              active={isBookmarked}
              onClick={(e) => {
                e.preventDefault();
                onBookmark?.();
              }}
              title="Save to Favorites"
              variant="overlay"
              className="bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500 border border-white/30"
            />
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <h3 className="font-bold text-3xl text-white mb-2">{item.title}</h3>
            <div className="flex items-center gap-4 text-white/90">
              {item.addressText && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#E07A5F] text-sm">
                    location_on
                  </span>
                  <span className="text-sm font-medium">
                    {item.addressText}
                  </span>
                </div>
              )}
              {item.avgRating && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-yellow-400 text-sm icon-filled">
                    star
                  </span>
                  <span className="text-sm font-medium">
                    {item.avgRating} ({item.views} views)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
