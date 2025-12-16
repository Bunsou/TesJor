"use client";

import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { loadGoogleMaps } from "@/lib/maps";

interface GoogleMapContainerProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    title: string;
    category: string;
    imageUrl?: string;
    description?: string;
    priceRange?: string;
    rating?: number;
    isUserLocation?: boolean;
  }>;
  onMarkerClick?: (id: string) => void;
  className?: string;
}

export interface MapRef {
  panTo: (location: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  place: "#EF4444", // red
  activity: "#10B981", // green
  food: "#F59E0B", // amber
  drink: "#8B5CF6", // purple
  souvenir: "#EC4899", // pink
  user: "#3B82F6", // blue for user location
};

function createLocationPinMarker(category: string): HTMLElement {
  const div = document.createElement("div");
  div.style.position = "relative";
  div.style.width = "40px";
  div.style.height = "50px";
  div.style.cursor = "pointer";
  div.style.transition = "transform 0.2s";

  div.onmouseenter = () => {
    div.style.transform = "scale(1.1)";
  };

  div.onmouseleave = () => {
    div.style.transform = "scale(1)";
  };

  // Create SVG pin
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 36");
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.3))";

  const color = CATEGORY_COLORS[category] || "#EF4444";

  // Pin shape path
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M12 0C7.589 0 4 3.589 4 8c0 7 8 16 8 16s8-9 8-16c0-4.411-3.589-8-8-8z"
  );
  path.setAttribute("fill", color);
  path.setAttribute("stroke", "#fff");
  path.setAttribute("stroke-width", "1.5");

  // Inner circle (slightly larger for better icon visibility)
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "8");
  circle.setAttribute("r", "4");
  circle.setAttribute("fill", "#fff");

  svg.appendChild(path);
  svg.appendChild(circle);

  // Add category-specific icon
  const categoryIcons: Record<string, string> = {
    place:
      '<g transform="translate(9.5, 5.5)"><path d="M2.5 1h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1ZM1 2.5h1M1 4h1M1 5.5h1M4.5 2.5h1M4.5 4h1M4.5 5.5h1" stroke="#374151" stroke-width="0.5" fill="none"/></g>',
    activity:
      '<g transform="translate(9.5, 5.5)"><circle cx="2.5" cy="1.5" r="0.8" fill="#374151"/><path d="M2.5 2.5L2 4.5M2.5 2.5L3 4.5M2 4.5L1 6.5M3 4.5L4 6.5" stroke="#374151" stroke-width="0.5" stroke-linecap="round"/></g>',
    food: '<g transform="translate(10, 5.5)"><path d="M0.5 1v2c0 0.3 0.2 0.5 0.5 0.5s0.5-0.2 0.5-0.5V1M1.5 1v2c0 0.3 0.2 0.5 0.5 0.5s0.5-0.2 0.5-0.5V1M1 1v5.5M3.5 1.5v1c0 0.3 0.2 0.5 0.5 0.5h0.2M4 3.5v3" stroke="#374151" stroke-width="0.5" stroke-linecap="round"/></g>',
    drink:
      '<g transform="translate(9.5, 5.5)"><path d="M0.5 2h4v2.5c0 0.8-0.7 1.5-1.5 1.5h-1C1.2 6 0.5 5.3 0.5 4.5V2ZM4.5 3h0.5c0.6 0 1 0.4 1 1s-0.4 1-1 1H4.5" stroke="#374151" stroke-width="0.5" fill="none"/><line x1="1.5" y1="0.5" x2="1.5" y2="2" stroke="#374151" stroke-width="0.4"/><line x1="2.5" y1="0.5" x2="2.5" y2="2" stroke="#374151" stroke-width="0.4"/><line x1="3.5" y1="0.5" x2="3.5" y2="2" stroke="#374151" stroke-width="0.4"/></g>',
    souvenir:
      '<g transform="translate(9.5, 5.5)"><path d="M1 1.5L0.5 2v4c0 0.3 0.2 0.5 0.5 0.5h4c0.3 0 0.5-0.2 0.5-0.5V2L5 1.5H1ZM0.5 2h5M3.5 3.5c0 0.8-0.7 1.5-1 1.5s-1-0.7-1-1.5" stroke="#374151" stroke-width="0.5" fill="none"/></g>',
  };

  const iconSvg = categoryIcons[category];
  if (iconSvg) {
    const iconGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    iconGroup.innerHTML = iconSvg;
    svg.appendChild(iconGroup);
  }

  div.appendChild(svg);

  return div;
}

function createUserLocationMarker(): HTMLElement {
  const div = document.createElement("div");
  div.style.width = "24px";
  div.style.height = "24px";
  div.style.borderRadius = "50%";
  div.style.backgroundColor = "#3B82F6";
  div.style.border = "4px solid #fff";
  div.style.boxShadow = "0 2px 8px rgba(0,0,0,0.4)";
  div.style.cursor = "pointer";

  const pulse = document.createElement("div");
  pulse.style.position = "absolute";
  pulse.style.top = "-8px";
  pulse.style.left = "-8px";
  pulse.style.width = "40px";
  pulse.style.height = "40px";
  pulse.style.borderRadius = "50%";
  pulse.style.backgroundColor = "rgba(59, 130, 246, 0.3)";
  pulse.style.animation = "pulse 2s infinite";

  // Add animation keyframes
  const style = document.createElement("style");
  style.textContent = `
    @keyframes pulse {
      0% { transform: scale(0.8); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.5; }
      100% { transform: scale(0.8); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  div.appendChild(pulse);
  return div;
}

function createInfoWindowContent(
  markerData: NonNullable<GoogleMapContainerProps["markers"]>[number]
): string {
  if (markerData.isUserLocation) {
    return `
      <div style="padding: 12px; min-width: 200px;">
        <h3 style="font-weight: 600; font-size: 16px; margin-bottom: 4px; color: #1f2937;">
          You are here
        </h3>
        <p style="font-size: 14px; color: #6b7280;">
          Your current location
        </p>
      </div>
    `;
  }

  const stars = markerData.rating
    ? Array.from({ length: 5 })
        .map((_, i) => (i < Math.floor(markerData.rating!) ? "★" : "☆"))
        .join("")
    : "";

  return `
    <div style="padding: 12px; min-width: 250px; max-width: 300px;">
      ${
        markerData.imageUrl
          ? `<img src="${markerData.imageUrl}" 
               style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;"
               onerror="this.src='/default-image/placeholder.png'" />`
          : ""
      }
      <h3 style="font-weight: 600; font-size: 18px; margin-bottom: 8px; color: #1f2937;">
        ${markerData.title}
      </h3>
      ${
        stars
          ? `<div style="color: #F59E0B; font-size: 14px; margin-bottom: 8px;">${stars} ${markerData.rating?.toFixed(
              1
            )}</div>`
          : ""
      }
      ${
        markerData.description
          ? `<p style="font-size: 14px; color: #6b7280; margin-bottom: 8px; line-height: 1.5;">${markerData.description}</p>`
          : ""
      }
      ${
        markerData.priceRange
          ? `<div style="display: flex; align-items: center; gap: 8px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
               <span style="font-size: 14px; color: #6b7280;">Price:</span>
               <span style="font-weight: 600; color: #10B981;">${markerData.priceRange}</span>
             </div>`
          : ""
      }
      <div style="margin-top: 12px;">
        <a href="/item/${markerData.id}" 
           style="display: inline-block; padding: 8px 16px; background: #3B82F6; color: white; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
          View Details →
        </a>
      </div>
    </div>
  `;
}

export const GoogleMapContainer = forwardRef<MapRef, GoogleMapContainerProps>(
  function GoogleMapContainer(
    {
      center = { lat: 13.3622, lng: 103.8597 }, // Cambodia center
      zoom = 8,
      markers = [],
      onMarkerClick,
      className = "w-full h-full",
    },
    ref
  ) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<
      (google.maps.marker.AdvancedMarkerElement | google.maps.Marker)[]
    >([]);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Expose map control methods
    useImperativeHandle(ref, () => ({
      panTo: (location: { lat: number; lng: number }) => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(location);
        }
      },
      setZoom: (zoom: number) => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setZoom(zoom);
        }
      },
    }));

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
            mapId: "DEMO_MAP_ID", // Required for Advanced Markers
          });

          // Create info window
          infoWindowRef.current = new google.maps.InfoWindow();

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
        markersRef.current.forEach((marker) => {
          if ("map" in marker) {
            marker.map = null;
          }
        });
        markersRef.current = [];
        infoWindowRef.current?.close();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update markers when they change
    useEffect(() => {
      if (!mapInstanceRef.current) return;

      // Clear existing markers
      markersRef.current.forEach((marker) => {
        if ("map" in marker) {
          marker.map = null;
        }
      });
      markersRef.current = [];

      // Add new markers
      markers.forEach((markerData) => {
        // Create marker content based on type
        const content = markerData.isUserLocation
          ? createUserLocationMarker()
          : createLocationPinMarker(markerData.category);

        // Try to use Advanced Markers (new API)
        try {
          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: markerData.position,
            map: mapInstanceRef.current!,
            title: markerData.title,
            content,
          });

          // Add click listener to show info window
          marker.addListener("click", () => {
            if (infoWindowRef.current && mapInstanceRef.current) {
              const infoContent = createInfoWindowContent(markerData);
              infoWindowRef.current.setContent(infoContent);
              infoWindowRef.current.open(mapInstanceRef.current, marker);
            }

            // Call the parent's onMarkerClick if provided
            if (onMarkerClick && !markerData.isUserLocation) {
              // Don't navigate immediately, let user interact with info window
              // onMarkerClick(markerData.id);
            }
          });

          markersRef.current.push(marker);
        } catch (error) {
          // Fallback to regular markers if Advanced Markers not available
          console.warn(
            "Advanced Markers not available, using regular markers",
            error
          );
          const fallbackMarker = new google.maps.Marker({
            position: markerData.position,
            map: mapInstanceRef.current!,
            title: markerData.title,
            icon: markerData.isUserLocation
              ? {
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: "#3B82F6",
                  fillOpacity: 1,
                  strokeColor: "#ffffff",
                  strokeWeight: 3,
                  scale: 10,
                }
              : {
                  // Pin/marker shape for location markers
                  path: "M12 0C7.589 0 4 3.589 4 8c0 7 8 16 8 16s8-9 8-16c0-4.411-3.589-8-8-8z",
                  fillColor: CATEGORY_COLORS[markerData.category] || "#EF4444",
                  fillOpacity: 1,
                  strokeColor: "#ffffff",
                  strokeWeight: 1.5,
                  scale: 1.5,
                  anchor: new google.maps.Point(12, 24),
                },
          });

          fallbackMarker.addListener("click", () => {
            if (infoWindowRef.current && mapInstanceRef.current) {
              const infoContent = createInfoWindowContent(markerData);
              infoWindowRef.current.setContent(infoContent);
              infoWindowRef.current.open(
                mapInstanceRef.current,
                fallbackMarker
              );
            }
          });

          // IMPORTANT: Add fallback marker to ref too
          markersRef.current.push(fallbackMarker);
        }
      });

      // Fit bounds if there are markers
      if (markers.length > 0 && mapInstanceRef.current) {
        const bounds = new google.maps.LatLngBounds();
        markers.forEach((marker) => {
          bounds.extend(marker.position);
        });
        mapInstanceRef.current.fitBounds(bounds);

        // Set a minimum zoom level
        google.maps.event.addListenerOnce(
          mapInstanceRef.current,
          "idle",
          () => {
            const currentZoom = mapInstanceRef.current?.getZoom();
            if (currentZoom && currentZoom > 15) {
              mapInstanceRef.current?.setZoom(15);
            }
          }
        );
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
);
