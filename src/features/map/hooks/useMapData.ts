"use client";

import { useState, useEffect } from "react";
import type { Listing } from "@/shared/types";

interface UseMapDataParams {
  initialItems?: Listing[];
  initialError?: string | null;
}

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

export function useMapData({
  initialItems,
  initialError,
}: UseMapDataParams = {}) {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<Listing[]>(initialItems || []);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(!!initialItems);

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
      // Skip initial load if we have initialItems and no filters applied
      if (hasInitialLoad && !useRadiusFilter && selectedCategory === "all") {
        setHasInitialLoad(false); // Only skip once
        return;
      }

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
  }, [userLocation, radius, selectedCategory, useRadiusFilter, hasInitialLoad]);

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

  return {
    userLocation,
    selectedCategory,
    setSelectedCategory,
    radius,
    setRadius,
    useRadiusFilter,
    setUseRadiusFilter,
    searchQuery,
    setSearchQuery,
    items,
    filteredItems,
    markers: allMarkers,
    isLoading,
  };
}
