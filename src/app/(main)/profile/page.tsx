"use client";

import { useSession } from "@/hooks/useSession";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bookmark,
  MapPin,
  Trophy,
  LogOut,
  FileText,
  Shield,
  HelpCircle,
  ChevronRight,
  Star,
  Award,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { TERMS_OF_SERVICE } from "@/constants/terms-of-service";
import { PRIVACY_POLICY } from "@/constants/privacy-policy";
import { HELP_CENTER } from "@/constants/help-center";

async function fetchUserStats() {
  const url = "/api/user/stats";
  console.log("[Profile] Fetching from:", url);

  const res = await fetch(url);
  console.log("[Profile] Response status:", res.status, res.ok);

  if (!res.ok) {
    console.error("[Profile] Failed to fetch:", res.statusText);
    throw new Error("Failed to fetch user stats");
  }

  const json = await res.json();
  console.log("[Profile] Response data:", json);

  return json.data;
}

async function signOut() {
  await fetch("/api/auth/sign-out", { method: "POST" });
  window.location.href = "/sign-in";
}

export default function ProfilePage() {
  const { session } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<{
    bookmarkedCount: number;
    visitedCount: number;
    points: number;
    categoriesVisited?: string[];
    totalProgress?: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user stats on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);

        const data = await fetchUserStats();

        if (isMounted) {
          setStats(data);
          console.log("[Profile] Loaded stats:", data);
        }
      } catch (err) {
        if (isMounted) {
          console.error("[Profile] Error:", err);
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
  }, []);

  const user = session?.user;

  // Get user initials for avatar fallback
  // If name exists, use first letter of each word
  // If no name, use first letter of email
  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2); // Max 2 letters
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const initials = getInitials();

  // Get user level based on points
  const getUserLevel = (points: number) => {
    if (points >= 500)
      return { level: "Legend", color: "text-purple-600", icon: Award };
    if (points >= 250)
      return { level: "Explorer", color: "text-blue-600", icon: Star };
    if (points >= 100)
      return { level: "Adventurer", color: "text-green-600", icon: TrendingUp };
    return { level: "Beginner", color: "text-gray-600", icon: MapPin };
  };

  const userLevel = stats ? getUserLevel(stats.points) : null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
        <p className="text-foreground-muted">
          Manage your account and track your journey
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 mb-4">
        {/* User Info */}
        <div className="flex items-start gap-4 mb-6">
          <Avatar className="w-20 h-20 border-2 border-primary/20">
            <AvatarImage
              src={user?.image || ""}
              alt={user?.name || user?.email || "User"}
            />
            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-foreground truncate">
              {user?.name || user?.email?.split("@")[0] || "User"}
            </h2>
            <p className="text-foreground-muted text-sm truncate">
              {user?.email}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {user?.role === "admin" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              )}
              {userLevel && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-background border rounded-full ${userLevel.color}`}
                >
                  <userLevel.icon className="w-3 h-3" />
                  {userLevel.level}
                </span>
              )}
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Stats */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Bookmark className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.bookmarkedCount || 0}
                </p>
                <p className="text-xs text-foreground-muted font-medium">
                  Bookmarked
                </p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-xl border border-green-500/20">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-green-500/10 rounded-full">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.visitedCount || 0}
                </p>
                <p className="text-xs text-foreground-muted font-medium">
                  Visited
                </p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 rounded-xl border border-yellow-500/20">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-yellow-500/10 rounded-full">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.points || 0}
                </p>
                <p className="text-xs text-foreground-muted font-medium">
                  Points
                </p>
              </div>
            </div>

            {/* Categories Explored */}
            {stats?.categoriesVisited && stats.categoriesVisited.length > 0 && (
              <div className="mb-6 p-4 bg-background rounded-lg border">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  Categories Explored
                </h3>
                <div className="flex flex-wrap gap-2">
                  {stats.categoriesVisited.map((category) => (
                    <span
                      key={category}
                      className="px-3 py-1 text-xs font-medium bg-primary/5 text-primary border border-primary/20 rounded-full capitalize"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-4 mb-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 px-2">
          Quick Actions
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => router.push("/saved")}
            className="w-full flex items-center justify-between p-3 hover:bg-background rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Bookmark className="w-4 h-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">
                  Saved Items
                </p>
                <p className="text-xs text-foreground-muted">
                  View your bookmarks and visits
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-foreground-muted group-hover:text-foreground transition-colors" />
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center justify-between p-3 hover:bg-background rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                <MapPin className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">
                  Explore Places
                </p>
                <p className="text-xs text-foreground-muted">
                  Discover new destinations
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-foreground-muted group-hover:text-foreground transition-colors" />
          </button>
        </div>
      </div>

      {/* Settings & Support */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-4 mb-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 px-2">
          Settings & Support
        </h3>
        <div className="space-y-1">
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full flex items-center justify-between p-3 hover:bg-background rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Terms of Service
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-foreground-muted group-hover:text-foreground transition-colors" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {TERMS_OF_SERVICE.title}
                </DialogTitle>
                <DialogDescription>
                  Last updated: {TERMS_OF_SERVICE.lastUpdated}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-6">
                  {TERMS_OF_SERVICE.sections.map((section, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-foreground mb-2">
                        {section.title}
                      </h3>
                      <p className="text-sm text-foreground-muted leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full flex items-center justify-between p-3 hover:bg-background rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Privacy Policy
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-foreground-muted group-hover:text-foreground transition-colors" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {PRIVACY_POLICY.title}
                </DialogTitle>
                <DialogDescription>
                  Last updated: {PRIVACY_POLICY.lastUpdated}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-6">
                  {PRIVACY_POLICY.sections.map((section, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-foreground mb-2">
                        {section.title}
                      </h3>
                      <p className="text-sm text-foreground-muted leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full flex items-center justify-between p-3 hover:bg-background rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                    <HelpCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Help Center
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-foreground-muted group-hover:text-foreground transition-colors" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {HELP_CENTER.title}
                </DialogTitle>
                <DialogDescription>
                  Last updated: {HELP_CENTER.lastUpdated}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-6">
                  {HELP_CENTER.sections.map((section, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-foreground mb-2">
                        {section.title}
                      </h3>
                      <p className="text-sm text-foreground-muted leading-relaxed whitespace-pre-line">
                        {section.content}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Sign Out */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-4">
        <Button
          variant="destructive"
          className="w-full justify-center gap-2"
          onClick={signOut}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>

      {/* App Info */}
      <div className="text-center mt-6 text-xs text-foreground-muted">
        <p>TesJor v1.0.0</p>
        <p className="mt-1">© 2024 TesJor. All rights reserved.</p>
      </div>
    </div>
  );
}
