"use client";

import { useState, useEffect } from "react";
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
import AdvancedFilters from "@/components/shared/AdvancedFilters";
import {
  CalendarHeart,
  MapPinCheck,
  ShoppingBag,
  Utensils,
  Wine,
} from "lucide-react";
import { Listing } from "@/server/db/schema";

const categories: CategoryOption[] = [
  { id: "all", label: "All", icon: null },
  { id: "place", label: "Places", icon: <MapPinCheck /> },
  { id: "event", label: "Events", icon: <CalendarHeart /> },
  { id: "food", label: "Foods", icon: <Utensils /> },
  { id: "drink", label: "Drinks", icon: <Wine /> },
  { id: "souvenir", label: "Souvenirs", icon: <ShoppingBag /> },
];

interface ExplorePageClientProps {
  initialData?: {
    items: Listing[];
    trendingItems: Listing[];
    hasMore: boolean;
    nextPage: number | null;
  } | null;
  initialError?: string | null;
}

export default function ExplorePageClient({
  initialData,
  initialError,
}: ExplorePageClientProps) {
  const [category, setCategory] = useState("all");
  const [province, setProvince] = useState("all");
  const [tag, setTag] = useState("all");
  const [rating, setRating] = useState("default");
  const [price, setPrice] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Debug logging for filter changes
  useEffect(() => {
    console.log("[ExplorePageClient] Filter state updated:", {
      category,
      province,
      tag,
      rating,
      price,
    });
  }, [category, province, tag, rating, price]);

  const {
    items,
    trendingItems,
    isLoading,
    error,
    hasMore,
    isLoadingMore,
    loadMore,
  } = useListings({
    category,
    province: province !== "all" ? province : undefined,
    tag: tag !== "all" ? tag : undefined,
    sortByRating: rating !== "default" ? rating : undefined,
    sortByPrice: price !== "default" ? price : undefined,
    searchQuery: debouncedSearch,
    initialData,
    initialError,
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Search Header */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 lg:px-10 scrollbar-hide">
        <div className="max-w-5xl mx-auto flex flex-col gap-4 pb-10">
          {/* Category Pills */}
          <CategoryFilter
            categories={categories}
            selected={category}
            onSelect={setCategory}
            variant="pills"
            className="-mx-4 px-4"
          />

          {/* Advanced Filters */}
          <AdvancedFilters
            province={province}
            tag={tag}
            rating={rating}
            price={price}
            onProvinceChange={setProvince}
            onTagChange={setTag}
            onRatingChange={setRating}
            onPriceChange={setPrice}
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
              trendingItems={trendingItems}
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
