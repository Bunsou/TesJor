import MapPageClient from "../../../features/pageClient/MapPageClient";
import { getListings } from "@/server/services/listings";
import type { Listing } from "@/shared/types";

export default async function MapPage() {
  // Fetch initial map data on server
  let initialItems: Listing[] = [];
  let error: string | null = null;

  try {
    // Fetch all items for initial map load (limit 100 for performance)
    const result = await getListings({ page: 1, limit: 100 });
    initialItems = result.items || [];
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load map data";
    console.error("[MapPage] Error fetching items:", err);
  }

  return <MapPageClient initialItems={initialItems} initialError={error} />;
}
