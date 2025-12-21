"use client";

import { useState, useEffect } from "react";
import type { ListingWithProgress } from "@/shared/types";

interface UseMyTripsParams {
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

async function fetchSavedItems(type: "bookmarked" | "visited") {
  const url = `/api/user/progress?type=${type}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch saved items");
  }

  const json = await res.json();
  return json.data;
}

export function useMyTrips({
  initialData,
  initialError,
}: UseMyTripsParams = {}) {
  const [activeTab, setActiveTab] = useState<"bookmarked" | "visited">(
    "bookmarked"
  );
  const [items, setItems] = useState<ListingWithProgress[]>(
    initialData?.bookmarkedItems || []
  );
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(initialError || null);
  const [stats, setStats] = useState(
    initialData?.stats || { saved: 0, visited: 0 }
  );

  // Fetch saved items when tab changes (skip if we have initial data for the current tab)
  useEffect(() => {
    // If we have initial data and haven't switched tabs yet, skip the fetch
    if (initialData && activeTab === "bookmarked" && items.length > 0) {
      return;
    }

    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchSavedItems(activeTab);

        if (isMounted) {
          setItems(data?.items || []);

          // Update stats
          if (activeTab === "bookmarked") {
            setStats((prev) => ({ ...prev, saved: data?.items?.length || 0 }));
          } else {
            setStats((prev) => ({
              ...prev,
              visited: data?.items?.length || 0,
            }));
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load saved items"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [activeTab, initialData, items.length]);

  // Handle tab switching with initial data
  useEffect(() => {
    if (initialData) {
      if (activeTab === "bookmarked") {
        setItems(initialData.bookmarkedItems);
      } else {
        setItems(initialData.visitedItems);
      }
    }
  }, [activeTab, initialData]);

  return {
    activeTab,
    setActiveTab,
    items,
    isLoading,
    error,
    stats,
  };
}
