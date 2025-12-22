import { z } from "zod";

// Category enum
export const categoryEnum = z.enum([
  "place",
  "food",
  "drink",
  "souvenir",
  "event",
]);

// Price level enum
export const priceLevelEnum = z.enum(["$", "$$", "$$$", "Free"]);

// Province enum
export const provinceEnum = z.enum([
  "Banteay Meanchey",
  "Battambang",
  "Kampong Cham",
  "Kampong Chhnang",
  "Kampong Speu",
  "Kampong Thom",
  "Kampot",
  "Kandal",
  "Kep",
  "Koh Kong",
  "Kratie",
  "Mondulkiri",
  "Oddar Meanchey",
  "Pailin",
  "Phnom Penh",
  "Preah Sihanouk",
  "Preah Vihear",
  "Prey Veng",
  "Pursat",
  "Ratanakiri",
  "Siem Reap",
  "Stung Treng",
  "Svay Rieng",
  "Takeo",
  "Tboung Khmum",
]);

// JSONB Schema Definitions
export const priceDetailSchema = z.object({
  label: z.string(),
  price: z.string(),
  currency: z.enum(["KHR", "USD"]),
});

export const timeSlotSchema = z.object({
  open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
});

export const operatingHoursSchema = z.object({
  monday: z.array(timeSlotSchema).optional(),
  tuesday: z.array(timeSlotSchema).optional(),
  wednesday: z.array(timeSlotSchema).optional(),
  thursday: z.array(timeSlotSchema).optional(),
  friday: z.array(timeSlotSchema).optional(),
  saturday: z.array(timeSlotSchema).optional(),
  sunday: z.array(timeSlotSchema).optional(),
});

export const contactInfoSchema = z.object({
  phone: z.string().optional(),
  facebook: z.string().url().optional(),
  website: z.string().url().optional(),
});

// Listings Query Schema (offset-based pagination)
export const listingsQuerySchema = z.object({
  category: categoryEnum.optional(),
  province: provinceEnum.optional(),
  tag: z.string().optional(), // filter by tag
  sortByRating: z.enum(["default", "asc", "desc"]).optional(), // sort by rating
  sortByPrice: z.enum(["default", "asc", "desc"]).optional(), // sort by price
  q: z.string().optional(), // search term
  page: z.coerce.number().min(1).default(1), // page number for pagination
  limit: z.coerce.number().min(1).max(50).default(10),
});

// Nearby Query Schema
export const nearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(1).max(50).default(5), // km
  category: categoryEnum.optional(),
});

// Slug param schema
export const slugParamSchema = z.object({
  slug: z.string().min(1),
});

// Create Listing Schema
export const createListingSchema = z.object({
  slug: z.string().min(1).max(255),
  category: categoryEnum,
  tags: z.array(z.string().min(1).max(50)).optional(),
  title: z.string().min(1).max(500),
  titleKh: z.string().max(500).optional(),
  description: z.string().min(10),
  province: provinceEnum,
  addressText: z.string().max(500).optional(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  mainImage: z.string().url().optional(),
  priceLevel: priceLevelEnum.optional(),
  priceDetails: z.array(priceDetailSchema).optional(),
  operatingHours: operatingHoursSchema.optional(),
  contactInfo: contactInfoSchema.optional(),
  googlePlaceId: z.string().optional(),
});

// Types
export type Category = z.infer<typeof categoryEnum>;
export type PriceLevel = z.infer<typeof priceLevelEnum>;
export type Province = z.infer<typeof provinceEnum>;
export type PriceDetail = z.infer<typeof priceDetailSchema>;
export type TimeSlot = z.infer<typeof timeSlotSchema>;
export type OperatingHours = z.infer<typeof operatingHoursSchema>;
export type ContactInfo = z.infer<typeof contactInfoSchema>;
export type ListingsQuery = z.infer<typeof listingsQuerySchema>;
export type NearbyQuery = z.infer<typeof nearbyQuerySchema>;
export type SlugParam = z.infer<typeof slugParamSchema>;
export type CreateListing = z.infer<typeof createListingSchema>;
