import { Loader } from "@googlemaps/js-api-loader";

let loaderInstance: Loader | null = null;
let loadPromise: Promise<typeof google.maps> | null = null;

export async function loadGoogleMaps(): Promise<typeof google.maps> {
  if (loadPromise) {
    return loadPromise;
  }

  if (!loaderInstance) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
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
