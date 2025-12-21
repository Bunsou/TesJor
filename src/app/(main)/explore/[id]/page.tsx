import ExploreDetailClient from "../../../../features/pageClient/ExploreDetailClient";
import { getListingBySlug } from "@/server/services/listings";
import { auth } from "@/server/services/auth";
import { headers } from "next/headers";
import { db } from "@/server/db";
import { userProgress } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExploreDetailPage({ params }: PageProps) {
  const { id: slug } = await params;

  // Fetch item details on server
  let initialData = null;
  let error = null;

  try {
    // Get session to check progress
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Fetch listing details
    const listing = await getListingBySlug(slug);

    // If user is logged in, fetch their progress for this item
    let isBookmarked = false;
    let isVisited = false;

    if (session && listing.id) {
      const progress = await db
        .select()
        .from(userProgress)
        .where(
          and(
            eq(userProgress.userId, session.user.id),
            eq(userProgress.listingId, listing.id)
          )
        )
        .limit(1);

      if (progress.length > 0) {
        isBookmarked = progress[0].isBookmarked;
        isVisited = progress[0].isVisited;
      }
    }

    initialData = {
      item: listing,
      isBookmarked,
      isVisited,
    };
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load item details";
    console.error("[ExploreDetailPage] Error:", err);
  }

  return (
    <ExploreDetailClient
      slug={slug}
      initialData={initialData}
      initialError={error}
    />
  );
}
