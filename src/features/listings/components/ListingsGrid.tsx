"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import type { ListingWithDistance } from "@/shared/types";
import { TrendingSlider } from "./TrendingSlider";
import { PlaceCard } from "./PlaceCard";
import { EmptyState } from "./EmptyState";
import { ListingWithBookmarkAndVisit } from "@/shared/types/content.types";

interface ListingsGridProps {
  trendingItems: ListingWithDistance[];
  items: ListingWithDistance[];
  category: string;
  categoryLabel: string;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

export function ListingsGrid({
  trendingItems,
  items,
  category,
  categoryLabel,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: ListingsGridProps) {
  const totalCount = items.length;
  const hasNoResults = items.length === 0;

  // State for user progress (bookmarks and visits)
  const [userProgress, setUserProgress] = useState<
    Record<string, { isBookmarked: boolean; isVisited: boolean }>
  >({});
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  // Fetch user progress for all items
  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        setIsLoadingProgress(true);
        const response = await fetch("/api/user/progress");

        if (!response.ok) {
          // User not logged in or other error - just continue without progress
          setIsLoadingProgress(false);
          return;
        }

        const data = await response.json();

        if (data.success && data.data.items) {
          const progressMap: Record<
            string,
            { isBookmarked: boolean; isVisited: boolean }
          > = {};

          data.data.items.forEach((item: ListingWithBookmarkAndVisit) => {
            progressMap[item.id] = {
              isBookmarked: item.isBookmarked,
              isVisited: item.isVisited,
            };
          });

          setUserProgress(progressMap);
        }
      } catch (error) {
        console.error("Error fetching user progress:", error);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    fetchUserProgress();
  }, []);

  // Handle bookmark toggle
  const handleBookmark = async (itemId: string) => {
    const currentState = userProgress[itemId]?.isBookmarked || false;
    const action = currentState ? "remove" : "add";

    // Optimistic update
    setUserProgress((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        isBookmarked: !currentState,
      },
    }));

    try {
      const response = await fetch("/api/user/bookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId: itemId,
          action,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update bookmark");
      }

      const data = await response.json();

      if (data.success) {
        toast.success(
          action === "add" ? "Added to favorites" : "Removed from favorites"
        );
      }
    } catch (error) {
      // Revert optimistic update on error
      setUserProgress((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          isBookmarked: currentState,
        },
      }));
      toast.error("Failed to update bookmark. Please try again.");
    }
  };

  // Handle visited toggle
  const handleVisit = async (itemId: string) => {
    const currentState = userProgress[itemId]?.isVisited || false;
    const action = currentState ? "remove" : "add";

    // Optimistic update
    setUserProgress((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        isVisited: !currentState,
      },
    }));

    try {
      const response = await fetch("/api/user/visited", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId: itemId,
          action,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update visited status");
      }

      const data = await response.json();

      if (data.success) {
        toast.success(
          action === "add" ? "Marked as visited" : "Unmarked as visited"
        );
      }
    } catch (error) {
      // Revert optimistic update on error
      setUserProgress((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          isVisited: currentState,
        },
      }));
      toast.error("Failed to update visited status. Please try again.");
    }
  };

  // Intersection observer for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  // Trigger load more when spinner comes into view
  useEffect(() => {
    if (inView && hasMore && !isLoadingMore) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoadingMore, onLoadMore]);

  return (
    <section>
      {/* Trending Slider */}
      {trendingItems.length > 0 && <TrendingSlider items={trendingItems} />}

      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
          {category === "all" ? "All Destinations" : `All ${categoryLabel}`}
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {totalCount} results
        </span>
      </div>

      {/* Grid of Cards or Empty State */}
      {hasNoResults ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <PlaceCard
                key={item.id}
                item={item}
                showDistance={item.distance !== undefined}
                isBookmarked={userProgress[item.id]?.isBookmarked || false}
                isVisited={userProgress[item.id]?.isVisited || false}
                onBookmark={() => handleBookmark(item.id)}
                onVisit={() => handleVisit(item.id)}
              />
            ))}
          </div>

          {/* Loading Spinner - Infinite Scroll Trigger */}
          {hasMore && (
            <div
              ref={ref}
              className="flex justify-center items-center mt-12 mb-8 min-h-[80px]"
            >
              <div className="flex flex-col items-center gap-3">
                <svg
                  aria-hidden="true"
                  className="h-10 w-10 animate-spin fill-[#E07A5F] text-gray-200 dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Loading more...
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
