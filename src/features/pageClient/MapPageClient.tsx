"use client";

import { useState, useRef } from "react";
import { Listing } from "@/server/db/schema";
import {
  useMapData,
  GoogleMapContainer,
  MapRef,
  MapSearchBar,
  MapCategoryPills,
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
  const [showRadiusDropdown, setShowRadiusDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Listing | null>(null);

  const {
    userLocation,
    selectedCategory,
    setSelectedCategory,
    radius,
    setRadius,
    useRadiusFilter,
    setUseRadiusFilter,
    searchQuery,
    setSearchQuery,
    filteredItems,
    markers,
    isLoading,
  } = useMapData({ initialItems, initialError });

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

  const handleNearMeClick = () => {
    setUseRadiusFilter(!useRadiusFilter);
    if (!useRadiusFilter) handleRecenter();
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] md:h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <GoogleMapContainer
        ref={mapRef}
        center={userLocation || undefined}
        zoom={useRadiusFilter ? 10 : 7}
        markers={markers}
        onMarkerClick={handleMarkerClick}
        className="w-full h-full"
      />

      <MapSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        useRadiusFilter={useRadiusFilter}
        onToggleRadiusFilter={() => setUseRadiusFilter(!useRadiusFilter)}
        onNearMeClick={handleNearMeClick}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        radius={radius}
        onRadiusChange={setRadius}
        showRadiusDropdown={showRadiusDropdown}
        onToggleRadiusDropdown={() =>
          setShowRadiusDropdown(!showRadiusDropdown)
        }
      />

      <MapCategoryPills
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
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
        useRadiusFilter={useRadiusFilter}
        itemCount={filteredItems.length}
        radius={radius}
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
