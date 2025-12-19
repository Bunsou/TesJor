import { db } from "@/server/db";
import { userProgress } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import type { Category } from "@/shared/types";

// Find user progress entry
export async function findProgressEntry(
  userId: string,
  itemId: string,
  category: Category
) {
  const columnMap = {
    place: userProgress.placeId,
    activity: userProgress.activityId,
    food: userProgress.foodId,
    drink: userProgress.drinkId,
    souvenir: userProgress.souvenirId,
  };

  const column = columnMap[category];

  const existing = await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(column, itemId)))
    .limit(1);

  return existing[0] || null;
}

// Create progress entry
export async function createProgressEntry(
  userId: string,
  itemId: string,
  category: Category,
  isBookmarked: boolean = false,
  isVisited: boolean = false,
  visitedAt?: Date
) {
  const insertData: Record<string, unknown> = {
    userId,
    isBookmarked,
    isVisited,
    visitedAt,
  };

  // Set the appropriate foreign key
  const columnMap = {
    place: "placeId",
    activity: "activityId",
    food: "foodId",
    drink: "drinkId",
    souvenir: "souvenirId",
  };

  insertData[columnMap[category]] = itemId;

  const [newEntry] = await db
    .insert(userProgress)
    .values(insertData as typeof userProgress.$inferInsert)
    .returning();

  return newEntry;
}

// Update bookmark status
export async function updateBookmarkStatus(id: number, isBookmarked: boolean) {
  const [updated] = await db
    .update(userProgress)
    .set({ isBookmarked })
    .where(eq(userProgress.id, id))
    .returning();

  return updated;
}

// Update visited status
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

// Get all bookmarked items for user
export async function findBookmarkedItems(userId: string) {
  return db
    .select()
    .from(userProgress)
    .where(
      and(eq(userProgress.userId, userId), eq(userProgress.isBookmarked, true))
    );
}

// Get all visited items for user
export async function findVisitedItems(userId: string) {
  return db
    .select()
    .from(userProgress)
    .where(
      and(eq(userProgress.userId, userId), eq(userProgress.isVisited, true))
    );
}

// Get user stats
export async function getUserStats(userId: string) {
  const bookmarked = await findBookmarkedItems(userId);
  const visited = await findVisitedItems(userId);

  return {
    totalBookmarked: bookmarked.length,
    totalVisited: visited.length,
    placesVisited: visited.filter((v) => v.placeId).length,
    activitiesVisited: visited.filter((v) => v.activityId).length,
    foodsVisited: visited.filter((v) => v.foodId).length,
    drinksVisited: visited.filter((v) => v.drinkId).length,
    souvenirsVisited: visited.filter((v) => v.souvenirId).length,
  };
}
