"use client";

import { ReactElement } from "react";
import Image from "next/image";

interface Badge {
  id: string;
  name: string;
  icon: string | ReactElement;
  earned: boolean;
  color: string;
}

interface BadgesSectionProps {
  badges: Badge[];
  earnedCount: number;
}

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

export function BadgesSection({ badges, earnedCount }: BadgesSectionProps) {
  return (
    <div className="bg-white dark:bg-[#2A201D] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-[#1a110f] dark:text-[#f2eae8]">
          Badges
        </h3>
        <span className="text-xs text-[#926154] dark:text-[#d6c1bd]">
          {earnedCount}/{badges.length}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 p-3 transition-all ${getBadgeColors(
              badge.color,
              badge.earned
            )} ${badge.earned ? "hover:scale-105" : "opacity-50"}`}
          >
            {typeof badge.icon === "string" ? (
              <Image
                src={badge.icon}
                alt={badge.name}
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <div className="w-8 h-8 flex items-center justify-center">
                {badge.icon}
              </div>
            )}
            <p className="text-[10px] font-semibold text-center leading-tight">
              {badge.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
