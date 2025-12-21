export * from "./schemas";

// Hooks
export { useMyTrips } from "./hooks/useMyTrips";
export { useProfile } from "./hooks/useProfile";

// Components - Trips
export { TripsHeader } from "./components/TripsHeader";
export { TripsTabs } from "./components/TripsTabs";
export { TripsLoadingState } from "./components/TripsLoadingState";
export { TripsEmptyState } from "./components/TripsEmptyState";
export { TripsErrorState } from "./components/TripsErrorState";

// Components - Profile
export { ProfileHeader } from "./components/ProfileHeader";
export { ProfileStatsCards } from "./components/ProfileStatsCards";
export { LevelProgress } from "./components/LevelProgress";
export { TravelHistory } from "./components/TravelHistory";
export { SavedItemsSection } from "./components/SavedItemsSection";
export { BadgesSection } from "./components/BadgesSection";
export { ProfileCTA } from "./components/ProfileCTA";

// Legacy components (kept for backwards compatibility)
export { TripCard } from "./components/TripCard";
export { StatsCard } from "./components/StatsCard";
export { TravelHistoryItem } from "./components/TravelHistoryItem";
export { BadgeItem } from "./components/BadgeItem";
export { SavedItemCard } from "./components/SavedItemCard";
export {
  LevelProgress as LevelProgressOld,
  ProfileStatsGrid,
} from "./components/ProfileStats";
