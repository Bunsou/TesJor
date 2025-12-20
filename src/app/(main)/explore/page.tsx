"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/shared/types";
import { useDebounce } from "@/hooks/useDebounce";
import { getDefaultImage } from "@/lib/default-images";
import {
  BookCheck,
  CalendarHeart,
  Heart,
  MapPinCheck,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Utensils,
  Wine,
} from "lucide-react";

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

const categories = [
  { id: "all", label: "All", icon: null },
  { id: "place", label: "Places", icon: <MapPinCheck /> },
  { id: "activity", label: "Activities", icon: <CalendarHeart /> },
  { id: "food", label: "Foods", icon: <Utensils /> },
  { id: "drink", label: "Drinks", icon: <Wine /> },
  { id: "souvenir", label: "Souvenirs", icon: <ShoppingBag /> },
];

function getCategoryStyle(category: string) {
  const styles: Record<string, string> = {
    place:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    activity:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    food: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    drink:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    souvenir:
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  };
  return styles[category] || "bg-gray-100 text-gray-700";
}

interface PlaceCardNewProps {
  item: Listing;
  isBookmarked?: boolean;
  isVisited?: boolean;
  onBookmark?: () => void;
  onVisit?: () => void;
}

function PlaceCardNew({
  item,
  isBookmarked = false,
  isVisited = false,
}: PlaceCardNewProps) {
  const [imageError, setImageError] = useState(false);
  const imageSrc =
    imageError || !item.mainImage
      ? getDefaultImage(item.category)
      : item.mainImage;

  return (
    <Link href={`/explore/${item.id}`}>
      <div className="flex flex-col bg-white dark:bg-[#2C211F] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageSrc}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            <button
              className={`p-2 rounded-full backdrop-blur-sm transition-all shadow-sm ${
                isVisited
                  ? "bg-[#2D6A4F] text-white"
                  : "bg-white/80 dark:bg-black/50 text-gray-700 dark:text-white hover:bg-[#2D6A4F] hover:text-white"
              }`}
              title={isVisited ? "Visited" : "Mark as Visited"}
              onClick={(e) => e.preventDefault()}
            >
              <span
                className={`material-symbols-outlined text-xl ${
                  isVisited ? "icon-filled" : ""
                }`}
              >
                <BookCheck />
              </span>
            </button>
            <button
              className={`p-2 rounded-full backdrop-blur-sm transition-all shadow-sm ${
                isBookmarked
                  ? "bg-white dark:bg-black/80 text-red-500"
                  : "bg-white/80 dark:bg-black/50 text-gray-700 dark:text-white hover:text-red-500"
              }`}
              title={isBookmarked ? "Saved" : "Save to Favorites"}
              onClick={(e) => e.preventDefault()}
            >
              <span
                className={`material-symbols-outlined text-xl ${
                  isBookmarked ? "icon-filled" : ""
                }`}
              >
                <Heart />
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
              {item.title}
            </h3>
            <span
              className={`shrink-0 px-2 py-1 rounded-lg text-xs font-bold capitalize ${getCategoryStyle(
                item.category
              )}`}
            >
              {item.category}
            </span>
          </div>

          {item.titleKh && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-khmer">
              {item.titleKh}
            </p>
          )}

          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {item.description}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col">
              {item.distance !== undefined && (
                <>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    Distance
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.distance.toFixed(1)}km away
                  </span>
                </>
              )}
              {item.priceLevel && (
                <span className="text-sm font-medium text-[#E07A5F]">
                  {item.priceLevel}
                </span>
              )}
            </div>
            <button
              className="bg-[#E07A5F] hover:bg-[#c66a50] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-[#E07A5F]/20"
              onClick={(e) => e.preventDefault()}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeaturedCard({ item }: { item: Listing }) {
  const [imageError, setImageError] = useState(false);
  const imageSrc =
    imageError || !item.mainImage
      ? getDefaultImage(item.category)
      : item.mainImage;

  return (
    <Link href={`/explore/${item.id}`}>
      <div className="w-full rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-[#2C211F] group cursor-pointer">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Trending badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-primary/80 backdrop-blur-sm text-white text-xs font-bold border border-primary/30">
              Trending
            </span>
          </div>

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-[#2D6A4F] hover:text-white transition-all border border-white/30"
              title="Mark as Visited"
              onClick={(e) => e.preventDefault()}
            >
              <span className="material-symbols-outlined text-xl">
                <BookCheck />
              </span>
            </button>
            <button
              className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-all border border-white/30"
              title="Save to Favorites"
              onClick={(e) => e.preventDefault()}
            >
              <span className="material-symbols-outlined text-xl">
                <Heart />
              </span>
            </button>
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <h3 className="font-bold text-3xl text-white mb-2">{item.title}</h3>
            <div className="flex items-center gap-4 text-white/90">
              {item.addressText && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#E07A5F] text-sm">
                    location_on
                  </span>
                  <span className="text-sm font-medium">
                    {item.addressText}
                  </span>
                </div>
              )}
              {item.avgRating && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-yellow-400 text-sm icon-filled">
                    star
                  </span>
                  <span className="text-sm font-medium">
                    {item.avgRating} ({item.views} views)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ExplorePage() {
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

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
          query: debouncedSearch,
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
    } catch (err) {
      console.error("[Explore] Error loading more:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Search Header */}
      <header className="w-full px-4 py-6 lg:px-10 lg:pt-8 bg-background dark:bg-[#201512] z-10 sticky top-0">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex w-full items-center rounded-2xl h-14 bg-white dark:bg-[#2C211F] shadow-sm border border-transparent focus-within:border-[#E07A5F]/50 focus-within:ring-4 focus-within:ring-[#E07A5F]/10 transition-all">
            <div className="flex items-center justify-center pl-5 pr-3">
              <span className="material-symbols-outlined text-[#E07A5F] text-2xl">
                <Search />
              </span>
            </div>
            <input
              className="w-full bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-400 text-base font-medium h-full outline-none"
              placeholder="Where do you want to go in Cambodia?"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="mr-2 p-2 rounded-xl bg-[#2D6A4F]/10 hover:bg-[#2D6A4F]/20 text-[#2D6A4F] transition-colors">
              <span className="material-symbols-outlined text-xl">
                <SlidersHorizontal />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 lg:px-10 scrollbar-hide">
        <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-10">
          {/* Category Pills */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 transition-all ${
                  category === cat.id
                    ? "bg-[#E07A5F] text-white shadow-md shadow-[#E07A5F]/20 hover:scale-105 active:scale-95"
                    : "bg-white dark:bg-[#2C211F] text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {cat.icon && (
                  <span
                    className={`material-symbols-outlined text-lg ${
                      category === cat.id ? "text-white" : "text-[#2D6A4F]"
                    }`}
                  >
                    {cat.icon}
                  </span>
                )}
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-4 text-gray-500">Loading...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">Failed to load listings</p>
            </div>
          )}

          {/* Content */}
          {!isLoading && !error && (
            <section>
              {/* Section Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
                  {category === "all"
                    ? "Featured Destinations"
                    : `Popular ${
                        categories.find((c) => c.id === category)?.label
                      }`}
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {items.length + (featuredItem ? 1 : 0)} results
                </span>
              </div>

              {/* Featured Card */}
              {featuredItem && (
                <div className="mb-8">
                  <FeaturedCard item={featuredItem} />
                </div>
              )}

              {/* Grid of Cards */}
              {items.length === 0 && !featuredItem ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No items found. Try a different search or category.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map((item) => (
                    <PlaceCardNew key={item.id} item={item} />
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {nextCursor && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="px-6 py-3 bg-[#E07A5F] hover:bg-[#c66a50] text-white rounded-xl font-medium shadow-lg shadow-[#E07A5F]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoadingMore ? "Loading more..." : "Load More"}
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
