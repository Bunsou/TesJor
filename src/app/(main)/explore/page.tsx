"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ContentItem } from "@/types";
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

  const res = await fetch(`/api/listings?${params}`);
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}

export default function ExplorePage() {
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["listings", category, debouncedSearch],
    queryFn: ({ pageParam }) =>
      fetchListings({
        category,
        query: debouncedSearch,
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  });

  const items =
    data?.pages.flatMap((page) => page.items as ContentItem[]) ?? [];

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
            placeholder="Search places, activities, food..."
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
              {hasNextPage && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isFetchingNextPage ? "Loading more..." : "Load More"}
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
