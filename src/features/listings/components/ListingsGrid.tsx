"use client";

import type { Listing } from "@/shared/types";
import { FeaturedCard } from "./FeaturedCard";
import { PlaceCard } from "./PlaceCard";
import { EmptyState } from "./EmptyState";

interface ListingsGridProps {
  featuredItem: Listing | null;
  items: Listing[];
  category: string;
  categoryLabel: string;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

export function ListingsGrid({
  featuredItem,
  items,
  category,
  categoryLabel,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: ListingsGridProps) {
  const totalCount = items.length + (featuredItem ? 1 : 0);
  const hasNoResults = !featuredItem && items.length === 0;

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
          {category === "all"
            ? "Featured Destinations"
            : `Popular ${categoryLabel}`}
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {totalCount} results
        </span>
      </div>

      {/* Featured Card */}
      {featuredItem && (
        <div className="mb-8">
          <FeaturedCard item={featuredItem} />
        </div>
      )}

      {/* Grid of Cards or Empty State */}
      {hasNoResults ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <PlaceCard
              key={item.id}
              item={item}
              showDistance={item.distance !== undefined}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-6 py-3 bg-[#E07A5F] hover:bg-[#c66a50] text-white rounded-xl font-medium shadow-lg shadow-[#E07A5F]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoadingMore ? "Loading more..." : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
}
