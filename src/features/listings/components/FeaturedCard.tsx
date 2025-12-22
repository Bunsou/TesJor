import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import { Listing } from "@/server/db/schema";
import { getDefaultImage } from "@/lib/default-images";

interface FeaturedCardProps {
  item: Listing;
  isBookmarked?: boolean;
  isVisited?: boolean;
  onBookmark?: () => void;
  onVisit?: () => void;
}

export function FeaturedCard({ item }: FeaturedCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageSrc =
    imageError || !item.mainImage
      ? getDefaultImage(item.category)
      : item.mainImage;

  return (
    <Link href={`/explore/${item.slug}`}>
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

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <h3 className="font-bold text-3xl text-white mb-2">{item.title}</h3>
            <div className="flex items-center gap-4 text-white/90">
              {item.addressText && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#E07A5F] text-sm">
                    <MapPin />
                  </span>
                  <span className="text-sm font-medium">
                    {item.addressText}
                  </span>
                </div>
              )}
              {item.avgRating && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-yellow-400 text-sm icon-filled">
                    <Star />
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
