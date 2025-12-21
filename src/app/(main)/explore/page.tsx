import ExplorePageClient from "../../../features/pageClient/ExplorePageClient";
import { getListings } from "@/server/services/listings";
import type { Listing } from "@/shared/types";

interface InitialData {
  items: Listing[];
  featuredItem: Listing | null;
  hasMore: boolean;
  nextPage: number | null;
}

export default async function ExplorePage() {
  // Fetch initial data on the server - NO loading spinner!
  let initialData: InitialData | null = null;
  let error: string | null = null;

  try {
    const result = await getListings({
      category: undefined,
      page: 1,
      limit: 10,
    });

    const validItems = result.items.filter((item) => item && item.id);

    initialData = {
      items: validItems.slice(1), // First item is featured
      featuredItem: validItems.length > 0 ? validItems[0] : null,
      hasMore: result.hasMore,
      nextPage: result.nextPage,
    };
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load initial data";
    console.error("[ExplorePage] Error fetching initial data:", err);
  }

  return <ExplorePageClient initialData={initialData} initialError={error} />;
}
