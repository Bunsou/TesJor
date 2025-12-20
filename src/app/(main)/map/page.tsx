"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleMapContainer,
  MapRef,
} from "@/components/map/GoogleMapContainer";
import { MapFilters } from "@/components/map/MapFilters";
import { Navigation } from "lucide-react";

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
      items: data.data.items.filter((item: Listing) =>
        categories.includes(item.category)
      ),
    };
    console.log("[Map] Filtered items:", filtered.items.length);
    return filtered;
  }

  return data.data;
}

async function fetchAllItems({ categories }: { categories: string[] }) {
  const params = new URLSearchParams();

  if (categories.length > 0) {
    params.set("categories", categories.join(","));
  }

  const url = `/api/listings/all${params.toString() ? `?${params}` : ""}`;
  console.log("[Map] Fetching all items from:", url);

  const res = await fetch(url);
  console.log("[Map] Response status:", res.status, res.ok);

  if (!res.ok) {
    console.error("[Map] Failed to fetch:", res.statusText);
    throw new Error("Failed to fetch all items");
  }

  const data = await res.json();
  console.log("[Map] Response data:", {
    itemCount: data.items?.length,
    categories: categories,
  });

  return { items: data.items || [] };
}

export default function MapPage() {
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);

  // Default to Cambodia center, will update if geolocation available
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 13.3622, lng: 103.8597 });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "place",
    "event",
    "food",
    "drink",
    "souvenir",
  ]);
  const [radius, setRadius] = useState(50); // km
  const [useRadiusFilter, setUseRadiusFilter] = useState(false); // Default OFF

  const [items, setItems] = useState<Listing[]>([]);
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

  // Recenter map to user location
  const handleRecenter = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.panTo(userLocation);
      mapRef.current.setZoom(14);
    }
  };

  // Fetch items when location, radius, categories, or radius toggle change
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);

        let data;

        if (useRadiusFilter && userLocation) {
          // Fetch items within radius
          data = await fetchNearbyItems({
            lat: userLocation.lat,
            lng: userLocation.lng,
            radius,
            categories: selectedCategories,
          });
        } else {
          // Fetch all items in Cambodia
          data = await fetchAllItems({
            categories: selectedCategories,
          });
        }

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
  }, [userLocation, radius, selectedCategories, useRadiusFilter]);

  const markers =
    items
      ?.filter((item) => item.lat && item.lng)
      .map((item) => {
        return {
          id: item.id,
          position: {
            lat: Number(item.lat),
            lng: Number(item.lng),
          },
          title: item.title,
          category: item.category,
          imageUrl: item.mainImage ?? undefined,
          description: item.description,
          priceRange: item.priceLevel ?? undefined,
        };
      }) ?? [];

  // Add user location marker
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
    // Don't navigate if it's the user location marker
    if (id === "user-location") return;
    router.push(`/item/${id}`);
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] md:h-screen">
      <GoogleMapContainer
        ref={mapRef}
        center={userLocation || undefined}
        zoom={useRadiusFilter ? 10 : 7}
        markers={allMarkers}
        onMarkerClick={handleMarkerClick}
        className="w-full h-full"
      />

      <MapFilters
        categories={["place", "event", "food", "drink", "souvenir"]}
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
        radius={radius}
        onRadiusChange={setRadius}
        useRadiusFilter={useRadiusFilter}
        onUseRadiusFilterChange={setUseRadiusFilter}
      />

      {/* Recenter Button */}
      <button
        onClick={handleRecenter}
        className="absolute bottom-28 right-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-border z-10"
        title="Recenter to my location"
      >
        <Navigation className="w-5 h-5 text-primary" />
      </button>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-lg px-4 py-2">
          <p className="text-sm text-foreground-muted">Loading items...</p>
        </div>
      )}

      {/* Info Badge */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-lg px-4 py-2">
        <p className="text-sm font-medium text-foreground">
          {useRadiusFilter
            ? `Showing ${markers.length} items within ${radius} km`
            : `Showing ${markers.length} items in Cambodia`}
        </p>
      </div>
    </div>
  );
}
