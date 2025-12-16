import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { places, activities, foods, drinks, souvenirs } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get category filter from query params
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("categories");
    const categories = categoryParam ? categoryParam.split(",") : [];

    // If no categories selected, return empty array
    if (categories.length === 0) {
      return NextResponse.json({ items: [] });
    }

    // Fetch items from all category tables
    const allItems = [];

    // Fetch places
    if (categories.includes("place")) {
      const placesData = await db
        .select({
          id: places.id,
          name: places.name,
          nameKh: places.nameKh,
          description: places.description,
          lat: places.lat,
          lng: places.lng,
          imageUrl: places.imageUrl,
          priceRange: places.priceRange,
          openingHours: places.openingHours,
          createdAt: places.createdAt,
        })
        .from(places);

      allItems.push(
        ...placesData.map((p) => ({ ...p, category: "place" as const }))
      );
    }

    // Fetch activities
    if (categories.includes("activity")) {
      const activitiesData = await db
        .select({
          id: activities.id,
          name: activities.name,
          nameKh: activities.nameKh,
          description: activities.description,
          lat: activities.lat,
          lng: activities.lng,
          imageUrl: activities.imageUrl,
          priceRange: activities.priceRange,
          openingHours: activities.openingHours,
          createdAt: activities.createdAt,
        })
        .from(activities);

      allItems.push(
        ...activitiesData.map((a) => ({ ...a, category: "activity" as const }))
      );
    }

    // Fetch foods
    if (categories.includes("food")) {
      const foodsData = await db
        .select({
          id: foods.id,
          name: foods.name,
          nameKh: foods.nameKh,
          description: foods.description,
          imageUrl: foods.imageUrl,
          priceRange: foods.priceRange,
          createdAt: foods.createdAt,
        })
        .from(foods);

      allItems.push(
        ...foodsData.map((f) => ({
          ...f,
          category: "food" as const,
          lat: "",
          lng: "",
          openingHours: "",
        }))
      );
    }

    // Fetch drinks
    if (categories.includes("drink")) {
      const drinksData = await db
        .select({
          id: drinks.id,
          name: drinks.name,
          nameKh: drinks.nameKh,
          description: drinks.description,
          imageUrl: drinks.imageUrl,
          priceRange: drinks.priceRange,
          createdAt: drinks.createdAt,
        })
        .from(drinks);

      allItems.push(
        ...drinksData.map((d) => ({
          ...d,
          category: "drink" as const,
          lat: "",
          lng: "",
          openingHours: "",
        }))
      );
    }

    // Fetch souvenirs
    if (categories.includes("souvenir")) {
      const souvenirsData = await db
        .select({
          id: souvenirs.id,
          name: souvenirs.name,
          nameKh: souvenirs.nameKh,
          description: souvenirs.description,
          imageUrl: souvenirs.imageUrl,
          priceRange: souvenirs.priceRange,
          createdAt: souvenirs.createdAt,
        })
        .from(souvenirs);

      allItems.push(
        ...souvenirsData.map((s) => ({
          ...s,
          category: "souvenir" as const,
          lat: "",
          lng: "",
          openingHours: "",
        }))
      );
    }

    // Filter out items without valid coordinates
    const validItems = allItems.filter(
      (item) => item.lat && item.lng && item.lat !== "" && item.lng !== ""
    );

    return NextResponse.json({ items: validItems });
  } catch (error) {
    console.error("Error fetching all items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}
