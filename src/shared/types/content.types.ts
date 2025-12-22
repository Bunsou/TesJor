// ========================================
// Content Item Types (Unified Listings)
// ========================================

import { Listing, ListingPhoto, Review } from "@/server/db/schema";

// Type for listings with optional distance (for regular lists and nearby)
export type ListingWithDistance = Listing & {
  distance?: number; // Distance in kilometers (optional, for nearby/map features)
};

// export type Category = "place" | "food" | "drink" | "souvenir" | "event";
// export type PriceLevel = "$" | "$$" | "$$$" | "Free";

// export interface PriceDetail {
//   label: string;
//   price: string;
//   currency: "KHR" | "USD";
// }

// export interface TimeSlot {
//   open: string; // HH:MM format
//   close: string; // HH:MM format
// }

// export interface OperatingHours {
//   monday?: TimeSlot[];
//   tuesday?: TimeSlot[];
//   wednesday?: TimeSlot[];
//   thursday?: TimeSlot[];
//   friday?: TimeSlot[];
//   saturday?: TimeSlot[];
//   sunday?: TimeSlot[];
// }

// export interface ContactInfo {
//   phone?: string;
//   facebook?: string;
//   website?: string;
// }

// export interface Listing {
//   id: string;
//   slug: string;
//   category: Category;
//   title: string;
//   titleKh?: string | null;
//   description: string;
//   addressText?: string | null;
//   lat: number;
//   lng: number;
//   mainImage?: string | null;
//   priceLevel?: PriceLevel | null;
//   priceDetails?: PriceDetail[] | null;
//   operatingHours?: OperatingHours | null;
//   contactInfo?: ContactInfo | null;
//   googlePlaceId?: string | null;
//   views: number;
//   avgRating?: string | null;
//   createdAt: Date;
//   distance?: number; // For nearby items
// }

// export interface ListingPhoto {
//   id: string;
//   listingId: string;
//   imageUrl: string;
//   caption?: string | null;
//   createdAt: Date;
// }

// export interface Review {
//   id: string;
//   listingId: string;
//   userId: string;
//   rating: number;
//   content?: string | null;
//   createdAt: Date;
//   user?: {
//     name: string;
//     image?: string | null;
//   };
// }

export type ListingWithProgress = Listing & {
  isBookmarked?: boolean;
  isVisited?: boolean;
  visitedAt?: Date | null;
  distance?: number; // For nearby items (in km)
};

export type ListingWithDetails = Listing & {
  photos?: ListingPhoto[];
  reviews?: Review[];
  isBookmarked?: boolean;
  isVisited?: boolean;
  distance?: number; // For nearby items (in km)
};

export type ListingWithBookmarkAndVisit = Listing & {
  isBookmarked: boolean;
  isVisited: boolean;
};
