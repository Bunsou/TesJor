import MyTripsClient from "../../../features/pageClient/MyTripsClient";
import { auth } from "@/server/services/auth";
import { getUserBookmarks, getUserVisited } from "@/server/services/user";
import type { ListingWithProgress } from "@/shared/types";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

interface InitialTripsData {
  bookmarkedItems: ListingWithProgress[];
  visitedItems: ListingWithProgress[];
  stats: {
    saved: number;
    visited: number;
  };
}

export default async function MyTripsPage() {
  // Check authentication - redirect if not logged in
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  // Fetch both bookmarked and visited items in parallel for instant loading
  let initialData: InitialTripsData | null = null;
  let error: string | null = null;

  try {
    const [bookmarkedData, visitedData] = await Promise.all([
      getUserBookmarks(userId),
      getUserVisited(userId),
    ]);

    // Transform the nested data structure to flat ListingWithProgress format
    const bookmarkedItems = (bookmarkedData || []).map((item) => ({
      ...item.listing,
      isBookmarked: item.isBookmarked,
      isVisited: item.isVisited,
      visitedAt: item.visitedAt,
    })) as ListingWithProgress[];

    const visitedItems = (visitedData || []).map((item) => ({
      ...item.listing,
      isBookmarked: item.isBookmarked,
      isVisited: item.isVisited,
      visitedAt: item.visitedAt,
    })) as ListingWithProgress[];

    initialData = {
      bookmarkedItems,
      visitedItems,
      stats: {
        saved: bookmarkedItems.length,
        visited: visitedItems.length,
      },
    };
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load trips";
    console.error("[MyTripsPage] Error fetching initial data:", err);
  }

  return <MyTripsClient initialData={initialData} initialError={error} />;
}
