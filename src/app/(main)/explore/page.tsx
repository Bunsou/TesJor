import ExplorePageClient from "../../../features/pageClient/ExplorePageClient";
import { getListings, getTrendingListings } from "@/server/services/listings";
import { Listing } from "@/server/db/schema";

interface InitialData {
  items: Listing[];
  trendingItems: Listing[];
  hasMore: boolean;
  nextPage: number | null;
}

export default async function ExplorePage() {
  // Fetch initial data on the server - NO loading spinner!
  let initialData: InitialData | null = null;
  let error: string | null = null;

  try {
    // Fetch both regular listings and trending listings in parallel
    const [listingsResult, trendingResult] = await Promise.all([
      getListings({
        category: undefined,
        page: 1,
        limit: 10,
      }),
      getTrendingListings(),
    ]);

    const validItems = listingsResult.items.filter((item) => item && item.id);
    const validTrendingItems = trendingResult.items.filter(
      (item) => item && item.id
    );

    initialData = {
      items: validItems,
      trendingItems: validTrendingItems,
      hasMore: listingsResult.hasMore,
      nextPage: listingsResult.nextPage,
    };
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load initial data";
    console.error("[ExplorePage] Error fetching initial data:", err);
  }

  return <ExplorePageClient initialData={initialData} initialError={error} />;
}
