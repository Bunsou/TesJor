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
  {
    id: "place",
    label: "Places",
    icon: <MapPinCheck className="h-4 w-4 md:h-5 md:w-5" />,
  },
  {
    id: "event",
    label: "Events",
    icon: <CalendarHeart className="h-4 w-4 md:h-5 md:w-5" />,
  },
  {
    id: "food",
    label: "Food & Drink",
    icon: <Utensils className="h-4 w-4 md:h-5 md:w-5" />,
  },
  {
    id: "souvenir",
    label: "Souvenirs",
    icon: <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />,
  },
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
      <div className="px-3 md:px-4 pt-3 md:pt-4 pb-2 md:pb-3 bg-background sticky top-0 z-10">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-3 md:px-4 pb-20 md:pb-6 lg:px-10 scrollbar-hide">
        <div className="max-w-5xl mx-auto flex flex-col gap-3 md:gap-4">
          {/* Category Pills */}
          <CategoryFilter
            categories={categories}
            selected={category}
            onSelect={setCategory}
            variant="pills"
            className=""
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
