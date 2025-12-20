"use client";

import { useState, useEffect, JSX } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@/hooks/useSession";

import { TERMS_OF_SERVICE } from "@/constants/terms-of-service";
import { PRIVACY_POLICY } from "@/constants/privacy-policy";
import { HELP_CENTER } from "@/constants/help-center";
import {
  CircleStar,
  Heart,
  History,
  MapPlus,
  MessageSquareHeart,
  CalendarCheck,
  CircleCheck,
  Trees,
  Utensils,
  TreePalm,
  Martini,
  Mountain,
} from "lucide-react";
import Image from "next/image";

interface UserStats {
  bookmarkedCount: number;
  visitedCount: number;
  points: number;
  reviewCount?: number;
}

interface TravelHistoryItem {
  id: string;
  type: "visit" | "quest" | "review";
  title: string;
  subtitle: string;
  date: string;
  xp?: number;
  rating?: number;
  image?: string;
  note?: string;
}

interface SavedItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

interface Badge {
  id: string;
  name: string;
  icon: string | JSX.Element;
  earned: boolean;
  color: string;
}

async function fetchUserStats() {
  const res = await fetch("/api/user/stats");
  if (!res.ok) {
    throw new Error("Failed to fetch user stats");
  }
  const json = await res.json();
  return json.data;
}

async function signOut() {
  await fetch("/api/auth/sign-out", { method: "POST" });
  window.location.href = "/sign-in";
}

export default function ProfilePage() {
  const { session } = useSession();
  const user = session?.user;

  const [stats, setStats] = useState<UserStats>({
    bookmarkedCount: 0,
    visitedCount: 0,
    points: 0,
    reviewCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Sample data - in production, these would come from API
  const [travelHistory] = useState<TravelHistoryItem[]>([
    {
      id: "1",
      type: "visit",
      title: 'Attended "Sangkran at Kampong Phluk"',
      subtitle: "Cultural Event • Siem Reap",
      date: "2 days ago",
      xp: 100,
      image: "/default-image/placeholder.png",
      note: "Amazing energy! The boat races were the highlight.",
    },
    {
      id: "2",
      type: "quest",
      title: 'Completed Quest: "Temple Hunter"',
      subtitle: "Achievement Unlocked",
      date: "1 week ago",
      xp: 500,
    },
    {
      id: "3",
      type: "review",
      title: 'Reviewed "Nom Banh Chok Teuk Sray"',
      subtitle: "Local Food • Battambang",
      date: "2 weeks ago",
      rating: 5,
    },
  ]);

  const [savedItems] = useState<SavedItem[]>([
    {
      id: "1",
      title: "Angkor Sangkran",
      subtitle: "Apr 14 • Siem Reap",
      image: "/default-image/placeholder.png",
    },
    {
      id: "2",
      title: "Kulen Waterfall Hike",
      subtitle: "Nature • Siem Reap",
      image: "/default-image/placeholder.png",
    },
  ]);

  const [badges] = useState<Badge[]>([
    {
      id: "1",
      name: "Temple Master",
      icon: "/icons/angkor-wat.png",
      earned: true,
      color: "blue",
    },
    {
      id: "2",
      name: "Nature Lover",
      icon: <Trees />,
      earned: true,
      color: "green",
    },
    {
      id: "3",
      name: "Foodie",
      icon: <Utensils />,
      earned: true,
      color: "yellow",
    },
    {
      id: "4",
      name: "Island Hopper",
      icon: <TreePalm />,
      earned: false,
      color: "gray",
    },
    {
      id: "5",
      name: "Night Owl",
      icon: <Martini />,
      earned: false,
      color: "gray",
    },
    {
      id: "6",
      name: "Adventurer",
      icon: <Mountain />,
      earned: false,
      color: "gray",
    },
  ]);

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
  const earnedBadgesCount = badges.filter((b) => b.earned).length;

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case "visit":
        return <CalendarCheck className="size-[1.2rem]" />;
      case "quest":
        return <CircleCheck className="size-[1.2rem]" />;
      case "review":
        return <MessageSquareHeart className="size-[1.2rem]" />;
      default:
        return "location_on";
    }
  };

  const getHistoryColor = (type: string) => {
    switch (type) {
      case "visit":
        return "bg-primary/10 text-primary";
      case "quest":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      case "review":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
      default:
        return "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400";
    }
  };

  const getBadgeColors = (color: string, earned: boolean) => {
    if (!earned) {
      return "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-dashed border-gray-300 dark:border-gray-600";
    }
    switch (color) {
      case "yellow":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500";
      case "green":
        return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-500";
      case "blue":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9F7F5] dark:bg-[#201512]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F5] dark:bg-[#201512] pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col gap-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-[#2A201D] shadow-lg bg-cover bg-center bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {user?.image ? (
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${user.image}')` }}
                  />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center bg-primary text-white text-3xl font-bold">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl md:text-3xl font-bold text-[#1a110f] dark:text-[#f2eae8]">
                {user?.name || "Guest User"}
              </h1>
              <p className="text-[#926154] dark:text-[#d6c1bd] text-sm md:text-base">
                {user?.email || "Sign in to access your profile"}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  Level {userLevel.level} {userLevel.name}
                </span>
                <span className="text-xs text-[#926154] dark:text-[#d6c1bd]">
                  Join date: Jan 2024
                </span>
              </div>
            </div>
          </div>

          {/* Settings Button */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="px-5 py-2.5 rounded-xl bg-white dark:bg-[#2A201D] border border-gray-200 dark:border-gray-800 text-[#1a110f] dark:text-[#f2eae8] font-medium text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  settings
                </span>
                Settings
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
                <DialogDescription>
                  Manage your account settings
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2 py-4">
                {/* Terms Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left">
                      <span className="material-symbols-outlined text-[#926154]">
                        description
                      </span>
                      <span className="text-[#1a110f] dark:text-[#f2eae8]">
                        Terms of Service
                      </span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>{TERMS_OF_SERVICE.title}</DialogTitle>
                      <DialogDescription>
                        Last updated: {TERMS_OF_SERVICE.lastUpdated}
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                      <div className="space-y-6">
                        {TERMS_OF_SERVICE.sections.map((section, index) => (
                          <div key={index}>
                            <h3 className="font-semibold text-[#1a110f] dark:text-white mb-2">
                              {section.title}
                            </h3>
                            <p className="text-sm text-[#666] dark:text-[#999] whitespace-pre-line">
                              {section.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>

                {/* Privacy Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left">
                      <span className="material-symbols-outlined text-[#926154]">
                        shield
                      </span>
                      <span className="text-[#1a110f] dark:text-[#f2eae8]">
                        Privacy Policy
                      </span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>{PRIVACY_POLICY.title}</DialogTitle>
                      <DialogDescription>
                        Last updated: {PRIVACY_POLICY.lastUpdated}
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                      <div className="space-y-6">
                        {PRIVACY_POLICY.sections.map((section, index) => (
                          <div key={index}>
                            <h3 className="font-semibold text-[#1a110f] dark:text-white mb-2">
                              {section.title}
                            </h3>
                            <p className="text-sm text-[#666] dark:text-[#999] whitespace-pre-line">
                              {section.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>

                {/* Help Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left">
                      <span className="material-symbols-outlined text-[#926154]">
                        help
                      </span>
                      <span className="text-[#1a110f] dark:text-[#f2eae8]">
                        Help Center
                      </span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>{HELP_CENTER.title}</DialogTitle>
                      <DialogDescription>
                        Last updated: {HELP_CENTER.lastUpdated}
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                      <div className="space-y-6">
                        {HELP_CENTER.sections.map((section, index) => (
                          <div key={index}>
                            <h3 className="font-semibold text-[#1a110f] dark:text-white mb-2">
                              {section.title}
                            </h3>
                            <p className="text-sm text-[#666] dark:text-[#999] whitespace-pre-line">
                              {section.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>

                <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                {/* Sign Out */}
                <button
                  onClick={signOut}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left text-red-600"
                >
                  <span className="material-symbols-outlined">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#2A201D] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-primary/30 transition-colors">
            <span className="material-symbols-outlined text-3xl text-primary mb-1 group-hover:scale-110 transition-transform">
              <MapPlus />
            </span>
            <span className="text-2xl font-bold text-[#1a110f] dark:text-[#f2eae8]">
              {stats.visitedCount}
            </span>
            <span className="text-xs text-[#926154] dark:text-[#d6c1bd] font-medium uppercase tracking-wider">
              Places Visited
            </span>
          </div>
          <div className="bg-white dark:bg-[#2A201D] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-primary/30 transition-colors">
            <span className="material-symbols-outlined text-3xl text-primary mb-1 group-hover:scale-110 transition-transform">
              <CircleStar />
            </span>
            <span className="text-2xl font-bold text-[#1a110f] dark:text-[#f2eae8]">
              {stats.points.toLocaleString()}
            </span>
            <span className="text-xs text-[#926154] dark:text-[#d6c1bd] font-medium uppercase tracking-wider">
              XP Earned
            </span>
          </div>
          <div className="bg-white dark:bg-[#2A201D] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-primary/30 transition-colors">
            <span className="material-symbols-outlined text-3xl text-primary mb-1 group-hover:scale-110 transition-transform">
              <MessageSquareHeart />
            </span>
            <span className="text-2xl font-bold text-[#1a110f] dark:text-[#f2eae8]">
              {stats.reviewCount || 0}
            </span>
            <span className="text-xs text-[#926154] dark:text-[#d6c1bd] font-medium uppercase tracking-wider">
              Reviews
            </span>
          </div>
          <div className="bg-white dark:bg-[#2A201D] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-primary/30 transition-colors">
            <span
              className="material-symbols-outlined text-3xl text-primary mb-1 icon-filled"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              <Heart fill="currentColor" strokeWidth={0} />
            </span>
            <span className="text-2xl font-bold text-[#1a110f] dark:text-[#f2eae8]">
              {stats.bookmarkedCount}
            </span>
            <span className="text-xs text-[#926154] dark:text-[#d6c1bd] font-medium uppercase tracking-wider">
              Bookmarked
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Travel History */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Level Progress */}
            <div className="bg-white dark:bg-[#2A201D] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <h3 className="font-bold text-lg text-[#1a110f] dark:text-[#f2eae8]">
                    Level Progress
                  </h3>
                  <p className="text-sm text-[#926154] dark:text-[#d6c1bd]">
                    {levelProgress.xpToNext} XP to Level {userLevel.level + 1}
                  </p>
                </div>
                <span className="text-primary font-bold text-xl">
                  {levelProgress.progress}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full relative overflow-hidden transition-all duration-500"
                  style={{ width: `${levelProgress.progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Travel History */}
            <div className="flex flex-col">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-[#1a110f] dark:text-[#f2eae8]">
                <span className="material-symbols-outlined text-primary">
                  <History />
                </span>
                Travel History
              </h3>
              <div className="bg-white dark:bg-[#2A201D] p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                {travelHistory.map((item, index) => (
                  <div
                    key={item.id}
                    className={`timeline-item relative pl-12 ${
                      index < travelHistory.length - 1 ? "pb-10" : ""
                    }`}
                  >
                    {/* Timeline line */}
                    {index < travelHistory.length - 1 && (
                      <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                    )}

                    {/* Icon */}
                    <div className="absolute left-0 top-0 w-10 h-10 flex items-center justify-center">
                      <div
                        className={`w-10 h-10 rounded-full ${getHistoryColor(
                          item.type
                        )} flex items-center justify-center z-10 border-4 border-white dark:border-[#2A201D]`}
                      >
                        <span
                          className="material-symbols-outlined text-xl"
                          style={
                            item.type === "quest"
                              ? { fontVariationSettings: "'FILL' 1" }
                              : undefined
                          }
                        >
                          {getHistoryIcon(item.type)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <h4 className="font-bold text-base md:text-lg text-[#1a110f] dark:text-[#f2eae8]">
                            {item.title}
                          </h4>
                          <p className="text-sm text-[#926154] dark:text-[#d6c1bd]">
                            {item.subtitle}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-[#926154] dark:text-[#d6c1bd] bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {item.date}
                        </span>
                      </div>

                      {/* Visit with note */}
                      {item.type === "visit" && item.note && (
                        <div className="p-3 rounded-lg bg-[#F9F7F5] dark:bg-[#201512] border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-3 items-start md:items-center">
                          {item.image && (
                            <div
                              className="w-16 h-12 rounded bg-gray-300 bg-cover bg-center shrink-0"
                              style={{
                                backgroundImage: `url('${item.image}')`,
                              }}
                            />
                          )}
                          <p className="text-sm italic text-[#926154] dark:text-[#d6c1bd] flex-1">
                            &ldquo;{item.note}&rdquo;
                          </p>
                          {item.xp && (
                            <div className="flex items-center text-primary text-xs font-bold gap-1 shrink-0">
                              <span>+{item.xp} XP</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Quest badges */}
                      {item.type === "quest" && (
                        <div className="flex gap-2 flex-wrap">
                          <span className="px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 text-xs font-bold flex items-center gap-1 w-fit">
                            <span className="material-symbols-outlined text-sm">
                              emoji_events
                            </span>
                            Gold Badge
                          </span>
                          {item.xp && (
                            <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-bold flex items-center gap-1 w-fit">
                              +{item.xp} XP
                            </span>
                          )}
                        </div>
                      )}

                      {/* Review stars */}
                      {item.type === "review" && item.rating && (
                        <div className="flex text-primary text-sm">
                          {[...Array(item.rating)].map((_, i) => (
                            <span
                              key={i}
                              className="material-symbols-outlined text-sm"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Saved & Badges */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Saved for Later */}
            <div className="bg-white dark:bg-[#2A201D] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-lg text-[#1a110f] dark:text-[#f2eae8]">
                  Saved for Later
                </h4>
                <Link
                  href="/saved"
                  className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  View All
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {savedItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/explore/${item.id}`}
                    className="flex gap-3 items-center p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <div className="w-16 h-16 rounded-lg bg-gray-300 bg-cover bg-center shrink-0 group-hover:scale-95 transition-transform">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={64}
                        height={64}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors text-[#1a110f] dark:text-[#f2eae8]">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#926154] dark:text-[#d6c1bd] truncate">
                        {item.subtitle}
                      </p>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-black/20 shadow-sm text-primary">
                      <span
                        className="material-symbols-outlined text-lg"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        <Heart
                          fill="currentColor"
                          strokeWidth={0}
                          style={{ width: "1.2rem", height: "1.2rem" }}
                        />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white dark:bg-[#2A201D] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-lg text-[#1a110f] dark:text-[#f2eae8]">
                  Badges
                </h4>
                <span className="text-xs text-[#926154] dark:text-[#d6c1bd]">
                  {earnedBadgesCount}/{badges.length} Earned
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`flex flex-col items-center gap-1 group cursor-pointer ${
                      !badge.earned ? "opacity-40 hover:opacity-100" : ""
                    } transition-opacity`}
                  >
                    <div
                      className={`w-14 h-14 rounded-full ${getBadgeColors(
                        badge.color,
                        badge.earned
                      )} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}
                    >
                      <span className="material-symbols-outlined text-3xl">
                        {typeof badge.icon === "string" ? (
                          <Image
                            src={badge.icon}
                            alt={badge.name}
                            width={40}
                            height={40}
                          />
                        ) : (
                          badge.icon
                        )}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold text-center leading-tight text-[#1a110f] dark:text-[#f2eae8]">
                      {badge.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Quest */}
            <div className="bg-gradient-to-br from-primary to-orange-400 p-5 rounded-2xl text-white shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <span className="material-symbols-outlined text-sm">
                    explore
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Suggested Quest
                  </span>
                </div>
                <h4 className="font-bold text-lg mb-1">
                  Hidden Markets of Phnom Penh
                </h4>
                <p className="text-sm text-white/90 mb-4 line-clamp-2">
                  Discover the secret food stalls and vintage shops in the
                  Russian Market area.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">
                    +300 XP Reward
                  </span>
                  <button className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                    <span className="material-symbols-outlined text-lg">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
