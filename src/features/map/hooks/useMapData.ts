"use client";

import { useState, useEffect } from "react";
import { Listing } from "@/server/db/schema";

interface UseMapDataParams {
  initialItems?: Listing[];
  initialError?: string | null;
}

async function fetchNearbyItems({
  lat,
  lng,
  radius,
}: {
  lat: number;
  lng: number;
  radius: number;
}) {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lng: lng.toString(),
    radius: radius.toString(),
    limit: "100",
    category: "place", // Only fetch places
  });

  const res = await fetch(`/api/listings/nearby?${params}`);
  if (!res.ok) throw new Error("Failed to fetch nearby items");

  const response = await res.json();
  console.log("[fetchNearbyItems] Response:", response);
  // Filter for places only
  return {
    items: (response.data?.items || []).filter(
      (item: Listing) => item.category === "place"
    ),
  };
}

async function fetchAllItems() {
  const params = new URLSearchParams({
    category: "place", // Only fetch places
  });

  const url = `/api/listings/all?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch all items");

  console.log("[fetchAllItems] URL:", url);
  const response = await res.json();
  console.log("[fetchAllItems] Response:", response);
  // Filter for places only
  return {
    items: (response.data?.items || []).filter(
      (item: Listing) => item.category === "place"
    ),
  };
}

export function useMapData({
  initialItems,
  initialError,
}: UseMapDataParams = {}) {
  console.log(
    "[useMapData] Initialized with initialItems:",
    initialItems?.length || 0
  );

  // State
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 13.3622,
    lng: 103.8597,
  });
  const [selectedCategory] = useState("place"); // Only places
  const [radius, setRadius] = useState(10);
  const [useRadiusFilter, setUseRadiusFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  // Filter initialItems to only places
  const [items, setItems] = useState<Listing[]>(
    (initialItems || []).filter((item) => item.category === "place")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(
    !!initialItems && initialItems.length > 0
  );

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
      console.log(
        "[loadData] hasInitialLoad:",
        hasInitialLoad,
        "useRadiusFilter:",
        useRadiusFilter
      );

      // Skip initial load if we have initialItems and no filters applied
      if (
        hasInitialLoad &&
        !useRadiusFilter &&
        selectedCategory === "place" &&
        selectedProvince === "all"
      ) {
        console.log("[loadData] Skipping fetch, using initialItems");
        setHasInitialLoad(false); // Only skip once
        return;
      }

      console.log("[loadData] Fetching data...");
      try {
        setIsLoading(true);

        let data;
        if (useRadiusFilter && userLocation) {
          console.log("[loadData] Using fetchNearbyItems");
          data = await fetchNearbyItems({
            lat: userLocation.lat,
            lng: userLocation.lng,
            radius,
          });
        } else {
          console.log("[loadData] Using fetchAllItems");
          data = await fetchAllItems();
        }

        console.log("[loadData] Fetched items:", data.items?.length || 0);
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
  }, [
    userLocation,
    radius,
    selectedCategory,
    useRadiusFilter,
    hasInitialLoad,
    selectedProvince,
  ]);

  // Filter items by search, province, tags, and distance
  const filteredItems = items.filter((item) => {
    // Search filter
    const matchesSearch =
      !searchQuery ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleKh?.includes(searchQuery);

    // Province filter
    const matchesProvince =
      selectedProvince === "all" || item.province === selectedProvince;

    // Tags filter
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => item.tags?.includes(tag));

    // Distance filter (calculate distance if user location is available)
    let matchesDistance = true;
    if (maxDistance !== null && userLocation && item.lat && item.lng) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        Number(item.lat),
        Number(item.lng)
      );
      matchesDistance = distance <= maxDistance;
    }

    return matchesSearch && matchesProvince && matchesTags && matchesDistance;
  });

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

  console.log("[useMapData] Items count:", items.length);
  console.log("[useMapData] Filtered items count:", filteredItems.length);
  console.log("[useMapData] Markers count:", markers.length);

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
    radius,
    setRadius,
    useRadiusFilter,
    setUseRadiusFilter,
    searchQuery,
    setSearchQuery,
    selectedProvince,
    setSelectedProvince,
    selectedTags,
    setSelectedTags,
    maxDistance,
    setMaxDistance,
    items,
    filteredItems,
    markers: allMarkers,
    isLoading,
  };
}

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
