import { NextRequest } from "next/server";
import { asyncHandler, requireAdmin } from "@/server/middleware";
import { checkRateLimit } from "@/server/middleware";
import { validateRequestQuery } from "@/shared/middleware";
import { sendSuccessResponse, AppError } from "@/shared/utils";
import { listingsQuerySchema } from "@/features/listings/schemas";
import { getListings } from "@/server/services/listings";
import { createListing } from "@/server/services/listings/listings.repository";
import { db } from "@/server/db";
import { listingPhotos } from "@/server/db/schema";

export const GET = asyncHandler(async (request: NextRequest) => {
  // Rate limiting
  await checkRateLimit(request);

  // Parse query params
  const searchParams = request.nextUrl.searchParams;
  const rawParams = {
    category: searchParams.get("category") || undefined,
    province: searchParams.get("province") || undefined,
    tag: searchParams.get("tag") || undefined,
    sortByRating: searchParams.get("sortByRating") || undefined,
    sortByPrice: searchParams.get("sortByPrice") || undefined,
    q: searchParams.get("q") || undefined,
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "10",
  };

  const query = validateRequestQuery(listingsQuerySchema, rawParams);

  const result = await getListings(query);

  // Add caching for better performance
  return sendSuccessResponse(result, undefined, {
    cache: {
      maxAge: 30, // Cache for 30 seconds in browser
      sMaxAge: 60, // Cache for 60 seconds in CDN
      staleWhileRevalidate: 300, // Serve stale content for 5 minutes while revalidating
    },
  });
});

export const POST = asyncHandler(async (request: NextRequest) => {
  // Check if user is authenticated and is admin
  await requireAdmin(request);

  const body = await request.json();

  console.log("📦 Received listing data:", JSON.stringify(body, null, 2));

  // Validate required fields
  if (!body.title || !body.category || !body.province) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Missing required fields: title, category, and province"
    );
  }

  if (!body.description || body.description.trim() === "") {
    throw new AppError("VALIDATION_ERROR", "Description is required");
  }

  // Location coordinates are OPTIONAL - convert empty strings to null
  // If province is "All of Cambodia", location can be null

  // Validate XP Points
  const xpPoints = body.xpPoints ? parseInt(body.xpPoints) : 10;
  if (isNaN(xpPoints) || xpPoints < 0) {
    throw new AppError(
      "VALIDATION_ERROR",
      "XP Points must be a positive number"
    );
  }

  // Create slug from title
  const slug = body.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  // Prepare contact info - only if at least one field is provided
  let contactInfo = null;
  if (body.phone || body.website || body.facebook) {
    contactInfo = {
      phone: body.phone || "",
      website: body.website || "",
      facebook: body.facebook || "",
    };
  }

  // Prepare listing data
  const listingData = {
    slug,
    category: body.category,
    tags: body.tags && body.tags.length > 0 ? body.tags : [],
    title: body.title.trim(),
    titleKh: body.titleKh || null,
    description: body.description.trim(),
    addressText: body.address || null,
    lat: parseFloat(body.lat),
    lng: parseFloat(body.lng),
    mainImage: body.mainImage || null,
    priceLevel: body.priceLevel || null,
    priceDetails: body.priceOptions || null,
    operatingHours: body.operatingHours || null,
    contactInfo: contactInfo,
    xpPoints: xpPoints,
    province: body.province,
  };

  console.log(
    "Creating listing with data:",
    JSON.stringify(listingData, null, 2)
  );

  // Create listing
  const newListing = await createListing(listingData);

  // Insert photos if provided - filter out any empty/null URLs
  if (body.photos && body.photos.length > 0) {
    console.log("Photos received:", body.photos);

    const validPhotos = body.photos.filter(
      (url: string) => url && typeof url === "string" && url.trim().length > 0
    );

    console.log("Valid photos after filtering:", validPhotos);

    if (validPhotos.length > 0) {
      await db.insert(listingPhotos).values(
        validPhotos.map((url: string) => ({
          listingId: newListing.id,
          imageUrl: url,
        }))
      );
    }
  }

  return sendSuccessResponse({
    listing: newListing,
    message: "Listing created successfully",
  });
});
