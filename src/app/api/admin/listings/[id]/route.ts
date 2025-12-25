import { NextRequest } from "next/server";
import { asyncHandler, requireAdmin } from "@/server/middleware";
import { sendSuccessResponse, AppError } from "@/shared/utils";
import { db } from "@/server/db";
import { listings, listingPhotos } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const GET = asyncHandler(
  async (
    request: NextRequest,
    context?: { params: Promise<{ id: string }> }
  ) => {
    // Check if user is authenticated and is admin
    await requireAdmin(request);

    const { id } = await context!.params;

    if (!id) {
      throw new AppError("VALIDATION_ERROR", "Listing ID is required");
    }

    // Fetch the listing with its photos
    const listing = await db.query.listings.findFirst({
      where: eq(listings.id, id),
    });

    if (!listing) {
      throw new AppError("NOT_FOUND", "Listing not found");
    }

    // Fetch photos separately
    const photos = await db.query.listingPhotos.findMany({
      where: eq(listingPhotos.listingId, id),
    });

    return sendSuccessResponse(
      {
        ...listing,
        photos: photos.map((p) => ({
          id: p.id,
          url: p.imageUrl,
          publicId: "",
        })),
      },
      "Listing fetched successfully"
    );
  }
);

export const PUT = asyncHandler(
  async (
    request: NextRequest,
    context?: { params: Promise<{ id: string }> }
  ) => {
    // Check if user is authenticated and is admin
    await requireAdmin(request);

    const { id } = await context!.params;

    if (!id) {
      throw new AppError("VALIDATION_ERROR", "Listing ID is required");
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.description || !body.category || !body.province) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Title, description, category, and province are required"
      );
    }

    if (typeof body.xpPoints !== "number" || body.xpPoints < 0) {
      throw new AppError(
        "VALIDATION_ERROR",
        "XP Points must be a positive number"
      );
    }

    // Check if listing exists
    const existingListing = await db.query.listings.findFirst({
      where: eq(listings.id, id),
    });

    if (!existingListing) {
      throw new AppError("NOT_FOUND", "Listing not found");
    }

    // Prepare contact info
    let contactInfo = null;
    if (body.phone || body.website || body.facebook) {
      contactInfo = {
        phone: body.phone || "",
        website: body.website || "",
        facebook: body.facebook || "",
      };
    }

    // Update the listing
    const [updatedListing] = await db
      .update(listings)
      .set({
        title: body.title,
        titleKh: body.titleKh || null,
        description: body.description,
        category: body.category,
        province: body.province,
        tags: body.tags || [],
        xpPoints: body.xpPoints,
        addressText: body.address || null,
        lat: body.lat ? parseFloat(body.lat) : null,
        lng: body.lng ? parseFloat(body.lng) : null,
        mainImage: body.mainImage || null,
        priceLevel: body.priceLevel || null,
        priceDetails: body.priceOptions || null,
        operatingHours: body.operatingHours || null,
        contactInfo: contactInfo,
      })
      .where(eq(listings.id, id))
      .returning();

    // Handle photos - delete old ones and create new ones
    if (body.photos && Array.isArray(body.photos)) {
      // Delete all existing photos for this listing
      await db.delete(listingPhotos).where(eq(listingPhotos.listingId, id));

      // Insert new photos - filter out empty URLs
      const validPhotos = body.photos.filter(
        (url: string) => url && typeof url === "string" && url.trim().length > 0
      );

      if (validPhotos.length > 0) {
        await db.insert(listingPhotos).values(
          validPhotos.map((photoUrl: string) => ({
            listingId: id,
            imageUrl: photoUrl,
          }))
        );
      }
    }

    return sendSuccessResponse(updatedListing, "Listing updated successfully");
  }
);

export const DELETE = asyncHandler(
  async (
    request: NextRequest,
    context?: { params: Promise<{ id: string }> }
  ) => {
    // Check if user is authenticated and is admin
    await requireAdmin(request);

    const { id } = await context!.params;

    if (!id) {
      throw new AppError("VALIDATION_ERROR", "Listing ID is required");
    }

    // Delete the listing (cascade will handle photos and reviews)
    const result = await db
      .delete(listings)
      .where(eq(listings.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError("NOT_FOUND", "Listing not found");
    }

    return sendSuccessResponse({ id }, "Listing deleted successfully");
  }
);
