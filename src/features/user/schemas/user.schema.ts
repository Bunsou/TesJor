import { z } from "zod";
import { categoryEnum } from "@/features/listings/schemas";

// Bookmark Action Schema
export const bookmarkSchema = z.object({
  itemId: z.string().uuid(),
  category: categoryEnum,
  action: z.enum(["add", "remove"]),
});

// Visited Action Schema
export const visitedSchema = z.object({
  itemId: z.string().uuid(),
  category: categoryEnum,
  action: z.enum(["add", "remove"]),
});

// Types
export type BookmarkAction = z.infer<typeof bookmarkSchema>;
export type VisitedAction = z.infer<typeof visitedSchema>;
