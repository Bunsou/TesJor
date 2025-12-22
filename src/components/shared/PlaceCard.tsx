"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListingWithDistance } from "@/shared/types";
import { truncate } from "@/lib/utils";
import { getDefaultImage } from "@/lib/default-images";

interface PlaceCardProps {
  item: ListingWithDistance;
  isBookmarked?: boolean;
  isVisited?: boolean;
  onBookmark?: () => void;
  onVisited?: () => void;
}

export function PlaceCard({
  item,
  isBookmarked = false,
  isVisited = false,
}: PlaceCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageSrc =
    imageError || !item.mainImage
      ? getDefaultImage(item.category)
      : item.mainImage;

  return (
    <Link href={`/explore/${item.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        {/* Image */}
        <div className="relative h-48 bg-muted">
          <Image
            src={imageSrc}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />

          {/* Badges */}
          <div className="absolute top-2 right-2 flex gap-2">
            {isVisited && (
              <Badge className="bg-success text-white">
                <Check className="h-3 w-3 mr-1" />
                Visited
              </Badge>
            )}
            {isBookmarked && (
              <Badge variant="secondary">
                <Heart className="h-3 w-3 fill-current" />
              </Badge>
            )}
          </div>

          {/* Distance badge for nearby items */}
          {item.distance !== undefined && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="secondary">
                {item.distance.toFixed(1)} km away
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-lg text-foreground mb-1">
            {item.title}
          </h3>
          {item.titleKh && (
            <p className="text-sm text-foreground-muted font-khmer mb-2">
              {item.titleKh}
            </p>
          )}

          {/* Description */}
          <p className="text-sm text-foreground-muted mb-3">
            {truncate(item.description, 100)}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {item.priceLevel && (
              <span className="text-sm font-medium text-primary">
                {item.priceLevel}
              </span>
            )}

            {item.addressText && (
              <span className="text-xs text-foreground-muted">
                📍 {item.addressText}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
