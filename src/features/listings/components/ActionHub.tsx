"use client";

import { Listing } from "@/server/db/schema";
import { BookCheck, Heart, MapPinned, Zap, Loader2 } from "lucide-react";

interface ActionHubProps {
  item: Listing;
  isBookmarked: boolean;
  isVisited: boolean;
  isBookmarkLoading?: boolean;
  isVisitedLoading?: boolean;
  onGetDirections: () => void;
  onToggleVisited: (action: "add" | "remove") => void;
  onToggleBookmark: (action: "add" | "remove") => void;
}

export function ActionHub({
  item,
  isBookmarked,
  isVisited,
  isBookmarkLoading = false,
  isVisitedLoading = false,
  onGetDirections,
  onToggleVisited,
  onToggleBookmark,
}: ActionHubProps) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A201D] p-5 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-lg text-gray-900 dark:text-white">
          Action Hub
        </h4>
        <div className="flex items-center gap-1.5 text-xs font-semibold bg-orange-50 dark:bg-orange-900/20 text-[#E07A5F] px-2 py-1 rounded-md">
          <span className="material-symbols-outlined text-sm">
            <Zap size={20} />
          </span>
          +100 XP
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={onGetDirections}
          className="col-span-1 md:col-span-2 w-full px-5 py-4 rounded-xl bg-[#E07A5F] hover:bg-[#c66a50] text-white font-bold text-sm transition-all shadow-lg shadow-[#E07A5F]/30 hover:shadow-[#E07A5F]/40 flex items-center justify-center gap-2 transform active:scale-[0.98]"
        >
          <span className="material-symbols-outlined">
            <MapPinned size={20} />
          </span>
          Get Directions
        </button>
        <button
          onClick={() => onToggleVisited(isVisited ? "remove" : "add")}
          disabled={isVisitedLoading}
          className={`w-full px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            isVisited
              ? "border-[#2D6A4F] bg-[#2D6A4F] text-white"
              : "border-[#E07A5F]/20 hover:border-[#E07A5F] text-[#E07A5F] hover:bg-[#E07A5F]/5"
          } ${isVisitedLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          <span
            className={`material-symbols-outlined ${
              isVisited ? "icon-filled" : ""
            }`}
          >
            {isVisitedLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <BookCheck size={20} />
            )}
          </span>
          {isVisited ? "Visited" : "Mark Visited"}
        </button>
        <button
          onClick={() => onToggleBookmark(isBookmarked ? "remove" : "add")}
          disabled={isBookmarkLoading}
          className={`w-full px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            isBookmarked
              ? "border-[#E07A5F] bg-[#E07A5F] text-white"
              : "border-[#E07A5F]/20 hover:border-[#E07A5F] text-[#E07A5F] hover:bg-[#E07A5F]/5"
          } ${isBookmarkLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          <span
            className={`material-symbols-outlined ${
              isBookmarked ? "icon-filled" : ""
            }`}
          >
            {isBookmarkLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Heart size={20} fill={isBookmarked ? "currentColor" : "none"} />
            )}
          </span>
          {isBookmarked ? "Saved" : "Bookmark"}
        </button>
      </div>
    </div>
  );
}
