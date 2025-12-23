import ProfilePageClient from "../../../features/pageClient/ProfilePageClient";
import { SignInPrompt } from "@/components/shared/SignInPrompt";
import { auth } from "@/server/services/auth";
import { getUserStats } from "@/server/services/user";
import { headers } from "next/headers";

interface UserStats {
  bookmarkedCount: number;
  visitedCount: number;
  points: number;
  reviewCount?: number;
}

export default async function ProfilePage() {
  // Check authentication - show sign-in prompt if not logged in
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <SignInPrompt
        title="Profile"
        description="Sign in to view your profile, achievements, and travel statistics."
      />
    );
  }

  const userId = session.user.id;

  // Fetch user stats on server for instant loading
  let initialStats: UserStats | null = null;
  let error: string | null = null;

  try {
    const stats = await getUserStats(userId);
    // Map the returned stats to the format expected by the hook
    initialStats = {
      bookmarkedCount: stats?.totalBookmarked || 0,
      visitedCount: stats?.totalVisited || 0,
      points: stats?.xpPoints || 0, // Use xpPoints from stats
      reviewCount: 0, // Reviews not yet tracked
    };
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load profile";
    console.error("[ProfilePage] Error fetching stats:", err);
  }

  return (
    <ProfilePageClient
      initialSession={session}
      initialStats={initialStats}
      initialError={error}
    />
  );
}
