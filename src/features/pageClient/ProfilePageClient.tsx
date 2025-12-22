"use client";

import { useState } from "react";
import { useProfile } from "@/features/user/hooks/useProfile";
import {
  ProfileHeader,
  ProfileStatsCards,
  LevelProgress,
  TravelHistory,
  SavedItemsSection,
  BadgesSection,
  ProfileCTA,
} from "@/features/user";
import {
  SAMPLE_TRAVEL_HISTORY,
  SAMPLE_SAVED_ITEMS,
  SAMPLE_BADGES,
} from "@/features/user/constants/profile-sample-data";
import { Session } from "@/server/services/auth";

interface UserStats {
  bookmarkedCount: number;
  visitedCount: number;
  points: number;
  reviewCount?: number;
}

interface ProfilePageClientProps {
  initialSession: Session;
  initialStats?: UserStats | null;
  initialError?: string | null;
}

export default function ProfilePageClient({
  initialSession,
  initialStats,
  initialError,
}: ProfilePageClientProps) {
  const user = initialSession?.user;

  // Use custom hook for profile data
  console.log("A11");
  const { stats, loading, error, userLevel, levelProgress } = useProfile({
    initialStats,
    initialError,
  });

  // Sample data - in production, these would come from API
  const [travelHistory] = useState(SAMPLE_TRAVEL_HISTORY);
  const [savedItems] = useState(SAMPLE_SAVED_ITEMS);
  const [badges] = useState(SAMPLE_BADGES);

  const earnedBadgesCount = badges.filter((b) => b.earned).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background dark:bg-[#201512]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#201512] pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col gap-8">
        {/* Profile Header */}
        <ProfileHeader user={user} userLevel={userLevel} />

        {/* Stats Grid */}
        <ProfileStatsCards
          visitedCount={stats.visitedCount}
          points={stats.points}
          reviewCount={stats.reviewCount || 0}
          bookmarkedCount={stats.bookmarkedCount}
        />

        {/* Main Content Grid */}
        <div className="grid">
          {/* Left Column - Travel History */}
          <div className=" flex flex-col gap-6">
            {/* Level Progress */}
            <LevelProgress
              userLevel={userLevel}
              points={stats.points}
              progress={levelProgress.progress}
              xpToNext={levelProgress.xpToNext}
            />

            {/* Travel History */}
            <TravelHistory items={travelHistory} />
          </div>

          {/* Right Column - Saved & Badges */}
          {/* <div className="lg:col-span-4 flex flex-col gap-6"> */}
          {/* Saved Items */}
          {/* <SavedItemsSection items={savedItems} /> */}

          {/* Badges */}
          {/* <BadgesSection badges={badges} earnedCount={earnedBadgesCount} /> */}

          {/* Premium CTA */}
          {/* <ProfileCTA /> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
