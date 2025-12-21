import { useState, useEffect, useCallback } from "react";
import type { Listing } from "@/shared/types";

interface UseListingsParams {
  category: string;
  searchQuery: string;
  initialData?: {
    items: Listing[];
    featuredItem: Listing | null;
    hasMore: boolean;
    nextPage: number | null;
  } | null;
  initialError?: string | null;
}

interface UseListingsReturn {
  items: Listing[];
  featuredItem: Listing | null;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => Promise<void>;
}

async function fetchListings({
  category,
  query,
  page,
  limit = 10,
}: {
  category: string;
  query: string;
  page: number;
  limit?: number;
}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(category && category !== "all" && { category }),
    ...(query && { q: query }),
  });

  const res = await fetch(`/api/listings?${params}`);

  if (!res.ok) {
    throw new Error("Failed to fetch listings");
  }

  const json = await res.json();
  return json.data;
}

export function useListings({
  category,
  searchQuery,
  initialData,
  initialError,
}: UseListingsParams): UseListingsReturn {
  const [items, setItems] = useState<Listing[]>(initialData?.items || []);
  const [featuredItem, setFeaturedItem] = useState<Listing | null>(
    initialData?.featuredItem || null
  );
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(initialError || null);
  const [page, setPage] = useState(initialData?.nextPage || 2);
  const [hasMore, setHasMore] = useState(initialData?.hasMore ?? true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch initial data (page 1) - only when filters change
  useEffect(() => {
    // Skip initial load if we have initialData and no filters applied
    if (initialData && category === "all" && !searchQuery) {
      return;
    }

    let isMounted = true;

    async function loadInitialData() {
      try {
        setIsLoading(true);
        setError(null);
        setPage(1); // Reset to page 1

        const data = await fetchListings({
          category,
          query: searchQuery,
          page: 1,
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

          setHasMore(data.hasMore);
          if (data.nextPage) {
            setPage(data.nextPage);
          }
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

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [category, searchQuery, initialData]);

  // Load more function
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;

    try {
      setIsLoadingMore(true);

      const data = await fetchListings({
        category,
        query: searchQuery,
        page,
      });

      const validItems = data.items.filter((item: Listing) => item && item.id);

      setItems((prev) => [...prev, ...validItems]);
      setHasMore(data.hasMore);

      if (data.nextPage) {
        setPage(data.nextPage);
      }
    } catch (err) {
      console.error("[Explore] Error loading more:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [category, searchQuery, page, hasMore, isLoadingMore]);

  return {
    items,
    featuredItem,
    isLoading,
    error,
    hasMore,
    isLoadingMore,
    loadMore,
  };
}
