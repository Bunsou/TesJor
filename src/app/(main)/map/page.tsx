"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  GoogleMapContainer,
  MapRef,
} from "@/components/map/GoogleMapContainer";
import { getDefaultImage } from "@/lib/default-images";

import type { Listing } from "@/shared/types";

async function fetchNearbyItems({
  lat,
  lng,
  radius,
  categories,
}: {
  lat: number;
  lng: number;
  radius: number;
  categories: string[];
}) {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lng: lng.toString(),
    radius: radius.toString(),
    limit: "100",
  });

  const res = await fetch(`/api/listings/nearby?${params}`);
  if (!res.ok) throw new Error("Failed to fetch nearby items");

  const data = await res.json();
  if (categories.length > 0) {
    return {
      ...data.data,
      items: data.data.items.filter((item: Listing) =>
        categories.includes(item.category)
      ),
    };
  }
  return data.data;
}

async function fetchAllItems({ categories }: { categories: string[] }) {
  const params = new URLSearchParams();
  if (categories.length > 0) {
    params.set("categories", categories.join(","));
  }

  const url = `/api/listings/all${params.toString() ? `?${params}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch all items");

  const data = await res.json();
  return { items: data.items || [] };
}

const CATEGORY_OPTIONS = [
  { id: "all", label: "All", icon: "apps" },
  { id: "place", label: "Cultural", icon: "temple_buddhist" },
  { id: "event", label: "Events", icon: "celebration" },
  { id: "food", label: "Food", icon: "restaurant" },
  { id: "drink", label: "Drinks", icon: "local_cafe" },
  { id: "souvenir", label: "Shops", icon: "storefront" },
];

const RADIUS_OPTIONS = [5, 10, 25, 50, 100];

const getCategoryStyle = (category: string) => {
  switch (category?.toLowerCase()) {
    case "place":
      return {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-600 dark:text-orange-400",
      };
    case "event":
      return {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-600 dark:text-green-400",
      };
    case "food":
      return {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-600 dark:text-amber-400",
      };
    case "drink":
      return {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-600 dark:text-purple-400",
      };
    case "souvenir":
      return {
        bg: "bg-pink-100 dark:bg-pink-900/30",
        text: "text-pink-600 dark:text-pink-400",
      };
    default:
      return {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-600 dark:text-gray-400",
      };
  }
};

export default function MapPage() {
  const mapRef = useRef<MapRef>(null);

  // State
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 13.3622,
    lng: 103.8597,
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [radius, setRadius] = useState(10);
  const [useRadiusFilter, setUseRadiusFilter] = useState(false);
  const [showRadiusDropdown, setShowRadiusDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [items, setItems] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Listing | null>(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Fetch items
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        const categories = selectedCategory === "all" ? [] : [selectedCategory];

        let data;
        if (useRadiusFilter && userLocation) {
          data = await fetchNearbyItems({
            lat: userLocation.lat,
            lng: userLocation.lng,
            radius,
            categories,
          });
        } else {
          data = await fetchAllItems({ categories });
        }

        if (isMounted) {
          setItems(data.items || []);
        }
      } catch (err) {
        console.error("[Map] Error:", err);
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
  }, [userLocation, radius, selectedCategory, useRadiusFilter]);

  // Filter items by search
  const filteredItems = items.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleKh?.includes(searchQuery)
  );

  // Create markers
  const markers = filteredItems
    .filter((item) => item.lat && item.lng)
    .map((item) => ({
      id: item.id,
      position: { lat: Number(item.lat), lng: Number(item.lng) },
      title: item.title,
      category: item.category,
      imageUrl: item.mainImage ?? undefined,
      description: item.description,
      priceRange: item.priceLevel ?? undefined,
    }));

  const allMarkers = userLocation
    ? [
        {
          id: "user-location",
          position: userLocation,
          title: "You are here",
          category: "user",
          isUserLocation: true,
        },
        ...markers,
      ]
    : markers;

  const handleMarkerClick = (id: string) => {
    if (id === "user-location") return;
    const item = filteredItems.find((i) => i.id === id);
    if (item) {
      setSelectedItem(item);
    }
  };

  const handleRecenter = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.panTo(userLocation);
      mapRef.current.setZoom(14);
    }
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      // Get current zoom and increment
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      // Get current zoom and decrement
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] md:h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Map Container */}
      <GoogleMapContainer
        ref={mapRef}
        center={userLocation || undefined}
        zoom={useRadiusFilter ? 10 : 7}
        markers={allMarkers}
        onMarkerClick={handleMarkerClick}
        className="w-full h-full"
      />

      {/* Top Search & Filter Bar */}
      <div className="absolute top-4 md:top-6 left-4 md:left-6 right-4 md:right-6 flex justify-center z-20 pointer-events-none">
        <div className="flex gap-2 md:gap-3 pointer-events-auto bg-white/90 dark:bg-[#2A201D]/90 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-x-auto hide-scrollbar max-w-full">
          {/* Search Input */}
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[#926154] text-xl">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places..."
              className="pl-10 pr-4 py-2 bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-32 md:w-48 text-[#1a110f] dark:text-[#f2eae8] placeholder-[#926154]"
            />
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden md:block"></div>
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setUseRadiusFilter(!useRadiusFilter)}
            className={`px-3 md:px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap ${
              useRadiusFilter
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-[#1a110f] dark:text-[#f2eae8]"
            }`}
          >
            <span className="material-symbols-outlined text-lg">tune</span>
            <span className="hidden md:inline">Filters</span>
          </button>

          {/* Near Me Toggle */}
          <button
            onClick={() => {
              setUseRadiusFilter(!useRadiusFilter);
              if (!useRadiusFilter) handleRecenter();
            }}
            className={`px-3 md:px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
              useRadiusFilter
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-[#1a110f] dark:text-[#f2eae8]"
            }`}
          >
            Near Me
          </button>

          {/* Category Pills - Hidden on mobile */}
          <div className="hidden lg:flex gap-2">
            {CATEGORY_OPTIONS.slice(1, 4).map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.id ? "all" : cat.id
                  )
                }
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-[#1a110f] dark:text-[#f2eae8]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Radius Dropdown */}
          {useRadiusFilter && (
            <div className="relative">
              <button
                onClick={() => setShowRadiusDropdown(!showRadiusDropdown)}
                className="px-3 md:px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-[#1a110f] dark:text-[#f2eae8] text-sm font-medium transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                <span>Radius: {radius}km</span>
                <span className="material-symbols-outlined text-base">
                  expand_more
                </span>
              </button>

              {showRadiusDropdown && (
                <div className="absolute top-full mt-2 right-0 bg-white dark:bg-[#2A201D] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  {RADIUS_OPTIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRadius(r);
                        setShowRadiusDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${
                        radius === r
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-[#1a110f] dark:text-[#f2eae8]"
                      }`}
                    >
                      {r} km
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category Pills - Mobile Bottom */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center z-20 pointer-events-none md:hidden">
        <div className="flex gap-2 pointer-events-auto bg-white/90 dark:bg-[#2A201D]/90 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-x-auto hide-scrollbar mx-4">
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === cat.id ? "all" : cat.id
                )
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-white/5 text-[#1a110f] dark:text-[#f2eae8]"
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {cat.icon}
              </span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Controls - Right Side */}
      <div className="absolute bottom-28 md:bottom-8 right-4 md:right-8 flex flex-col gap-3 z-20">
        {/* My Location Button */}
        <button
          onClick={handleRecenter}
          className="w-12 h-12 rounded-xl bg-white dark:bg-[#2A201D] text-[#1a110f] dark:text-[#f2eae8] shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-gray-200 dark:border-gray-700"
          title="Recenter to my location"
        >
          <span className="material-symbols-outlined">my_location</span>
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-xl bg-white dark:bg-[#2A201D] shadow-lg overflow-hidden divide-y divide-gray-100 dark:divide-gray-800 border border-gray-200 dark:border-gray-700">
          <button
            onClick={handleZoomIn}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-[#1a110f] dark:text-[#f2eae8]"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
          <button
            onClick={handleZoomOut}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-[#1a110f] dark:text-[#f2eae8]"
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
        </div>
      </div>

      {/* Selected Place Preview Card */}
      {selectedItem && (
        <div className="absolute bottom-28 md:bottom-8 left-4 md:left-8 z-30 w-[calc(100%-8rem)] md:w-[380px] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white dark:bg-[#2A201D] rounded-2xl shadow-2xl p-4 flex gap-4 border border-gray-200 dark:border-gray-700">
            {/* Image */}
            <div className="w-24 h-24 shrink-0 rounded-xl bg-gray-200 overflow-hidden relative group cursor-pointer">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `url('${
                    selectedItem.mainImage ||
                    getDefaultImage(selectedItem.category)
                  }')`,
                }}
              />
              {/* Rating Badge */}
              {selectedItem.avgRating && (
                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-white/90 dark:bg-black/60 backdrop-blur-sm rounded-md flex items-center gap-0.5 shadow-sm">
                  <span className="text-[10px] font-bold text-[#1a110f] dark:text-[#f2eae8]">
                    {Number(selectedItem.avgRating).toFixed(1)}
                  </span>
                  <span
                    className="material-symbols-outlined text-[10px] text-[#1a110f] dark:text-[#f2eae8]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold text-lg text-[#1a110f] dark:text-[#f2eae8] leading-tight truncate">
                  {selectedItem.title}
                </h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-[#926154] hover:text-primary transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-xl">
                    close
                  </span>
                </button>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 text-[#926154] dark:text-[#d6c1bd] text-xs">
                <span className="material-symbols-outlined text-sm">
                  location_on
                </span>
                <span className="truncate">
                  {selectedItem.addressText || "Cambodia"}
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-2">
                {/* Category Tags */}
                <div className="flex gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-lg ${
                      getCategoryStyle(selectedItem.category).bg
                    } ${
                      getCategoryStyle(selectedItem.category).text
                    } text-[10px] font-semibold capitalize`}
                  >
                    {selectedItem.category}
                  </span>
                </div>

                {/* View Details Button */}
                <Link
                  href={`/explore/${selectedItem.id}`}
                  className="w-8 h-8 rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center shadow-lg shadow-primary/30 transition-all hover:scale-105"
                >
                  <span className="material-symbols-outlined text-lg">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white dark:bg-[#2A201D] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg px-4 py-2 z-30">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <p className="text-sm text-[#926154] dark:text-[#d6c1bd]">
              Loading items...
            </p>
          </div>
        </div>
      )}

      {/* Info Badge - Bottom Center */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-[#2A201D] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-4 py-2 z-10 hidden md:block">
        <p className="text-sm font-medium text-[#1a110f] dark:text-[#f2eae8]">
          {useRadiusFilter
            ? `Showing ${filteredItems.length} items within ${radius} km`
            : `Showing ${filteredItems.length} items in Cambodia`}
        </p>
      </div>

      {/* Map Attribution */}
      <div className="absolute bottom-2 right-2 text-[10px] text-gray-500 bg-white/50 px-1 rounded pointer-events-none z-10">
        © Mapbox © OpenStreetMap
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
