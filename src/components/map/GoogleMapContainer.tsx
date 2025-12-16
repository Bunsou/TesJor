"use client";

import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "@/lib/maps";

interface GoogleMapContainerProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    title: string;
    category: string;
  }>;
  onMarkerClick?: (id: string) => void;
  className?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  place: "#3B82F6", // blue
  activity: "#10B981", // green
  food: "#F59E0B", // amber
  drink: "#8B5CF6", // purple
  souvenir: "#EC4899", // pink
};

export function GoogleMapContainer({
  center = { lat: 13.3622, lng: 103.8597 }, // Cambodia center
  zoom = 8,
  markers = [],
  onMarkerClick,
  className = "w-full h-full",
}: GoogleMapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initMap() {
      try {
        if (!mapRef.current) return;

        await loadGoogleMaps();

        if (!mounted) return;

        // Create map
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load Google Maps:", err);
        if (mounted) {
          setError("Failed to load map. Please check your API key.");
          setIsLoading(false);
        }
      }
    }

    initMap();

    return () => {
      mounted = false;
      // Clean up markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers when they change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      const marker = new google.maps.Marker({
        position: markerData.position,
        map: mapInstanceRef.current!,
        title: markerData.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: CATEGORY_COLORS[markerData.category] || "#3B82F6",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          scale: 8,
        },
      });

      if (onMarkerClick) {
        marker.addListener("click", () => {
          onMarkerClick(markerData.id);
        });
      }

      markersRef.current.push(marker);
    });

    // Fit bounds if there are markers
    if (markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach((marker) => {
        bounds.extend(marker.position);
      });
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [markers, onMarkerClick]);

  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100`}
      >
        <div className="text-center p-6">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      <div ref={mapRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-foreground-muted">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
