import * as repository from "./user.repository";
import { log } from "@/shared/utils";
import type { Category } from "@/shared/types";

interface BookmarkParams {
  userId: string;
  itemId: string;
  category: Category;
  action: "add" | "remove";
}

interface VisitedParams {
  userId: string;
  itemId: string;
  category: Category;
  action: "add" | "remove";
}

// Toggle bookmark status
export async function toggleBookmark(params: BookmarkParams) {
  const { userId, itemId, category, action } = params;
  const isBookmarked = action === "add";

  // Check if progress entry exists
  const existing = await repository.findProgressEntry(userId, itemId, category);

  if (existing) {
    // Update existing entry
    const updated = await repository.updateBookmarkStatus(
      existing.id,
      isBookmarked
    );
    log.info("Updated bookmark status", {
      userId,
      itemId,
      category,
      isBookmarked,
    });
    return updated;
  } else {
    // Create new entry
    const newEntry = await repository.createProgressEntry(
      userId,
      itemId,
      category,
      isBookmarked,
      false
    );
    log.info("Created new progress entry for bookmark", {
      userId,
      itemId,
      category,
      isBookmarked,
    });
    return newEntry;
  }
}

// Toggle visited status
export async function toggleVisited(params: VisitedParams) {
  const { userId, itemId, category, action } = params;
  const isVisited = action === "add";
  const visitedAt = isVisited ? new Date() : null;

  // Check if progress entry exists
  const existing = await repository.findProgressEntry(userId, itemId, category);

  if (existing) {
    // Update existing entry
    const updated = await repository.updateVisitedStatus(
      existing.id,
      isVisited,
      visitedAt
    );
    log.info("Updated visited status", { userId, itemId, category, isVisited });
    return updated;
  } else {
    // Create new entry
    const newEntry = await repository.createProgressEntry(
      userId,
      itemId,
      category,
      false,
      isVisited,
      visitedAt ?? undefined
    );
    log.info("Created new progress entry for visited", {
      userId,
      itemId,
      category,
      isVisited,
    });
    return newEntry;
  }
}

// Get user bookmarks
export async function getUserBookmarks(userId: string) {
  return repository.findBookmarkedItems(userId);
}

// Get user visited items
export async function getUserVisited(userId: string) {
  return repository.findVisitedItems(userId);
}

// Get user stats
export async function getUserStats(userId: string) {
  return repository.getUserStats(userId);
}
