"use client";

import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  SearchBar,
  ListingsGrid,
  LoadingState,
  useListings,
} from "@/features/listings";
import {
  CategoryFilter,
  type CategoryOption,
} from "@/components/shared/CategoryFilter";
import {
  CalendarHeart,
  MapPinCheck,
  ShoppingBag,
  Utensils,
  Wine,
} from "lucide-react";

const categories: CategoryOption[] = [
  { id: "all", label: "All", icon: null },
  { id: "place", label: "Places", icon: <MapPinCheck /> },
  { id: "event", label: "Events", icon: <CalendarHeart /> },
  { id: "food", label: "Foods", icon: <Utensils /> },
  { id: "drink", label: "Drinks", icon: <Wine /> },
  { id: "souvenir", label: "Souvenirs", icon: <ShoppingBag /> },
];

export default function ExplorePageClient() {
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const {
    items,
    featuredItem,
    isLoading,
    error,
    hasMore,
    isLoadingMore,
    loadMore,
  } = useListings({
    category,
    searchQuery: debouncedSearch,
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Search Header */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 lg:px-10 scrollbar-hide">
        <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-10">
          {/* Category Pills */}
          <CategoryFilter
            categories={categories}
            selected={category}
            onSelect={setCategory}
            variant="pills"
            className="-mx-4 px-4"
          />

          {/* Loading State */}
          {isLoading && <LoadingState />}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-primary text-2xl">Failed to load listings</p>
            </div>
          )}

          {/* Content */}
          {!isLoading && !error && (
            <ListingsGrid
              featuredItem={featuredItem}
              items={items}
              category={category}
              categoryLabel={
                categories.find((c) => c.id === category)?.label || ""
              }
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={loadMore}
            />
          )}
        </div>
      </div>
    </div>
  );
}
