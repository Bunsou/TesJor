"use client";

import { useState, useEffect } from "react";

interface UserStats {
  bookmarkedCount: number;
  visitedCount: number;
  points: number;
  reviewCount?: number;
}

async function fetchUserStats() {
  const res = await fetch("/api/user/stats");
  if (!res.ok) {
    throw new Error("Failed to fetch user stats");
  }
  const json = await res.json();
  return json.data;
}

export function useProfile() {
  const [stats, setStats] = useState<UserStats>({
    bookmarkedCount: 0,
    visitedCount: 0,
    points: 0,
    reviewCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchUserStats();
        if (isMounted && data) {
          setStats({
            bookmarkedCount: data.bookmarkedCount || 0,
            visitedCount: data.visitedCount || 0,
            points: data.points || 0,
            reviewCount: data.reviewCount || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate user level from points
  const getUserLevel = (points: number) => {
    if (points >= 5000) return { level: 10, name: "Legend" };
    if (points >= 4000) return { level: 9, name: "Master Explorer" };
    if (points >= 3000) return { level: 8, name: "Expert" };
    if (points >= 2500) return { level: 7, name: "Veteran" };
    if (points >= 2000) return { level: 6, name: "Seasoned" };
    if (points >= 1500) return { level: 5, name: "Explorer" };
    if (points >= 1000) return { level: 4, name: "Traveler" };
    if (points >= 500) return { level: 3, name: "Adventurer" };
    if (points >= 200) return { level: 2, name: "Wanderer" };
    return { level: 1, name: "Beginner" };
  };

  const userLevel = getUserLevel(stats.points);

  // Calculate level progress
  const getLevelProgress = (points: number) => {
    const levels = [0, 200, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000];
    const currentLevelIndex = userLevel.level - 1;
    const nextLevelXP = levels[userLevel.level] || 5000;
    const currentLevelXP = levels[currentLevelIndex] || 0;
    const xpInLevel = points - currentLevelXP;
    const xpNeeded = nextLevelXP - currentLevelXP;
    const progress = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));
    const xpToNext = Math.max(0, nextLevelXP - points);
    return { progress, xpToNext };
  };

  const levelProgress = getLevelProgress(stats.points);

  return {
    stats,
    loading,
    userLevel,
    levelProgress,
  };
}
