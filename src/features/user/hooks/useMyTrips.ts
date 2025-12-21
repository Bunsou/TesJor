"use client";

import { useState, useEffect } from "react";
import type { ListingWithProgress } from "@/shared/types";

async function fetchSavedItems(type: "bookmarked" | "visited") {
  const url = `/api/user/progress?type=${type}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch saved items");
  }

  const json = await res.json();
  return json.data;
}

export function useMyTrips() {
  const [activeTab, setActiveTab] = useState<"bookmarked" | "visited">(
    "bookmarked"
  );
  const [items, setItems] = useState<ListingWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ saved: 0, visited: 0 });

  // Fetch saved items when tab changes
  useEffect(() => {
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
  }, [activeTab]);

  // Fetch both counts on initial load
  useEffect(() => {
    async function loadStats() {
      try {
        const [bookmarkedData, visitedData] = await Promise.all([
          fetchSavedItems("bookmarked"),
          fetchSavedItems("visited"),
        ]);
        setStats({
          saved: bookmarkedData?.items?.length || 0,
          visited: visitedData?.items?.length || 0,
        });
      } catch {
        // Silently fail stats
      }
    }
    loadStats();
  }, []);

  return {
    activeTab,
    setActiveTab,
    items,
    isLoading,
    error,
    stats,
  };
}
