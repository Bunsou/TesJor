"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Bookmark, MapPin, DollarSign, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { ContentItem } from "@/types";
import { getDefaultImage } from "@/lib/default-images";

interface ItemDetailResponse {
  item: ContentItem;
  isBookmarked: boolean;
  isVisited: boolean;
}

async function fetchItem(id: string) {
  const res = await fetch(`/api/listings/${id}`);
  if (!res.ok) throw new Error("Failed to fetch item");
  return res.json();
}

async function toggleBookmark({
  itemId,
  category,
  action,
}: {
  itemId: string;
  category: string;
  action: "add" | "remove";
}) {
  const res = await fetch("/api/user/bookmark", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, category, action }),
  });
  if (!res.ok) throw new Error("Failed to toggle bookmark");
  return res.json();
}

async function toggleVisited({
  itemId,
  category,
  action,
}: {
  itemId: string;
  category: string;
  action: "add" | "remove";
}) {
  const res = await fetch("/api/user/visited", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, category, action }),
  });
  if (!res.ok) throw new Error("Failed to toggle visited");
  return res.json();
}

function triggerConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

export default function ItemDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<ItemDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Fetch item data
  useEffect(() => {
    let isMounted = true;

    async function loadItem() {
      try {
        setIsLoading(true);
        setError(null);
        const itemData = await fetchItem(id);
        if (isMounted) {
          setData(itemData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load item");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadItem();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleBookmark = async (action: "add" | "remove") => {
    if (!data) return;

    try {
      await toggleBookmark({
        itemId: id,
        category: data.item.category,
        action,
      });
      // Refetch item data
      const itemData = await fetchItem(id);
      setData(itemData);
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  const handleVisited = async (action: "add" | "remove") => {
    if (!data) return;

    try {
      const result = await toggleVisited({
        itemId: id,
        category: data.item.category,
        action,
      });
      // Refetch item data
      const itemData = await fetchItem(id);
      setData(itemData);

      if (result.visited) {
        triggerConfetti();
      }
    } catch (err) {
      console.error("Failed to toggle visited:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-foreground-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.item) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">Failed to load item details</p>
        </div>
      </div>
    );
  }

  const item = data.item;
  const isBookmarked = data.isBookmarked;
  const isVisited = data.isVisited;

  const imageSrc =
    imageError || !item.imageUrl
      ? getDefaultImage(item.category)
      : item.imageUrl;

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Image */}
      <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden mb-6">
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Title and Category */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium capitalize">
              {item.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {item.name}
          </h1>
          {item.nameKh && (
            <p className="text-xl text-foreground-muted">{item.nameKh}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant={isBookmarked ? "default" : "outline"}
            size="lg"
            onClick={() => handleBookmark(isBookmarked ? "remove" : "add")}
          >
            <Bookmark
              className={`w-5 h-5 mr-2 ${isBookmarked ? "fill-current" : ""}`}
            />
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>

          <Button
            variant={isVisited ? "default" : "outline"}
            size="lg"
            onClick={() => handleVisited(isVisited ? "remove" : "add")}
          >
            <Check className="w-5 h-5 mr-2" />
            {isVisited ? "Visited" : "Check In"}
          </Button>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Description
          </h2>
          <p className="text-foreground-muted leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Location (if available) */}
        {"lat" in item && "lng" in item && item.lat && item.lng && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Location
            </h2>
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-primary mt-1" />
              <div>
                {"province" in item && item.province && (
                  <p className="text-foreground font-medium">{item.province}</p>
                )}
                <p className="text-foreground-muted text-sm">
                  {item.lat}, {item.lng}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Price Range (if available) */}
        {item.priceRange && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Price Range
            </h2>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <p className="text-foreground font-medium capitalize">
                {item.priceRange}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
