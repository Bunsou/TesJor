import { db } from "@/server/db";
import { listings, users, userProgress } from "@/server/db/schema";
import { count, eq } from "drizzle-orm";

export interface DashboardStats {
  totalCards: number;
  totalUsers: number;
  totalBookmarks: number;
  totalVisited: number;
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [cardsResult, usersResult, bookmarksResult, visitedResult] =
    await Promise.all([
      db.select({ count: count() }).from(listings),
      db.select({ count: count() }).from(users),
      db
        .select({ count: count() })
        .from(userProgress)
        .where(eq(userProgress.isBookmarked, true)),
      db
        .select({ count: count() })
        .from(userProgress)
        .where(eq(userProgress.isVisited, true)),
    ]);

  return {
    totalCards: cardsResult[0]?.count || 0,
    totalUsers: usersResult[0]?.count || 0,
    totalBookmarks: bookmarksResult[0]?.count || 0,
    totalVisited: visitedResult[0]?.count || 0,
  };
}
