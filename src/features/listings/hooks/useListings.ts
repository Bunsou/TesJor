import { useState, useEffect } from "react";
import type { Listing } from "@/shared/types";

interface UseListingsParams {
  category: string;
  searchQuery: string;
}

interface UseListingsReturn {
  items: Listing[];
  featuredItem: Listing | null;
  isLoading: boolean;
  error: string | null;
  nextCursor: string | null;
  isLoadingMore: boolean;
  loadMore: () => Promise<void>;
}

async function fetchListings({
  category,
  query,
  cursor,
}: {
  category: string;
  query: string;
  cursor?: string;
}) {
  const params = new URLSearchParams({
    limit: "10",
    ...(category && category !== "all" && { category }),
    ...(query && { q: query }),
    ...(cursor && { cursor }),
  });

  const url = `/api/listings?${params}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch listings");
  }

  const json = await res.json();
  return json.data;
}

export function useListings({
  category,
  searchQuery,
}: UseListingsParams): UseListingsReturn {
  const [items, setItems] = useState<Listing[]>([]);
  const [featuredItem, setFeaturedItem] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch initial data
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchListings({
          category,
          query: searchQuery,
        });

        if (isMounted) {
          const validItems = data.items.filter(
            (item: Listing) => item && item.id
          );
          if (validItems.length > 0) {
            setFeaturedItem(validItems[0]);
            setItems(validItems.slice(1));
          } else {
            setFeaturedItem(null);
            setItems([]);
          }
          setNextCursor(data.nextCursor);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load listings"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [category, searchQuery]);

  // Load more function
  const loadMore = async () => {
    if (!nextCursor || isLoadingMore) return;

    try {
      setIsLoadingMore(true);

      const data = await fetchListings({
        category,
        query: searchQuery,
        cursor: nextCursor,
      });

      setItems((prev) => [
        ...prev,
        ...data.items.filter((item: Listing) => item && item.id),
      ]);
      setNextCursor(data.nextCursor);
    } catch (err) {
      console.error("[Explore] Error loading more:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    items,
    featuredItem,
    isLoading,
    error,
    nextCursor,
    isLoadingMore,
    loadMore,
  };
}
