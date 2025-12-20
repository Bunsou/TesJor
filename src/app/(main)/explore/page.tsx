"use client";

import { useState, useEffect } from "react";
import type { Listing } from "@/shared/types";
import { PlaceCard } from "@/components/shared/PlaceCard";
import { CategoryFilter } from "@/components/shared/CategoryFilter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

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
  console.log("[Explore] Fetching from:", url);

  const res = await fetch(url);
  console.log("[Explore] Response status:", res.status, res.ok);

  if (!res.ok) {
    console.error("[Explore] Failed to fetch:", res.statusText);
    throw new Error("Failed to fetch listings");
  }

  const json = await res.json();
  console.log("[Explore] Response data:", {
    success: json.success,
    itemCount: json.data?.items?.length,
    items: json.data?.items,
    nextCursor: json.data?.nextCursor,
  });

  return json.data;
}

export default function ExplorePage() {
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [items, setItems] = useState<Listing[]>([]);
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
          query: debouncedSearch,
        });

        if (isMounted) {
          setItems(data.items.filter((item: Listing) => item && item.id));
          setNextCursor(data.nextCursor);
          console.log("[Explore] Loaded items:", data.items.length);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load listings"
          );
          console.error("[Explore] Error:", err);
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
  }, [category, debouncedSearch]);

  // Load more function
  const loadMore = async () => {
    if (!nextCursor || isLoadingMore) return;

    try {
      setIsLoadingMore(true);

      const data = await fetchListings({
        category,
        query: debouncedSearch,
        cursor: nextCursor,
      });

      setItems((prev) => [
        ...prev,
        ...data.items.filter((item: Listing) => item && item.id),
      ]);
      setNextCursor(data.nextCursor);
      console.log("[Explore] Loaded more items:", data.items.length);
    } catch (err) {
      console.error("[Explore] Error loading more:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Explore Cambodia
        </h1>
        <p className="text-foreground-muted">
          Discover hidden gems and authentic experiences
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
          <Input
            type="text"
            placeholder="Search places, events, food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <CategoryFilter
          selected={category === "all" ? null : category}
          onSelect={(cat) => setCategory(cat || "all")}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-foreground-muted">Loading...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load listings</p>
        </div>
      )}

      {/* Items Grid */}
      {!isLoading && !error && (
        <>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground-muted text-lg">
                No items found. Try a different search or category.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <PlaceCard key={item.id} item={item} />
                ))}
              </div>

              {/* Load More Button */}
              {nextCursor && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoadingMore ? "Loading more..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
