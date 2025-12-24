"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Listing } from "@/server/db/schema";
import { getDefaultImage } from "@/lib/default-images";

interface RelatedListingsProps {
  slug: string;
}

const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    place: "Place",
    event: "Event",
    food: "Food",
    drink: "Drink",
    souvenir: "Souvenir",
  };
  return labels[category] || category;
};

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    place: "text-blue-600 dark:text-blue-400",
    event: "text-purple-600 dark:text-purple-400",
    food: "text-orange-600 dark:text-orange-400",
    drink: "text-green-600 dark:text-green-400",
    souvenir: "text-pink-600 dark:text-pink-400",
  };
  return colors[category] || "text-gray-600 dark:text-gray-400";
};

export default function RelatedListings({ slug }: RelatedListingsProps) {
  const router = useRouter();
  const [relatedItems, setRelatedItems] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/listings/${slug}/related`);
        if (res.ok) {
          const data = await res.json();
          setRelatedItems(data.data.items || []);
        }
      } catch (error) {
        console.error("Failed to fetch related listings:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRelated();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#2A201D] rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          You might also like
        </h3>
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl shrink-0" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!relatedItems.length) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-[#2A201D] rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
      <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-gray-900 dark:text-white">
        You might also like
      </h3>
      <div className="flex flex-col gap-2 md:gap-3">
        {relatedItems.map((item) => {
          const imageSrc = item.mainImage || getDefaultImage(item.category);
          const categoryLabel = getCategoryLabel(item.category);
          const categoryColor = getCategoryColor(item.category);

          return (
            <button
              key={item.id}
              onClick={() => router.push(`/explore/${item.slug}`)}
              className="flex gap-2 md:gap-3 items-start mb-1 md:mb-2 bg-background/90 hover:bg-background dark:hover:bg-[#3A2A25] p-2 -m-2 rounded-lg md:rounded-xl transition-colors group"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800 relative">
                <Image
                  src={imageSrc}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getDefaultImage(item.category);
                  }}
                />
              </div>
              <div className="flex-1 text-left min-w-0">
                <h4 className="font-semibold text-xs md:text-sm text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p
                  className={`text-[10px] md:text-xs mt-0.5 md:mt-1 ${categoryColor}`}
                >
                  {categoryLabel}
                  {item.tags && item.tags.length > 0 && (
                    <span className="text-gray-500 dark:text-gray-400">
                      {" • "}
                      {item.tags[0].charAt(0).toUpperCase() +
                        item.tags[0].slice(1)}
                    </span>
                  )}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
