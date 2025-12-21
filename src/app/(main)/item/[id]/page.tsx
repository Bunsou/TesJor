"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Bookmark, MapPin, DollarSign, Check } from "lucide-react";
import confetti from "canvas-confetti";
import type { Listing } from "@/shared/types";
import { getDefaultImage } from "@/lib/default-images";

interface ItemDetailResponse {
  item: Listing;
  isBookmarked: boolean;
  isVisited: boolean;
}

async function fetchItem(slug: string) {
  const res = await fetch(`/api/listings/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch item");
  const json = await res.json();
  console.log("Fetched item data:", json);

  // Fetch user progress for this item using the item's ID
  let isBookmarked = false;
  let isVisited = false;

  try {
    const progressRes = await fetch(
      `/api/user/progress?itemId=${json.data.id}`
    );
    if (progressRes.ok) {
      const progressJson = await progressRes.json();
      isBookmarked = progressJson.data?.isBookmarked || false;
      isVisited = progressJson.data?.isVisited || false;
      console.log("Fetched progress data:", progressJson.data);
    }
  } catch (err) {
    // User might not be logged in, or progress doesn't exist
    console.log("Could not fetch progress (user may not be logged in):", err);
  }

  // API returns { success, data: { ...item, category } }
  // Transform to match ItemDetailResponse structure
  return {
    item: json.data,
    isBookmarked,
    isVisited,
  };
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
  const slug = params.id as string;

  console.log("item slug", slug);

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
        const itemData = await fetchItem(slug);
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
  }, [slug]);

  const handleBookmark = async (action: "add" | "remove") => {
    if (!data) return;

    try {
      await toggleBookmark({
        itemId: data.item.id,
        category: data.item.category,
        action,
      });
      // Refetch item data
      const itemData = await fetchItem(slug);
      setData(itemData);
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  const handleVisited = async (action: "add" | "remove") => {
    if (!data) return;

    try {
      const result = await toggleVisited({
        itemId: data.item.id,
        category: data.item.category,
        action,
      });
      // Refetch item data
      const itemData = await fetchItem(slug);
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
    imageError || !item.mainImage
      ? getDefaultImage(item.category)
      : item.mainImage;

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Image */}
      <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden mb-6">
        <Image
          src={imageSrc}
          alt={item.title}
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
            {item.title}
          </h1>
          {item.titleKh && (
            <p className="text-xl text-foreground-muted">{item.titleKh}</p>
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
        {item.lat && item.lng && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Location
            </h2>
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-primary mt-1" />
              <div>
                {item.addressText && (
                  <p className="text-foreground font-medium">
                    {item.addressText}
                  </p>
                )}
                <p className="text-foreground-muted text-sm">
                  {item.lat}, {item.lng}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Price Range (if available) */}
        {item.priceLevel && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Price Range
            </h2>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <p className="text-foreground font-medium capitalize">
                {item.priceLevel}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
