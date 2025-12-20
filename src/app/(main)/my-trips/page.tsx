"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ListingWithProgress } from "@/shared/types";
import { getDefaultImage } from "@/lib/default-images";
import { BookCheck, Heart } from "lucide-react";

async function fetchSavedItems(type: "bookmarked" | "visited") {
  const url = `/api/user/progress?type=${type}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch saved items");
  }

  const json = await res.json();
  return json.data;
}

function getCategoryStyle(category: string) {
  const styles: Record<string, string> = {
    place: "bg-green-600/90",
    activity: "bg-blue-500/90",
    food: "bg-orange-500/90",
    drink: "bg-purple-500/90",
    souvenir: "bg-pink-500/90",
  };
  return styles[category] || "bg-[#E07A5F]/90";
}

interface TripCardProps {
  item: ListingWithProgress;
  showVisitedState?: boolean;
}

function TripCard({ item, showVisitedState = false }: TripCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageSrc =
    imageError || !item.mainImage
      ? getDefaultImage(item.category)
      : item.mainImage;

  return (
    <div
      className={`group bg-white dark:bg-[#2A201D] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${
        showVisitedState && item.isVisited ? "opacity-75 hover:opacity-100" : ""
      }`}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <div
          className={`absolute inset-0 transition-transform duration-500 group-hover:scale-110 ${
            showVisitedState && item.isVisited
              ? "grayscale group-hover:grayscale-0"
              : ""
          }`}
        >
          <Image
            src={imageSrc}
            alt={item.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

        {/* Bookmark/Visited Button */}
        <div className="absolute top-3 right-3 z-10">
          {showVisitedState && item.isVisited ? (
            <button className="w-8 h-8 rounded-full bg-green-500 text-white shadow-md flex items-center justify-center cursor-default">
              <span className="material-symbols-outlined text-lg">check</span>
            </button>
          ) : (
            <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-[#E07A5F] transition-colors">
              <span className="material-symbols-outlined text-lg icon-filled">
                <Heart fill="currentColor" strokeWidth={0} />
              </span>
            </button>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`px-2.5 py-1 rounded-md ${getCategoryStyle(
              item.category
            )} text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm`}
          >
            {item.category}
          </span>
        </div>

        {/* Visited Info */}
        {showVisitedState && item.isVisited && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white text-xs font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">history</span>
              Visited recently
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
              {item.title}
            </h3>
            {item.titleKh && (
              <p className="font-khmer text-sm text-gray-500 dark:text-gray-400">
                {item.titleKh}
              </p>
            )}
          </div>
          {item.avgRating && (
            <div className="flex items-center gap-1 text-[#E07A5F] text-xs font-bold bg-[#E07A5F]/10 px-1.5 py-0.5 rounded">
              <span className="material-symbols-outlined text-sm icon-filled">
                star
              </span>
              {item.avgRating}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span className="material-symbols-outlined text-sm">location_on</span>
          <span>
            {item.addressText || "Cambodia"}{" "}
            {item.distance ? `• ${item.distance.toFixed(1)}km away` : ""}
          </span>
        </div>

        <div className="pt-3 mt-1 border-t border-gray-100 dark:border-gray-800 flex gap-2">
          {showVisitedState && item.isVisited ? (
            <button className="w-full py-2 rounded-lg border border-[#E07A5F]/20 text-[#E07A5F] text-xs font-semibold hover:bg-[#E07A5F]/5 transition-colors">
              Write Review
            </button>
          ) : (
            <>
              <Link
                href={`/explore/${item.id}`}
                className="flex-1 py-2 rounded-lg bg-gray-100 dark:bg-white/5 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-900 dark:text-white text-center"
              >
                Details
              </Link>
              <button className="flex-1 py-2 rounded-lg bg-[#E07A5F] text-white text-xs font-semibold hover:bg-[#c66a50] transition-colors shadow-sm shadow-[#E07A5F]/20">
                Plan Trip
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SavedPage() {
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

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#FDFCF6] dark:bg-[#201512]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              My Trips
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your saved adventures and travel history.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="flex gap-4">
            <div className="px-4 py-3 rounded-xl bg-white dark:bg-[#2A201D] border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-[#E07A5F]">
                <span className="material-symbols-outlined icon-filled">
                  <Heart fill="currentColor" strokeWidth={0} />
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold leading-none text-gray-900 dark:text-white">
                  {stats.saved}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Saved
                </p>
              </div>
            </div>
            <div className="px-4 py-3 rounded-xl bg-white dark:bg-[#2A201D] border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                <span className="material-symbols-outlined icon-filled">
                  <BookCheck />
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold leading-none text-gray-900 dark:text-white">
                  {stats.visited}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Visited
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav aria-label="Tabs" className="flex gap-8">
            <button
              onClick={() => setActiveTab("bookmarked")}
              className={`border-b-2 py-4 px-1 text-sm font-semibold transition-colors ${
                activeTab === "bookmarked"
                  ? "border-[#E07A5F] text-[#E07A5F]"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300"
              }`}
            >
              Bookmarked
            </button>
            <button
              onClick={() => setActiveTab("visited")}
              className={`border-b-2 py-4 px-1 text-sm font-semibold transition-colors ${
                activeTab === "visited"
                  ? "border-[#E07A5F] text-[#E07A5F]"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300"
              }`}
            >
              Visited
            </button>
          </nav>
        </div>

        {/* Content */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-gray-500">Loading...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load items</p>
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-gray-400">
                {activeTab === "bookmarked"
                  ? "bookmark_border"
                  : "location_off"}
              </span>
            </div>
            <p className="text-gray-500 text-lg mb-2">
              {activeTab === "bookmarked"
                ? "No bookmarked items yet"
                : "No visited places yet"}
            </p>
            <p className="text-gray-400 text-sm mb-6">
              {activeTab === "bookmarked"
                ? "Start exploring and bookmark your favorites!"
                : "Check in to places you visit to track your journey!"}
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E07A5F] hover:bg-[#c66a50] text-white rounded-xl font-medium shadow-lg shadow-[#E07A5F]/20 transition-colors"
            >
              <span className="material-symbols-outlined">explore</span>
              Start Exploring
            </Link>
          </div>
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
