import { Loader } from "@googlemaps/js-api-loader";
import { config } from "./config";

let loaderInstance: Loader | null = null;
let loadPromise: Promise<typeof google.maps> | null = null;

export async function loadGoogleMaps(): Promise<typeof google.maps> {
  if (loadPromise) {
    return loadPromise;
  }

  if (!loaderInstance) {
    const apiKey = config.googleMapsApiKey;
    if (!apiKey) {
      throw new Error("Google Maps API key is not configured");
    }

    loaderInstance = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places", "marker"],
    });
  }

  loadPromise = loaderInstance.load();
  return loadPromise;
}
