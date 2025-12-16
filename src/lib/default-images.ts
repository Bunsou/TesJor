/**
 * Get the default placeholder image path for a given category
 * @param category - The content category (place, activity, food, drink, souvenir)
 * @returns The path to the default image in the public directory
 */
export function getDefaultImage(
  category: "place" | "activity" | "food" | "drink" | "souvenir"
): string {
  return `/default-image/${category}.png`;
}

/**
 * Default images mapping for all categories
 */
export const DEFAULT_IMAGES = {
  place: "/default-image/place.png",
  activity: "/default-image/activity.png",
  food: "/default-image/food.png",
  drink: "/default-image/drink.png",
  souvenir: "/default-image/souvenir.png",
} as const;
