"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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

  const res = await fetch(`/api/listings/nearby?${params}`);
  if (!res.ok) throw new Error("Failed to fetch nearby items");
  const data = await res.json();

  // Filter by selected categories
  if (categories.length > 0) {
    return {
      ...data,
      items: data.items.filter((item: ContentItem) =>
        categories.includes(item.category)
      ),
    };
  }

  return data;
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

  const { data, isLoading } = useQuery({
    queryKey: [
      "nearby-items",
      userLocation?.lat,
      userLocation?.lng,
      radius,
      selectedCategories,
    ],
    queryFn: () =>
      fetchNearbyItems({
        lat: userLocation!.lat,
        lng: userLocation!.lng,
        radius,
        categories: selectedCategories,
      }),
    enabled: !!userLocation,
  });

  const markers =
    data?.items
      ?.filter(
        (item: ContentItem) =>
          "lat" in item && "lng" in item && item.lat && item.lng
      )
      .map((item: ContentItem & { lat: string; lng: string }) => ({
        id: item.id,
        position: {
          lat: Number(item.lat),
          lng: Number(item.lng),
        },
        title: item.name,
        category: item.category,
      })) ?? [];

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
