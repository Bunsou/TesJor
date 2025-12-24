"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  CircleSmall,
  MapPin,
  Star,
} from "lucide-react";
import { ListingWithDistance } from "@/shared/types";
import { getDefaultImage } from "@/lib/default-images";

interface TrendingSliderProps {
  items: ListingWithDistance[];
}

export function TrendingSlider({ items }: TrendingSliderProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (isPaused || !items || items.length <= 1) return;

    const interval = setInterval(() => {
      setImageIndex((index) => {
        if (index === items.length - 1) return 0;
        return index + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, items]);

  if (!items || items.length === 0) {
    return null;
  }

  function showNextImage() {
    setImageIndex((index) => {
      if (index === items.length - 1) return 0;
      return index + 1;
    });
  }

  function showPrevImage() {
    setImageIndex((index) => {
      if (index === 0) return items.length - 1;
      return index - 1;
    });
  }

  const handleImageError = (itemId: string) => {
    setImageErrors((prev) => ({ ...prev, [itemId]: true }));
  };

  return (
    <section
      aria-label="Trending Destinations Slider"
      className="w-full rounded-xl md:rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-[#2C211F] relative mb-6 md:mb-8"
      style={{ aspectRatio: "16 / 9" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <a href="#after-slider-controls" className="skip-link">
        Skip Trending Slider Controls
      </a>

      {/* Image Container */}
      <div className="w-full h-full flex overflow-hidden relative">
        {items.map((item, index) => {
          const imageSrc =
            imageErrors[item.id] || !item.mainImage
              ? getDefaultImage(item.category)
              : item.mainImage;

          return (
            <div
              key={item.id}
              aria-hidden={imageIndex !== index}
              className="min-w-full h-full shrink-0 grow-0 relative transition-transform duration-300 ease-in-out"
              style={{ translate: `${-100 * imageIndex}%` }}
            >
              <Link
                href={`/explore/${item.slug}`}
                className="block w-full h-full"
              >
                <Image
                  src={imageSrc}
                  alt={item.title}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(item.id)}
                  priority={index === 0}
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

                {/* Trending badge */}
                <div className="absolute top-2 left-2 md:top-4 md:left-4">
                  <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-primary/80 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold border border-primary/30">
                    Trending #{index + 1}
                  </span>
                </div>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 p-3 md:p-6 w-full">
                  <h3 className="font-bold text-lg md:text-2xl lg:text-3xl text-white mb-1 md:mb-2 line-clamp-2 md:line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 md:gap-4 text-white/90 flex-wrap text-xs md:text-sm">
                    {item.addressText && (
                      <div className="flex items-center gap-0.5 md:gap-1">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 text-[#E07A5F] flex-shrink-0" />
                        <span className="font-medium truncate max-w-[120px] md:max-w-none">
                          {item.addressText}
                        </span>
                      </div>
                    )}
                    {item.avgRating && (
                      <div className="flex items-center gap-0.5 md:gap-1">
                        <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                        <span className="font-medium">
                          {item.avgRating} ({item.views} views)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Previous Button */}
      <button
        onClick={showPrevImage}
        className="absolute top-0 bottom-0 left-0 p-2 md:p-4 cursor-pointer transition-colors duration-100 z-10"
        aria-label="View Previous Trending Destination"
      >
        <div className="bg-background/95 p-1.5 md:p-2 rounded-full">
          <ChevronLeft
            className="w-5 h-5 md:w-6 md:h-6 text-primary/90"
            aria-hidden
          />
        </div>
      </button>

      {/* Next Button */}
      <button
        onClick={showNextImage}
        className="absolute top-0 bottom-0 right-0 p-2 md:p-4 cursor-pointer transition-colors duration-100 z-10"
        aria-label="View Next Trending Destination"
      >
        <div className="bg-background/95 p-1.5 md:p-2 rounded-full">
          <ChevronRight
            className="w-5 h-5 md:w-6 md:h-6 text-primary/90"
            aria-hidden
          />
        </div>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-1.5 md:bottom-2 left-1/2 -translate-x-1/2 flex gap-0 z-10">
        {items.map((item, index) => (
          <button
            key={item.id}
            className="block cursor-pointer w-3 h-3 md:w-4 md:h-4 transition-transform duration-100 hover:scale-125 focus-visible:scale-125 focus-visible:outline-none"
            aria-label={`View Trending Destination ${index + 1}`}
            onClick={() => setImageIndex(index)}
          >
            {index === imageIndex ? (
              <CircleSmall
                className="w-full h-full text-primary/80 fill-primary"
                aria-hidden
              />
            ) : (
              <CircleSmall
                className="w-full h-full text-primary/50 hover:fill-primary/80"
                aria-hidden
              />
            )}
          </button>
        ))}
      </div>

      <div id="after-slider-controls" />
    </section>
  );
}
