"use client";

import { useSession } from "@/hooks/useSession";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bookmark, MapPin, Trophy, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

async function fetchUserStats() {
  const res = await fetch("/api/user/stats");
  if (!res.ok) throw new Error("Failed to fetch user stats");
  return res.json();
}

async function signOut() {
  await fetch("/api/auth/sign-out", { method: "POST" });
  window.location.href = "/sign-in";
}

export default function ProfilePage() {
  const { session } = useSession();
  const router = useRouter();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["user-stats"],
    queryFn: fetchUserStats,
  });

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.[0].toUpperCase();

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
        <p className="text-foreground-muted">
          Manage your account and progress
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{user?.name}</h2>
            <p className="text-foreground-muted">{user?.email}</p>
            {user?.role === "admin" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 mt-2 text-xs font-medium bg-primary/10 text-primary rounded">
                Admin
              </span>
            )}
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Stats */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Bookmark className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats?.bookmarked || 0}
              </p>
              <p className="text-sm text-foreground-muted">Bookmarked</p>
            </div>

            <div className="text-center p-4 bg-background rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats?.visited || 0}
              </p>
              <p className="text-sm text-foreground-muted">Visited</p>
            </div>

            <div className="text-center p-4 bg-background rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats?.points || 0}
              </p>
              <p className="text-sm text-foreground-muted">Points</p>
            </div>
          </div>
        )}

        <Separator className="mb-6" />

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push("/saved")}
          >
            <Bookmark className="w-4 h-4 mr-2" />
            View Saved Items
          </Button>

          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.recentVisits && stats.recentVisits.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-xl font-bold text-foreground mb-4">
            Recent Visits
          </h3>
          <div className="space-y-3">
            {stats.recentVisits.map(
              (visit: {
                id: string;
                name: string;
                category: string;
                visitedAt: string;
              }) => (
                <div
                  key={visit.id}
                  className="flex items-center justify-between p-3 bg-background rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">{visit.name}</p>
                    <p className="text-sm text-foreground-muted">
                      {visit.category}
                    </p>
                  </div>
                  <p className="text-sm text-foreground-muted">
                    {new Date(visit.visitedAt).toLocaleDateString()}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
