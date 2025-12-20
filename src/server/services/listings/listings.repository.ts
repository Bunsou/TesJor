import { db } from "@/server/db";
import {
  listings,
  listingPhotos,
  reviews,
  type NewListing,
} from "@/server/db/schema";
import { eq, and, or, ilike, desc, lt, sql, inArray } from "drizzle-orm";

interface ListingsQueryOptions {
  category?: string;
  priceLevel?: string;
  q?: string;
  cursor?: Date | null;
  limit: number;
}

interface NearbyListingsOptions {
  lat: number;
  lng: number;
  radius: number; // in kilometers
  category?: string;
  limit: number;
}

/**
 * Find listings with optional filters
 */
export async function findListings(options: ListingsQueryOptions) {
  const { category, priceLevel, q, cursor, limit } = options;

  const conditions = [];

  // Filter by category
  if (category) {
    conditions.push(eq(listings.category, category as any));
  }

  // Filter by price level
  if (priceLevel) {
    conditions.push(eq(listings.priceLevel, priceLevel as any));
  }

  // Search by title or description
  if (q) {
    conditions.push(
      or(
        ilike(listings.title, `%${q}%`),
        ilike(listings.titleKh, `%${q}%`),
        ilike(listings.description, `%${q}%`)
      )!
    );
  }

  // Pagination cursor
  if (cursor) {
    conditions.push(lt(listings.createdAt, cursor));
  }

  const query = db.select().from(listings);
  const results = await (conditions.length > 0
    ? query.where(and(...conditions)!)
    : query
  )
    .orderBy(desc(listings.createdAt))
    .limit(limit);

  return results;
}

/**
 * Find nearby listings using Haversine formula
 */
export async function findNearbyListings(options: NearbyListingsOptions) {
  const { lat, lng, radius, category, limit } = options;

  // Haversine formula for calculating distance
  const distanceQuery = sql`
    (6371 * acos(
      cos(radians(${lat})) * 
      cos(radians(${listings.lat})) * 
      cos(radians(${listings.lng}) - radians(${lng})) + 
      sin(radians(${lat})) * 
      sin(radians(${listings.lat}))
    ))
  `;

  const conditions = [sql`${distanceQuery} <= ${radius}`];

  if (category) {
    conditions.push(eq(listings.category, category as any));
  }

  const results = await db
    .select({
      id: listings.id,
      slug: listings.slug,
      category: listings.category,
      title: listings.title,
      titleKh: listings.titleKh,
      description: listings.description,
      addressText: listings.addressText,
      lat: listings.lat,
      lng: listings.lng,
      mainImage: listings.mainImage,
      priceLevel: listings.priceLevel,
      views: listings.views,
      avgRating: listings.avgRating,
      createdAt: listings.createdAt,
      distance: distanceQuery.as("distance"),
    })
    .from(listings)
    .where(and(...conditions)!)
    .orderBy(sql`distance`)
    .limit(limit);

  return results;
}

/**
 * Find a single listing by slug
 */
export async function findBySlug(slug: string) {
  const [result] = await db
    .select()
    .from(listings)
    .where(eq(listings.slug, slug))
    .limit(1);

  return result || null;
}

/**
 * Find a single listing by ID
 */
export async function findById(id: string) {
  const [result] = await db
    .select()
    .from(listings)
    .where(eq(listings.id, id))
    .limit(1);

  return result || null;
}

/**
 * Get listing photos
 */
export async function findListingPhotos(listingId: string) {
  return db
    .select()
    .from(listingPhotos)
    .where(eq(listingPhotos.listingId, listingId))
    .orderBy(listingPhotos.createdAt);
}

/**
 * Get listing reviews
 */
export async function findListingReviews(listingId: string) {
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.listingId, listingId))
    .orderBy(desc(reviews.createdAt));
}

/**
 * Find all listings with coordinates (for map)
 */
export async function findAllListingsWithCoords(categories?: string[]) {
  const query = db
    .select({
      id: listings.id,
      slug: listings.slug,
      category: listings.category,
      title: listings.title,
      lat: listings.lat,
      lng: listings.lng,
      mainImage: listings.mainImage,
      priceLevel: listings.priceLevel,
    })
    .from(listings);

  if (categories && categories.length > 0) {
    // Cast string[] to the proper enum types
    return query.where(
      inArray(
        listings.category,
        categories as Array<
          "place" | "food" | "drink" | "souvenir" | "activity"
        >
      )
    );
  }

  return query;
}

/**
 * Create a new listing
 */
export async function createListing(data: NewListing) {
  const [newListing] = await db.insert(listings).values(data).returning();
  return newListing;
}

/**
 * Increment listing views
 */
export async function incrementViews(id: string) {
  await db
    .update(listings)
    .set({ views: sql`${listings.views} + 1` })
    .where(eq(listings.id, id));
}
