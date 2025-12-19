import { db } from "@/server/db";
import {
  places,
  activities,
  foods,
  drinks,
  souvenirs,
} from "@/server/db/schema";
import { eq, and, or, ilike, desc, lt } from "drizzle-orm";
import type { Category } from "@/shared/types";

interface ListingsQueryOptions {
  category?: Category;
  province?: string;
  q?: string;
  cursor?: Date | null;
  limit: number;
}

// Find all listings with optional filters
export async function findListings(options: ListingsQueryOptions) {
  const { category, province, q, cursor, limit } = options;

  const items: Array<{
    id: string;
    name: string;
    nameKh?: string | null;
    description: string;
    category: string;
    createdAt: Date;
    [key: string]: unknown;
  }> = [];

  if (!category || category === "place") {
    const conditions = [];
    if (province) conditions.push(ilike(places.province, province));
    if (q) {
      conditions.push(
        or(
          ilike(places.name, `%${q}%`),
          ilike(places.nameKh, `%${q}%`),
          ilike(places.description, `%${q}%`)
        )!
      );
    }
    if (cursor) {
      conditions.push(lt(places.createdAt, cursor));
    }

    const query = db.select().from(places);
    const placeResults = await (conditions.length > 0
      ? query.where(and(...conditions)!)
      : cursor
      ? query.where(lt(places.createdAt, cursor))
      : query
    )
      .orderBy(desc(places.createdAt))
      .limit(limit);

    items.push(...placeResults.map((p) => ({ ...p, category: "place" })));
  }

  if (!category || category === "activity") {
    const conditions = [];
    if (province) conditions.push(ilike(activities.province, province));
    if (q) {
      conditions.push(
        or(
          ilike(activities.name, `%${q}%`),
          ilike(activities.nameKh, `%${q}%`),
          ilike(activities.description, `%${q}%`)
        )!
      );
    }
    if (cursor) {
      conditions.push(lt(activities.createdAt, cursor));
    }

    const query = db.select().from(activities);
    const activityResults = await (conditions.length > 0
      ? query.where(and(...conditions)!)
      : cursor
      ? query.where(lt(activities.createdAt, cursor))
      : query
    )
      .orderBy(desc(activities.createdAt))
      .limit(limit);

    items.push(...activityResults.map((a) => ({ ...a, category: "activity" })));
  }

  if (!category || category === "food") {
    const conditions = [];
    if (q) {
      conditions.push(
        or(
          ilike(foods.name, `%${q}%`),
          ilike(foods.nameKh, `%${q}%`),
          ilike(foods.description, `%${q}%`)
        )!
      );
    }
    if (cursor) {
      conditions.push(lt(foods.createdAt, cursor));
    }

    const query = db.select().from(foods);
    const foodResults = await (conditions.length > 0
      ? query.where(and(...conditions)!)
      : cursor
      ? query.where(lt(foods.createdAt, cursor))
      : query
    )
      .orderBy(desc(foods.createdAt))
      .limit(limit);

    items.push(...foodResults.map((f) => ({ ...f, category: "food" })));
  }

  if (!category || category === "drink") {
    const conditions = [];
    if (q) {
      conditions.push(
        or(
          ilike(drinks.name, `%${q}%`),
          ilike(drinks.nameKh, `%${q}%`),
          ilike(drinks.description, `%${q}%`)
        )!
      );
    }
    if (cursor) {
      conditions.push(lt(drinks.createdAt, cursor));
    }

    const query = db.select().from(drinks);
    const drinkResults = await (conditions.length > 0
      ? query.where(and(...conditions)!)
      : cursor
      ? query.where(lt(drinks.createdAt, cursor))
      : query
    )
      .orderBy(desc(drinks.createdAt))
      .limit(limit);

    items.push(...drinkResults.map((d) => ({ ...d, category: "drink" })));
  }

  if (!category || category === "souvenir") {
    const conditions = [];
    if (q) {
      conditions.push(
        or(
          ilike(souvenirs.name, `%${q}%`),
          ilike(souvenirs.nameKh, `%${q}%`),
          ilike(souvenirs.description, `%${q}%`)
        )!
      );
    }
    if (cursor) {
      conditions.push(lt(souvenirs.createdAt, cursor));
    }

    const query = db.select().from(souvenirs);
    const souvenirResults = await (conditions.length > 0
      ? query.where(and(...conditions)!)
      : cursor
      ? query.where(lt(souvenirs.createdAt, cursor))
      : query
    )
      .orderBy(desc(souvenirs.createdAt))
      .limit(limit);

    items.push(...souvenirResults.map((s) => ({ ...s, category: "souvenir" })));
  }

  return items;
}

// Find item by ID
export async function findById(id: string) {
  const [place, activity, food, drink, souvenir] = await Promise.all([
    db.select().from(places).where(eq(places.id, id)).limit(1),
    db.select().from(activities).where(eq(activities.id, id)).limit(1),
    db.select().from(foods).where(eq(foods.id, id)).limit(1),
    db.select().from(drinks).where(eq(drinks.id, id)).limit(1),
    db.select().from(souvenirs).where(eq(souvenirs.id, id)).limit(1),
  ]);

  if (place[0]) return { ...place[0], category: "place" };
  if (activity[0]) return { ...activity[0], category: "activity" };
  if (food[0]) return { ...food[0], category: "food" };
  if (drink[0]) return { ...drink[0], category: "drink" };
  if (souvenir[0]) return { ...souvenir[0], category: "souvenir" };

  return null;
}

// Find all places with coordinates
export async function findAllPlacesWithCoords() {
  return db.select().from(places);
}

// Find all activities with coordinates
export async function findAllActivitiesWithCoords() {
  return db.select().from(activities);
}

// Create place
export async function createPlace(data: typeof places.$inferInsert) {
  const [newItem] = await db.insert(places).values(data).returning();
  return newItem;
}

// Create activity
export async function createActivity(data: typeof activities.$inferInsert) {
  const [newItem] = await db.insert(activities).values(data).returning();
  return newItem;
}

// Create food
export async function createFood(data: typeof foods.$inferInsert) {
  const [newItem] = await db.insert(foods).values(data).returning();
  return newItem;
}

// Create drink
export async function createDrink(data: typeof drinks.$inferInsert) {
  const [newItem] = await db.insert(drinks).values(data).returning();
  return newItem;
}

// Create souvenir
export async function createSouvenir(data: typeof souvenirs.$inferInsert) {
  const [newItem] = await db.insert(souvenirs).values(data).returning();
  return newItem;
}
