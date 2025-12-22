"use client";

interface LevelProgressProps {
  userLevel: { level: number; name: string };
  points: number;
  progress: number;
  xpToNext: number;
}

export function LevelProgress({
  userLevel,
  points,
  progress,
  xpToNext,
}: LevelProgressProps) {
  return (
    <div className="bg-white dark:bg-[#2A201D] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex justify-between items-end mb-3">
        <div>
          <h3 className="font-bold text-lg text-[#1a110f] dark:text-[#f2eae8]">
            Level {userLevel.level} • {userLevel.name}
          </h3>
          <p className="text-xs text-[#926154] dark:text-[#d6c1bd] mt-0.5">
            {points.toLocaleString()} XP
          </p>
        </div>
        <p className="text-xs text-[#926154] dark:text-[#d6c1bd]">
          {xpToNext > 0
            ? `${xpToNext.toLocaleString()} XP to next level`
            : "Max level!"}
        </p>
      </div>
      <div className="relative w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-orange-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
