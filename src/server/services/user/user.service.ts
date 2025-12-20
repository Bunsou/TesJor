import * as repository from "./user.repository";
import { log } from "@/shared/utils";

interface BookmarkParams {
  userId: string;
  listingId: string;
  action: "add" | "remove";
}

interface VisitedParams {
  userId: string;
  listingId: string;
  action: "add" | "remove";
}

/**
 * Toggle bookmark status
 */
export async function toggleBookmark(params: BookmarkParams) {
  const { userId, listingId, action } = params;
  const isBookmarked = action === "add";

  // Check if progress entry exists
  const existing = await repository.findProgressEntry(userId, listingId);

  if (existing) {
    // Update existing entry
    const updated = await repository.updateBookmarkStatus(
      existing.id,
      isBookmarked
    );
    log.info("Updated bookmark status", {
      userId,
      listingId,
      isBookmarked,
    });
    return updated;
  } else {
    // Create new entry
    const newEntry = await repository.createProgressEntry(
      userId,
      listingId,
      isBookmarked,
      false
    );
    log.info("Created new progress entry for bookmark", {
      userId,
      listingId,
      isBookmarked,
    });
    return newEntry;
  }
}

/**
 * Toggle visited status
 */
export async function toggleVisited(params: VisitedParams) {
  const { userId, listingId, action } = params;
  const isVisited = action === "add";
  const visitedAt = isVisited ? new Date() : null;

  // Check if progress entry exists
  const existing = await repository.findProgressEntry(userId, listingId);

  if (existing) {
    // Update existing entry
    const updated = await repository.updateVisitedStatus(
      existing.id,
      isVisited,
      visitedAt
    );
    log.info("Updated visited status", { userId, listingId, isVisited });
    return updated;
  } else {
    // Create new entry
    const newEntry = await repository.createProgressEntry(
      userId,
      listingId,
      false,
      isVisited,
      visitedAt ?? undefined
    );
    log.info("Created new progress entry for visited", {
      userId,
      listingId,
      isVisited,
    });
    return newEntry;
  }
}

/**
 * Get user bookmarks
 */
export async function getUserBookmarks(userId: string) {
  return repository.findBookmarkedItems(userId);
}

/**
 * Get user visited items
 */
export async function getUserVisited(userId: string) {
  return repository.findVisitedItems(userId);
}

/**
 * Get user stats
 */
export async function getUserStats(userId: string) {
  return repository.getUserStats(userId);
}
