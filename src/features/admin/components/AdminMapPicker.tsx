"use client";

import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "@/lib/maps";
import { MapPin, Loader2, Search, X } from "lucide-react";

interface AdminMapPickerProps {
  initialLat: number;
  initialLng: number;
  onLocationSelect: (data: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
  className?: string;
}

interface SearchSuggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
  description: string;
}

export function AdminMapPicker({
  initialLat,
  initialLng,
  onLocationSelect,
  className = "",
}: AdminMapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(true);
  const [currentPosition, setCurrentPosition] = useState({
    lat: initialLat,
    lng: initialLng,
  });
  const [searchAddress, setSearchAddress] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (lat: number, lng: number) => {
    if (!geocoderRef.current) return;

    try {
      const response = await geocoderRef.current.geocode({
        location: { lat, lng },
      });

      if (response.results[0]) {
        const address = response.results[0].formatted_address;
        setCurrentPosition({ lat, lng });
        onLocationSelect({ lat, lng, address });
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
      // Still update coordinates even if address fetch fails
      setCurrentPosition({ lat, lng });
      onLocationSelect({ lat, lng, address: "" });
    }
  };

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true);
        const maps = await loadGoogleMaps();

        if (!mapRef.current) return;

        // Create map
        const map = new maps.Map(mapRef.current, {
          center: { lat: initialLat, lng: initialLng },
          zoom: 12,
          mapTypeId: maps.MapTypeId.TERRAIN,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
        });

        mapInstanceRef.current = map;

        // Initialize geocoder and autocomplete service
        geocoderRef.current = new maps.Geocoder();
        autocompleteServiceRef.current = new maps.places.AutocompleteService();
        placesServiceRef.current = new maps.places.PlacesService(map);

        // Create initial marker
        const marker = new maps.Marker({
          position: { lat: initialLat, lng: initialLng },
          map: map,
          draggable: true,
          animation: maps.Animation.DROP,
        });

        markerRef.current = marker;

        // Handle map click to place marker
        map.addListener("click", async (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();

            // Update marker position
            marker.setPosition(e.latLng);
            marker.setAnimation(maps.Animation.DROP);

            // Get address for this location
            await reverseGeocode(lat, lng);
          }
        });

        // Handle marker drag
        marker.addListener("dragend", async () => {
          const position = marker.getPosition();
          if (position) {
            const lat = position.lat();
            const lng = position.lng();
            await reverseGeocode(lat, lng);
          }
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize map:", error);
        setIsLoading(false);
      }
    };

    initMap();
  }, [initialLat, initialLng]);

  // Handle search using Places Autocomplete
  useEffect(() => {
    if (!searchAddress || searchAddress.length < 2) {
      // Clear suggestions asynchronously to avoid cascading renders
      const timeoutId = setTimeout(() => {
        setSuggestions([]);
        setShowSuggestions(false);
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    const fetchSuggestions = async () => {
      if (!autocompleteServiceRef.current) return;

      try {
        const response =
          await autocompleteServiceRef.current.getPlacePredictions({
            input: searchAddress,
            componentRestrictions: { country: "kh" }, // Restrict to Cambodia
          });

        if (response.predictions) {
          const formattedSuggestions: SearchSuggestion[] =
            response.predictions.map((prediction) => ({
              placeId: prediction.place_id,
              mainText: prediction.structured_formatting.main_text,
              secondaryText:
                prediction.structured_formatting.secondary_text || "",
              description: prediction.description,
            }));
          setSuggestions(formattedSuggestions);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchAddress]);

  // Handle suggestion selection
  const handleSuggestionClick = async (placeId: string) => {
    if (!placesServiceRef.current || !mapInstanceRef.current) return;

    try {
      const maps = await loadGoogleMaps();

      placesServiceRef.current.getDetails(
        {
          placeId: placeId,
          fields: ["geometry", "formatted_address", "name"],
        },
        (place, status) => {
          if (
            status === maps.places.PlacesServiceStatus.OK &&
            place?.geometry?.location
          ) {
            const location = place.geometry.location;
            const lat = location.lat();
            const lng = location.lng();

            // Update map and marker
            mapInstanceRef.current?.setCenter(location);
            mapInstanceRef.current?.setZoom(16);
            markerRef.current?.setPosition(location);
            markerRef.current?.setAnimation(maps.Animation.BOUNCE);

            setTimeout(() => {
              markerRef.current?.setAnimation(null);
            }, 2000);

            // Update form data
            setCurrentPosition({ lat, lng });
            onLocationSelect({
              lat,
              lng,
              address: place.formatted_address || place.name || "",
            });

            // Close suggestions
            setShowSuggestions(false);
            setSuggestions([]);
          }
        }
      );
    } catch (error) {
      console.error("Failed to get place details:", error);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input with Autocomplete */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 z-10" />
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className="pl-10 pr-10 w-full py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#201512] text-gray-900 dark:text-white shadow-lg focus:border-[#E07A5F] focus:ring-2 focus:ring-[#E07A5F]/20 transition-all"
            placeholder="Search for a location..."
          />
          {searchAddress && (
            <button
              type="button"
              onClick={() => {
                setSearchAddress("");
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="mt-2 bg-white dark:bg-[#2A201D] border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-80 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.placeId}
                type="button"
                onClick={() => handleSuggestionClick(suggestion.placeId)}
                className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left border-b border-gray-100 dark:border-gray-800 last:border-b-0"
              >
                <MapPin className="w-5 h-5 text-[#E07A5F] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {suggestion.mainText}
                  </div>
                  {suggestion.secondaryText && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {suggestion.secondaryText}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        ref={mapRef}
        className="w-full h-full rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden"
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#E07A5F] animate-spin" />
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Loading map...
            </p>
          </div>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Coordinates display */}
          <div className="absolute bottom-3 right-3 flex gap-2 pointer-events-none">
            <div className="bg-white dark:bg-[#2A201D] px-3 py-1.5 rounded-lg shadow-md text-xs font-mono border border-gray-200 dark:border-gray-700">
              Lat: {currentPosition.lat.toFixed(6)}
            </div>
            <div className="bg-white dark:bg-[#2A201D] px-3 py-1.5 rounded-lg shadow-md text-xs font-mono border border-gray-200 dark:border-gray-700">
              Lng: {currentPosition.lng.toFixed(6)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
