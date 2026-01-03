import { db } from "@/server/db";
import { userProgress, listings, users } from "@/server/db/schema";
import { eq, and, sql } from "drizzle-orm";

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

  const userXpPoints = await db
    .select({ xpPoints: users.xpPoints })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  console.log("User XP Points: ", userXpPoints);

  const visitedByCategory = countByCategory(visited);

  return {
    totalBookmarked: bookmarked.length,
    totalVisited: visited.length,
    placesVisited: visitedByCategory["place"] || 0,
    foodVisited: visitedByCategory["food"] || 0,
    souvenirsVisited: visitedByCategory["souvenir"] || 0,
    eventsVisited: visitedByCategory["event"] || 0,
    xpPoints: userXpPoints[0]?.xpPoints || 0,
  };
}

/**
 * Award XP points to user based on listing's xpPoints
 */
export async function awardXpPoints(userId: string, listingId: string) {
  // Get the listing to find its xpPoints value
  const [listing] = await db
    .select({ xpPoints: listings.xpPoints })
    .from(listings)
    .where(eq(listings.id, listingId))
    .limit(1);

  console.log("Points 11: ", listing.xpPoints);
  if (!listing || !listing.xpPoints) {
    return null;
  }

  // Update user's xpPoints by adding the listing's xpPoints
  const [updated] = await db
    .update(users)
    .set({
      xpPoints: sql`${users.xpPoints} + ${listing.xpPoints}`,
    })
    .where(eq(users.id, userId))
    .returning();

  console.log("Updated user XP points: ", updated.xpPoints);
  return updated;
}

/**
 * Deduct XP points from user based on listing's xpPoints
 */
export async function deductXpPoints(userId: string, listingId: string) {
  // Get the listing to find its xpPoints value
  const [listing] = await db
    .select({ xpPoints: listings.xpPoints })
    .from(listings)
    .where(eq(listings.id, listingId))
    .limit(1);

  if (!listing || !listing.xpPoints) {
    return null;
  }

  // Update user's xpPoints by subtracting the listing's xpPoints
  const [updated] = await db
    .update(users)
    .set({
      xpPoints: sql`GREATEST(0, ${users.xpPoints} - ${listing.xpPoints})`,
    })
    .where(eq(users.id, userId))
    .returning();

  return updated;
}
