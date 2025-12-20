import { db } from "@/server/db";
import { userProgress, listings } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Find user progress entry by listing ID
 */
export async function findProgressEntry(userId: string, listingId: string) {
  const [existing] = await db
    .select()
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.listingId, listingId)
      )
    )
    .limit(1);

  return existing || null;
}

/**
 * Create progress entry
 */
export async function createProgressEntry(
  userId: string,
  listingId: string,
  isBookmarked: boolean = false,
  isVisited: boolean = false,
  visitedAt?: Date
) {
  const [newEntry] = await db
    .insert(userProgress)
    .values({
      userId,
      listingId,
      isBookmarked,
      isVisited,
      visitedAt,
    })
    .returning();

  return newEntry;
}

/**
 * Update bookmark status
 */
export async function updateBookmarkStatus(id: number, isBookmarked: boolean) {
  const [updated] = await db
    .update(userProgress)
    .set({ isBookmarked })
    .where(eq(userProgress.id, id))
    .returning();

  return updated;
}

/**
 * Update visited status
 */
export async function updateVisitedStatus(
  id: number,
  isVisited: boolean,
  visitedAt?: Date | null
) {
  const [updated] = await db
    .update(userProgress)
    .set({ isVisited, visitedAt })
    .where(eq(userProgress.id, id))
    .returning();

  return updated;
}

/**
 * Get all bookmarked items with listing details
 */
export async function findBookmarkedItems(userId: string) {
  return db
    .select({
      id: userProgress.id,
      userId: userProgress.userId,
      listingId: userProgress.listingId,
      isBookmarked: userProgress.isBookmarked,
      isVisited: userProgress.isVisited,
      visitedAt: userProgress.visitedAt,
      createdAt: userProgress.createdAt,
      listing: listings,
    })
    .from(userProgress)
    .innerJoin(listings, eq(userProgress.listingId, listings.id))
    .where(
      and(eq(userProgress.userId, userId), eq(userProgress.isBookmarked, true))
    );
}

/**
 * Get all visited items with listing details
 */
export async function findVisitedItems(userId: string) {
  return db
    .select({
      id: userProgress.id,
      userId: userProgress.userId,
      listingId: userProgress.listingId,
      isBookmarked: userProgress.isBookmarked,
      isVisited: userProgress.isVisited,
      visitedAt: userProgress.visitedAt,
      createdAt: userProgress.createdAt,
      listing: listings,
    })
    .from(userProgress)
    .innerJoin(listings, eq(userProgress.listingId, listings.id))
    .where(
      and(eq(userProgress.userId, userId), eq(userProgress.isVisited, true))
    );
}

/**
 * Get user stats by category
 */
export async function getUserStats(userId: string) {
  const bookmarked = await db
    .select({ category: listings.category })
    .from(userProgress)
    .innerJoin(listings, eq(userProgress.listingId, listings.id))
    .where(
      and(eq(userProgress.userId, userId), eq(userProgress.isBookmarked, true))
    );

  const visited = await db
    .select({ category: listings.category })
    .from(userProgress)
    .innerJoin(listings, eq(userProgress.listingId, listings.id))
    .where(
      and(eq(userProgress.userId, userId), eq(userProgress.isVisited, true))
    );

  // Count by category
  const countByCategory = (items: { category: string }[]) => {
    return items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const visitedByCategory = countByCategory(visited);

  return {
    totalBookmarked: bookmarked.length,
    totalVisited: visited.length,
    placesVisited: visitedByCategory["place"] || 0,
    foodsVisited: visitedByCategory["food"] || 0,
    drinksVisited: visitedByCategory["drink"] || 0,
    souvenirsVisited: visitedByCategory["souvenir"] || 0,
    eventsVisited: visitedByCategory["event"] || 0,
  };
}
