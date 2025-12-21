"use client";

import {
  useMyTrips,
  TripCard,
  TripsHeader,
  TripsTabs,
  TripsLoadingState,
  TripsEmptyState,
  TripsErrorState,
} from "@/features/user";
import type { ListingWithProgress } from "@/shared/types";

interface MyTripsClientProps {
  initialData?: {
    bookmarkedItems: ListingWithProgress[];
    visitedItems: ListingWithProgress[];
    stats: {
      saved: number;
      visited: number;
    };
  } | null;
  initialError?: string | null;
}

export default function MyTripsClient({
  initialData,
  initialError,
}: MyTripsClientProps) {
  const { activeTab, setActiveTab, items, isLoading, error, stats } =
    useMyTrips({ initialData, initialError });

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background dark:bg-[#201512]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-8">
        <TripsHeader savedCount={stats.saved} visitedCount={stats.visited} />

        <TripsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {isLoading && <TripsLoadingState />}

        {error && <TripsErrorState />}

        {!isLoading && !error && items.length === 0 && (
          <TripsEmptyState type={activeTab} />
        )}

        {!isLoading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
            {items.map((item) => (
              <TripCard
                key={item.id}
                item={item}
                showVisitedState={activeTab === "visited"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
