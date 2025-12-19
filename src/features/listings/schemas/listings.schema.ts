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

// Item ID Schema
export const itemIdSchema = z.object({
  id: z.string().uuid(),
});

// Types
export type Category = z.infer<typeof categoryEnum>;
export type ListingsQuery = z.infer<typeof listingsQuerySchema>;
export type NearbyQuery = z.infer<typeof nearbyQuerySchema>;
export type ItemId = z.infer<typeof itemIdSchema>;
