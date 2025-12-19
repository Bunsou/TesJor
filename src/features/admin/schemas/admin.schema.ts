import { z } from "zod";
import { categoryEnum } from "@/features/listings/schemas";

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

// Admin Create Request Schema
export const adminCreateSchema = z.object({
  category: categoryEnum,
});

// Types
export type CreatePlace = z.infer<typeof createPlaceSchema>;
export type CreateActivity = z.infer<typeof createActivitySchema>;
export type CreateFood = z.infer<typeof createFoodSchema>;
export type CreateDrink = z.infer<typeof createDrinkSchema>;
export type CreateSouvenir = z.infer<typeof createSouvenirSchema>;
