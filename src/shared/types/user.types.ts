// ========================================
// User Types
// ========================================

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

// Session type for auth
export interface Session {
  session: {
    id: string;
    userId: string;
    createdAt: Date;
    expiresAt: Date;
    token: string;
  };
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    role?: string;
  };
}

export interface UserProgress {
  id: number;
  userId: string;
  isBookmarked: boolean;
  isVisited: boolean;
  visitedAt?: Date | null;
  placeId?: string | null;
  eventId?: string | null;
  foodId?: string | null;
  souvenirId?: string | null;
  createdAt: Date;
}

export interface UserStats {
  totalVisited: number;
  totalBookmarked: number;
  placesVisited: number;
  eventsVisited: number;
  foodVisited: number;
  souvenirsVisited: number;
}
