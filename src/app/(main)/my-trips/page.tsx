import MyTripsClient from "../../../features/pageClient/MyTripsClient";
import { SignInPrompt } from "@/components/shared/SignInPrompt";
import { auth } from "@/server/services/auth";
import { getUserBookmarks, getUserVisited } from "@/server/services/user";
import type { ListingWithProgress } from "@/shared/types";
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
  // Check authentication - show sign-in prompt if not logged in
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <SignInPrompt
        title="My Trips"
        description="Sign in to view your saved places and visited destinations."
      />
    );
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
