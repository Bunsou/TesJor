"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  onError?: () => void;
}

export function ImageCarousel({ images, alt, onError }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="w-full relative group rounded-2xl overflow-hidden shadow-sm aspect-video md:aspect-21/9 bg-gray-200 dark:bg-gray-800">
      <div className="absolute inset-0 transition-transform duration-500 ease-out">
        <Image
          src={images[currentIndex]}
          alt={alt}
          fill
          className="object-cover"
          onError={onError}
        />
      </div>

      {/* Carousel Controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === 0 ? images.length - 1 : prev - 1
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-black/70 transition-colors shadow-lg"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-black/70 transition-colors shadow-lg"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full shadow-sm transition-colors ${
                  idx === currentIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
