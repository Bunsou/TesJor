"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleMapContainer } from "@/components/map/GoogleMapContainer";
import { MapFilters } from "@/components/map/MapFilters";

import { ContentItem } from "@/types";

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

  const url = `/api/listings/nearby?${params}`;
  console.log("[Map] Fetching from:", url);

  const res = await fetch(url);
  console.log("[Map] Response status:", res.status, res.ok);

  if (!res.ok) {
    console.error("[Map] Failed to fetch:", res.statusText);
    throw new Error("Failed to fetch nearby items");
  }

  const data = await res.json();
  console.log("[Map] Response data:", {
    success: data.success,
    itemCount: data.data?.items?.length,
    categories: categories,
  });

  // Filter by selected categories
  if (categories.length > 0) {
    const filtered = {
      ...data.data,
      items: data.data.items.filter((item: ContentItem) =>
        categories.includes(item.category)
      ),
    };
    console.log("[Map] Filtered items:", filtered.items.length);
    return filtered;
  }

  return data.data;
}

export default function MapPage() {
  const router = useRouter();
  // Default to Cambodia center, will update if geolocation available
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 13.3622, lng: 103.8597 });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "place",
    "activity",
    "food",
    "drink",
    "souvenir",
  ]);
  const [radius, setRadius] = useState(50); // km

  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
          // Keep default Cambodia center if location access denied
        }
      );
    }
  }, []);

  // Fetch nearby items when location, radius, or categories change
  useEffect(() => {
    if (!userLocation) return;

    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);

        const data = await fetchNearbyItems({
          lat: userLocation.lat,
          lng: userLocation.lng,
          radius,
          categories: selectedCategories,
        });

        if (isMounted) {
          setItems(data.items || []);
          console.log("[Map] Loaded items:", data.items?.length);
        }
      } catch (err) {
        if (isMounted) {
          console.error("[Map] Error:", err);
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
  }, [userLocation, radius, selectedCategories]);

  const markers =
    items
      ?.filter((item) => "lat" in item && "lng" in item && item.lat && item.lng)
      .map((item) => {
        const itemWithLocation = item as ContentItem & {
          lat: string;
          lng: string;
        };
        return {
          id: itemWithLocation.id,
          position: {
            lat: Number(itemWithLocation.lat),
            lng: Number(itemWithLocation.lng),
          },
          title: itemWithLocation.name,
          category: itemWithLocation.category,
        };
      }) ?? [];

  const handleMarkerClick = (id: string) => {
    router.push(`/item/${id}`);
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] md:h-screen">
      <GoogleMapContainer
        center={userLocation || undefined}
        zoom={10}
        markers={markers}
        onMarkerClick={handleMarkerClick}
        className="w-full h-full"
      />

      <MapFilters
        categories={["place", "activity", "food", "drink", "souvenir"]}
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
        radius={radius}
        onRadiusChange={setRadius}
      />

      {/* Loading Overlay */}
      {isLoading && userLocation && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-lg px-4 py-2">
          <p className="text-sm text-foreground-muted">
            Loading nearby items...
          </p>
        </div>
      )}

      {/* Info Badge */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-lg px-4 py-2">
        <p className="text-sm font-medium text-foreground">
          Showing {markers.length} items within {radius} km
        </p>
      </div>
    </div>
  );
}
