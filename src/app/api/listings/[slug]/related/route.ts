import { NextResponse } from "next/server";
import {
  findBySlug,
  findRelatedListings,
} from "@/server/services/listings/listings.repository";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get the current listing to extract its tags and category
    const currentListing = await findBySlug(slug);

    if (!currentListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Find related listings
    const relatedListings = await findRelatedListings(
      currentListing.slug,
      currentListing.tags || [],
      currentListing.category
    );

    return NextResponse.json({
      success: true,
      data: {
        items: relatedListings,
      },
    });
  } catch (error) {
    console.error("[Related Listings API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch related listings" },
      { status: 500 }
    );
  }
}
