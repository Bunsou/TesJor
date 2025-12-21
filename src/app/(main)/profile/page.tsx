import ProfilePageClient from "../../../features/pageClient/ProfilePageClient";
import { auth } from "@/server/services/auth";
import { getUserStats } from "@/server/services/user";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

interface UserStats {
  bookmarkedCount: number;
  visitedCount: number;
  points: number;
  reviewCount?: number;
}

export default async function ProfilePage() {
  // Check authentication - redirect if not logged in
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
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
      points: stats?.totalVisited ? stats.totalVisited * 10 : 0, // 10 points per visit
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
