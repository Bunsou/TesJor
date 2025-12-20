import { z } from "zod";

// Bookmark Action Schema (Simplified - no category needed)
export const bookmarkSchema = z.object({
  listingId: z.uuid(),
  action: z.enum(["add", "remove"]),
});

// Visited Action Schema (Simplified - no category needed)
export const visitedSchema = z.object({
  listingId: z.uuid(),
  action: z.enum(["add", "remove"]),
});

// Types
export type BookmarkAction = z.infer<typeof bookmarkSchema>;
export type VisitedAction = z.infer<typeof visitedSchema>;
