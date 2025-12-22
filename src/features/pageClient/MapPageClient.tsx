"use client";

import { useState, useRef } from "react";
import { Listing } from "@/server/db/schema";
import {
  useMapData,
  GoogleMapContainer,
  MapRef,
  MapSearchBar,
  MapAdvancedFilters,
  MapControls,
  PlacePreviewCard,
  MapLoadingOverlay,
  MapInfoBadge,
} from "@/features/map";

interface MapPageClientProps {
  initialItems?: Listing[];
  initialError?: string | null;
}

export default function MapPageClient({
  initialItems,
  initialError,
}: MapPageClientProps) {
  const mapRef = useRef<MapRef>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Listing | null>(null);

  const {
    userLocation,
    searchQuery,
    setSearchQuery,
    selectedProvince,
    setSelectedProvince,
    selectedTags,
    setSelectedTags,
    maxDistance,
    setMaxDistance,
    filteredItems,
    markers,
    isLoading,
  } = useMapData({ initialItems, initialError });

  const hasActiveFilters =
    selectedProvince !== "all" ||
    selectedTags.length > 0 ||
    maxDistance !== null;

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

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] md:h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <GoogleMapContainer
        ref={mapRef}
        center={userLocation || undefined}
        zoom={10}
        markers={markers}
        onMarkerClick={handleMarkerClick}
        className="w-full h-full"
      />

      <MapSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFiltersClick={() => setShowFilters(true)}
        hasActiveFilters={hasActiveFilters}
      />

      <MapAdvancedFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        selectedProvince={selectedProvince}
        onProvinceChange={setSelectedProvince}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        maxDistance={maxDistance}
        onDistanceChange={setMaxDistance}
      />

      <MapControls onRecenter={handleRecenter} />

      {selectedItem && (
        <PlacePreviewCard
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      <MapLoadingOverlay isLoading={isLoading} />

      <MapInfoBadge
        useRadiusFilter={hasActiveFilters}
        itemCount={filteredItems.length}
        radius={maxDistance || 0}
      />

      <div className="absolute bottom-2 right-2 text-[10px] text-gray-500 bg-white/50 px-1 rounded pointer-events-none z-10">
        © Mapbox © OpenStreetMap
      </div>

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
