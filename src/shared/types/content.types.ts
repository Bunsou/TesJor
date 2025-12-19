// ========================================
// Content Item Types
// ========================================

export interface Place {
  id: string;
  name: string;
  nameKh?: string | null;
  description: string;
  province: string;
  lat: string;
  lng: string;
  mapsUrl?: string | null;
  imageUrl?: string | null;
  priceRange?: string | null;
  openingHours?: string | null;
  createdAt: Date;
}

export interface Activity {
  id: string;
  name: string;
  nameKh?: string | null;
  description: string;
  province: string;
  lat: string;
  lng: string;
  mapsUrl?: string | null;
  imageUrl?: string | null;
  priceRange?: string | null;
  openingHours?: string | null;
  createdAt: Date;
}

export interface Food {
  id: string;
  name: string;
  nameKh?: string | null;
  description: string;
  imageUrl?: string | null;
  priceRange?: string | null;
  createdAt: Date;
}

export interface Drink {
  id: string;
  name: string;
  nameKh?: string | null;
  description: string;
  imageUrl?: string | null;
  priceRange?: string | null;
  createdAt: Date;
}

export interface Souvenir {
  id: string;
  name: string;
  nameKh?: string | null;
  description: string;
  imageUrl?: string | null;
  priceRange?: string | null;
  createdAt: Date;
}

export type Category = "place" | "activity" | "food" | "drink" | "souvenir";

export type ContentItem = (Place | Activity | Food | Drink | Souvenir) & {
  category: Category;
  distance?: number; // For nearby items
};

export type ContentItemWithProgress = ContentItem & {
  isBookmarked?: boolean;
  isVisited?: boolean;
  visitedAt?: Date | null;
};
