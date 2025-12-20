import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Haversine formula to calculate distance between two coordinates
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * @deprecated Use sendSuccessResponse from @/shared/utils instead
 */
export function successResponse<T>(data: T, messageOrStatus?: string | number) {
  const isStatus = typeof messageOrStatus === "number";
  const status = isStatus ? messageOrStatus : 200;
  const message = !isStatus ? messageOrStatus : undefined;

  return Response.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status }
  );
}

// Text utilities
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// Price utilities
export function formatPriceRange(min?: number, max?: number): string {
  if (!min && !max) return "Free";
  if (min && !max) return `$${min}+`;
  if (!min && max) return `Up to $${max}`;
  return `$${min} - $${max}`;
}

// Category utilities
export function getCategoryDisplayName(
  category: "places" | "events" | "foods" | "drinks" | "souvenirs"
): string {
  const names = {
    places: "Places",
    events: "Events",
    foods: "Foods",
    drinks: "Drinks",
    souvenirs: "Souvenirs",
  };
  return names[category];
}
