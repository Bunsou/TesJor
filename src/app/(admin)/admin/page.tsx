"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/features/admin/components/StatCard";
import {
  MapPin,
  Users,
  Bookmark,
  Eye,
  PlusCircle,
  Megaphone,
  UserCog,
  ChevronRight,
} from "lucide-react";

interface DashboardStats {
  totalCards: number;
  totalUsers: number;
  totalBookmarks: number;
  totalVisited: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          const data = await res.json();
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#F9F7F5]/80 dark:bg-[#201512]/80 backdrop-blur-md px-6 py-4 border-b border-gray-200/50 dark:border-gray-800/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 pt-2">
          <span className="hover:text-[#E07A5F] cursor-pointer">Admin</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900 dark:text-white">
            Dashboard
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-8 pb-20">
        {/* Page Title */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Platform Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back. Here&apos;s what&apos;s happening with TesJor today.
          </p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#2A201D] rounded-2xl p-6 h-40 animate-pulse"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 mt-1" />
                  </div>
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="All Cards"
              value={stats ? formatNumber(stats.totalCards) : "0"}
              icon={MapPin}
              iconColor="text-[#E07A5F]"
              iconBgColor="bg-[#E07A5F]/10"
              hoverBorderColor="hover:border-[#E07A5F]"
            />
            <StatCard
              title="Total Users"
              value={stats ? formatNumber(stats.totalUsers) : "0"}
              icon={Users}
              iconColor="text-[#E1B860]"
              iconBgColor="bg-[#E1B860]/10"
              hoverBorderColor="hover:border-[#E1B860]"
            />
            <StatCard
              title="Total Bookmarks"
              value={stats ? formatNumber(stats.totalBookmarks) : "0"}
              icon={Bookmark}
              iconColor="text-[#609BE1]"
              iconBgColor="bg-[#609BE1]/10"
              hoverBorderColor="hover:border-[#609BE1]"
            />
            <StatCard
              title="Total Visited"
              value={stats ? formatNumber(stats.totalVisited) : "0"}
              icon={Eye}
              iconColor="text-purple-500"
              iconBgColor="bg-purple-100 dark:bg-purple-500/10"
              hoverBorderColor="hover:border-purple-500"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white dark:bg-[#2A201D] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Quick Actions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Common tasks you perform frequently.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center md:justify-end">
              <button
                onClick={() => (window.location.href = "/admin/create")}
                className="px-4 py-2 bg-[#E07A5F]/10 hover:bg-[#E07A5F]/20 text-[#E07A5F] rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Add New Card
              </button>
              <button
                onClick={() => (window.location.href = "/admin/users")}
                className="px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
              >
                <UserCog className="w-4 h-4" />
                Manage Users
              </button>
              <button
                onClick={() => (window.location.href = "/explore")}
                className="px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
              >
                <Megaphone className="w-4 h-4" />
                Go to Explore
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
