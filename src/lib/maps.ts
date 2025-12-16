import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { config } from "./config";

let isInitialized = false;
let loadPromise: Promise<google.maps.MapsLibrary> | null = null;

export async function loadGoogleMaps(): Promise<typeof google.maps> {
  // Return cached promise if already loading/loaded
  if (loadPromise) {
    await loadPromise;
    return google.maps;
  }

  const apiKey = config.googleMapsApiKey;
  if (!apiKey) {
    throw new Error("Google Maps API key is not configured");
  }

  // Set options only once before first import
  if (!isInitialized) {
    setOptions({
      key: apiKey,
      v: "weekly",
      libraries: ["places", "marker"],
    });
    isInitialized = true;
  }

  // Import the maps library (this loads the Google Maps script)
  loadPromise = importLibrary("maps");
  await loadPromise;

  return google.maps;
}
