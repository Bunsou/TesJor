"use client";

import { Listing } from "@/server/db/schema";
import { BookCheck, Heart, MapPinned, Zap, Loader2 } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { SignInModal } from "@/components/shared/SignInModal";
import { useState } from "react";

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
  const { session, isLoading } = useSession();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [modalAction, setModalAction] = useState("");

  const handleAuthRequired = (action: () => void, actionName: string) => {
    // Don't show modal while session is still loading
    if (isLoading) return;

    if (!session) {
      setModalAction(actionName);
      setShowSignInModal(true);
      return;
    }
    action();
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A201D] p-4 md:p-5 flex flex-col gap-3 md:gap-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-base md:text-lg text-gray-900 dark:text-white">
          Action Hub
        </h4>
        <div className="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs font-semibold bg-orange-50 dark:bg-orange-900/20 text-[#E07A5F] px-1.5 md:px-2 py-0.5 md:py-1 rounded-md">
          <span className="material-symbols-outlined text-sm">
            <Zap size={16} className="md:w-5 md:h-5" />
          </span>
          +{item.xpPoints} XP
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3">
        <button
          onClick={onGetDirections}
          className="col-span-1 md:col-span-2 w-full px-4 md:px-5 py-3 md:py-4 rounded-xl bg-[#E07A5F] hover:bg-[#c66a50] text-white font-bold text-sm transition-all shadow-lg shadow-[#E07A5F]/30 hover:shadow-[#E07A5F]/40 flex items-center justify-center gap-2 transform active:scale-[0.98] min-h-[48px]"
        >
          <span className="material-symbols-outlined">
            <MapPinned size={18} className="md:w-5 md:h-5" />
          </span>
          Get Directions
        </button>
        <button
          onClick={() =>
            handleAuthRequired(
              () => onToggleVisited(isVisited ? "remove" : "add"),
              "mark this place as visited"
            )
          }
          disabled={isVisitedLoading}
          className={`w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border-2 font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-1.5 md:gap-2 min-h-[48px] ${
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
              <Loader2 size={18} className="md:w-5 md:h-5 animate-spin" />
            ) : (
              <BookCheck size={18} className="md:w-5 md:h-5" />
            )}
          </span>
          {isVisited ? "Visited" : "Mark Visited"}
        </button>
        <button
          onClick={() =>
            handleAuthRequired(
              () => onToggleBookmark(isBookmarked ? "remove" : "add"),
              "bookmark this place"
            )
          }
          disabled={isBookmarkLoading}
          className={`w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border-2 font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-1.5 md:gap-2 min-h-[48px] ${
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
              <Loader2 size={18} className="md:w-5 md:h-5 animate-spin" />
            ) : (
              <Heart
                size={18}
                className="md:w-5 md:h-5"
                fill={isBookmarked ? "currentColor" : "none"}
              />
            )}
          </span>
          {isBookmarked ? "Saved" : "Bookmark"}
        </button>
      </div>
      {!isLoading && !session && (
        <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 text-center">
          Sign in to bookmark or mark as visited
        </p>
      )}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        action={modalAction}
      />
    </div>
  );
}
