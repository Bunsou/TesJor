/**
 * @deprecated Use feature schemas instead (e.g., @/features/listings/schemas)
 * This file re-exports validators for backward compatibility
 */

// Re-export from feature modules
export {
  categoryEnum,
  listingsQuerySchema,
  nearbyQuerySchema,
  slugParamSchema,
} from "@/features/listings/schemas";

export { bookmarkSchema, visitedSchema } from "@/features/user/schemas";

export {
  createListingSchema,
  adminCreateSchema,
} from "@/features/admin/schemas";

// Re-export types from shared types
export type { Category } from "@/shared/types";

// Additional type exports
import type { z } from "zod";
import type {
  listingsQuerySchema,
  nearbyQuerySchema,
  createListingSchema,
} from "@/features/listings/schemas";
import type { bookmarkSchema, visitedSchema } from "@/features/user/schemas";
import type { adminCreateSchema } from "@/features/admin/schemas";

export type ListingsQuery = z.infer<typeof listingsQuerySchema>;
export type NearbyQuery = z.infer<typeof nearbyQuerySchema>;
export type BookmarkAction = z.infer<typeof bookmarkSchema>;
export type VisitedAction = z.infer<typeof visitedSchema>;
export type CreateListing = z.infer<typeof createListingSchema>;
export type AdminCreate = z.infer<typeof adminCreateSchema>;
