// ========================================
// API Types
// ========================================

import { Listing } from "./content.types";

// Success Response
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Error Response
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Listings Response
export interface ListingsResponse {
  items: Listing[];
  nextCursor: string | null;
  hasMore: boolean;
}

// Nearby Response
export interface NearbyResponse {
  items: (Listing & { distance: number })[];
}

// Pagination
export interface PaginationParams {
  cursor?: string;
  limit?: number;
}
