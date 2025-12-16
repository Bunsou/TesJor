import { z } from "zod";

// Category enum
export const categoryEnum = z.enum([
  "place",
  "activity",
  "food",
  "drink",
  "souvenir",
]);

// Listings Query Schema
export const listingsQuerySchema = z.object({
  category: categoryEnum.optional(),
  province: z.string().optional(),
  q: z.string().optional(), // search term
  cursor: z.string().optional(), // for pagination
  limit: z.coerce.number().min(1).max(50).default(20),
});

// Nearby Query Schema
export const nearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(1).max(50).default(5), // km
});

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

// Base content schema (shared fields)
const baseContentSchema = {
  name: z.string().min(1).max(200),
  nameKh: z.string().max(200).optional(),
  description: z.string().min(10).max(2000),
  imageUrl: z.string().url().optional(),
  priceRange: z.string().max(50).optional(),
};

// Location schema (for places and activities)
const locationSchema = {
  province: z.string().min(1).max(100),
  lat: z.string().min(1), // stored as text in database
  lng: z.string().min(1), // stored as text in database
  mapsUrl: z.string().url().optional(),
  openingHours: z.string().max(200).optional(),
};

// Create Place Schema
export const createPlaceSchema = z.object({
  ...baseContentSchema,
  ...locationSchema,
});

// Create Activity Schema
export const createActivitySchema = z.object({
  ...baseContentSchema,
  ...locationSchema,
});

// Create Food Schema
export const createFoodSchema = z.object({
  ...baseContentSchema,
});

// Create Drink Schema
export const createDrinkSchema = z.object({
  ...baseContentSchema,
});

// Create Souvenir Schema
export const createSouvenirSchema = z.object({
  ...baseContentSchema,
});

// Admin Create Request (unified)
export const adminCreateSchema = z.object({
  category: categoryEnum,
  data: z.union([
    createPlaceSchema,
    createActivitySchema,
    createFoodSchema,
    createDrinkSchema,
    createSouvenirSchema,
  ]),
});

// Types
export type Category = z.infer<typeof categoryEnum>;
export type ListingsQuery = z.infer<typeof listingsQuerySchema>;
export type NearbyQuery = z.infer<typeof nearbyQuerySchema>;
export type BookmarkAction = z.infer<typeof bookmarkSchema>;
export type VisitedAction = z.infer<typeof visitedSchema>;
export type CreatePlace = z.infer<typeof createPlaceSchema>;
export type CreateActivity = z.infer<typeof createActivitySchema>;
export type CreateFood = z.infer<typeof createFoodSchema>;
export type CreateDrink = z.infer<typeof createDrinkSchema>;
export type CreateSouvenir = z.infer<typeof createSouvenirSchema>;
