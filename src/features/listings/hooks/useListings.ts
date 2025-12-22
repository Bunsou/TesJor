import { useState, useEffect, useCallback } from "react";
import { Listing } from "@/server/db/schema";

interface UseListingsParams {
  category: string;
  searchQuery: string;
  initialData?: {
    items: Listing[];
    trendingItems: Listing[];
    hasMore: boolean;
    nextPage: number | null;
  } | null;
  initialError?: string | null;
}

interface UseListingsReturn {
  items: Listing[];
  trendingItems: Listing[];
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

async function fetchTrendingListings(category?: string) {
  const params = new URLSearchParams();
  if (category && category !== "all") {
    params.set("category", category);
  }

  const res = await fetch(`/api/listings/trending?${params}`);

  if (!res.ok) {
    throw new Error("Failed to fetch trending listings");
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
  const [trendingItems, setTrendingItems] = useState<Listing[]>(
    initialData?.trendingItems || []
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

        // Fetch both listings and trending in parallel
        const [listingsData, trendingData] = await Promise.all([
          fetchListings({
            category,
            query: searchQuery,
            page: 1,
          }),
          fetchTrendingListings(category !== "all" ? category : undefined),
        ]);

        if (isMounted) {
          const validItems = listingsData.items.filter(
            (item: Listing) => item && item.id
          );
          const validTrendingItems = trendingData.items.filter(
            (item: Listing) => item && item.id
          );

          setItems(validItems);
          setTrendingItems(validTrendingItems);
          setHasMore(listingsData.hasMore);

          if (listingsData.nextPage) {
            setPage(listingsData.nextPage);
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
    trendingItems,
    isLoading,
    error,
    hasMore,
    isLoadingMore,
    loadMore,
  };
}
